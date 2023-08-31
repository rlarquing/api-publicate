import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {UserMapper} from '../mapper';
import {LogHistoryService} from './log-history.service';
import {genSalt, hash} from 'bcryptjs';
import {
    FunctionRepository,
    RolRepository,
    UserRepository,
} from '../../persistence/repository';
import {
    BuscarDto,
    ChangePasswordDto,
    CreateUserDto,
    FiltroGenericoDto,
    ReadUserDto,
    ResponseDto,
    SelectDto,
    UpdateUserDto,
} from '../../shared/dto';
import {FunctionEntity, RolEntity, UserEntity} from '../../persistence/entity';
import {eliminarDuplicado, removeFromArr} from '../../../lib';
import {HISTORY_ACTION} from '../../persistence/entity/log-history.entity';
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private rolRepository: RolRepository,
        private funcionRepository: FunctionRepository,
        private trazaService: LogHistoryService,
        private userMapper: UserMapper,
    ) {
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<ReadUserDto>> {
        const users: Pagination<UserEntity> = await this.userRepository.findAll(
            options,
        );
        const readUserDto: ReadUserDto[] = [];
        for (const user of users.items) {
            readUserDto.push(await this.userMapper.entityToDto(user));
        }
        return new Pagination(readUserDto, users.meta, users.links);
    }

    async findById(id: string): Promise<ReadUserDto> {
        if (!id) {
            throw new BadRequestException('El id no puede ser vacio');
        }
        const user: UserEntity = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('El usuario no se encuentra.');
        }
        return await this.userMapper.entityToDto(user);
    }

    async findByName(username: string): Promise<ReadUserDto> {
        if (!username) {
            throw new BadRequestException('El username no puede ser vacio');
        }
        const user: UserEntity = await this.userRepository.findByName(username);
        if (!user) {
            throw new NotFoundException('El usuario no se encuentra.');
        }
        return await this.userMapper.entityToDto(user);
    }

    async create(
        user: UserEntity,
        createUserDto: CreateUserDto,
    ): Promise<ResponseDto> {
        const result = new ResponseDto();
        try {
            const newUser = await this.userMapper.dtoToEntity(createUserDto);
            const {password, roles} = createUserDto;
            let {functions} = createUserDto;
            newUser.salt = await genSalt();
            newUser.password = await UserService.hashPassword(password, newUser.salt);
            newUser.roles = await this.rolRepository.findByIds(roles);
            if (functions !== undefined) {
                let funcionsGrupo: FunctionEntity[] = [];
                newUser.roles.forEach((rol: RolEntity) => {
                    funcionsGrupo.concat(rol.functions);
                });
                funcionsGrupo = eliminarDuplicado(funcionsGrupo);
                funcionsGrupo.forEach((funcion: FunctionEntity) =>
                    functions.includes(funcion.id)
                        ? (functions = removeFromArr(functions, funcion.id))
                        : false,
                );
                newUser.functions = await this.funcionRepository.findByIds(functions);
            }
            let userEntity: UserEntity=null;
            const existe:UserEntity = await this.userRepository.existe(newUser.username);
            if (!existe){
                userEntity = await this.userRepository.create(newUser);
            }else{
                newUser.id=existe.id;
                newUser.active=true,
                await this.userRepository.update(newUser);
                userEntity=newUser;
            }

            delete userEntity.salt;
            delete userEntity.password;
            await this.trazaService.create(user, userEntity, HISTORY_ACTION.ADD);
            result.successStatus = true;
            result.message = 'success';
        } catch (error) {
            result.message = error.response;
            result.successStatus = false;
            return result;
        }
        return result;
    }

    async update(
        user: UserEntity,
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<ResponseDto> {
        const result = new ResponseDto();
        let foundUser: UserEntity = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new NotFoundException('No existe el user');
        }
        try {
            foundUser = this.userMapper.dtoToUpdateEntity(updateUserDto, foundUser);
            const {roles} = updateUserDto;
            let {funcions} = updateUserDto;
            foundUser.roles = await this.rolRepository.findByIds(roles);
            if (funcions !== undefined) {
                let funcionsGrupo: FunctionEntity[] = [];
                foundUser.roles.forEach((rol: RolEntity) => {
                    funcionsGrupo.concat(rol.functions);
                });
                funcionsGrupo = eliminarDuplicado(funcionsGrupo);
                funcionsGrupo.forEach((funcion: FunctionEntity) =>
                    funcions.includes(funcion.id)
                        ? (funcions = removeFromArr(funcions, funcion.id))
                        : false,
                );
                foundUser.functions = await this.funcionRepository.findByIds(funcions);
            }
            await this.userRepository.update(foundUser);
            delete foundUser.salt;
            delete foundUser.password;
            await this.trazaService.create(user, foundUser, HISTORY_ACTION.MOD);
            result.successStatus = true;
            result.message = 'success';
        } catch (error) {
            result.message = error.response;
            result.successStatus = false;
            return result;
        }
        return result;
    }

    async delete(user: UserEntity, id: string): Promise<ResponseDto> {
        const result = new ResponseDto();
        if (user.id === id) {
            result.message = 'Usuario autenticado no se puede eliminar.';
            result.successStatus = false;
            return result;
        }
        const userEntity: UserEntity = await this.userRepository.findById(id);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.DEL);
        return await this.userRepository.delete(id);
    }

    private static async hashPassword(
        password: string,
        salt: string,
    ): Promise<string> {
        return hash(password, salt);
    }

    async deleteMultiple(user: UserEntity, ids: string[]): Promise<ResponseDto> {
        let result = new ResponseDto();
        try {
            for (const id of ids) {
                result = await this.delete(user, id);
            }
        } catch (error) {
            result.message = error.detail;
            result.successStatus = false;
            return result;
        }
        return result;
    }

    async filter(
        options: IPaginationOptions,
        filtroGenericoDto: FiltroGenericoDto,
    ): Promise<Pagination<ReadUserDto>> {
        const items: Pagination<UserEntity> = await this.userRepository.filter(
            options,
            filtroGenericoDto.clave,
            filtroGenericoDto.valor,
        );
        const readDto: any[] = [];
        for (const item of items.items) {
            readDto.push(await this.userMapper.entityToDto(item));
        }
        return new Pagination(readDto, items.meta, items.links);
    }

    async search(
        options: IPaginationOptions,
        buscarDto: BuscarDto,
    ): Promise<Pagination<ReadUserDto>> {
        const items: Pagination<UserEntity> = await this.userRepository.search(
            options,
            buscarDto.search,
        );
        const readDto: any[] = [];
        for (const item of items.items) {
            const user = await this.userRepository.findById(item.id);
            readDto.push(await this.userMapper.entityToDto(user));
        }
        return new Pagination(readDto, items.meta, items.links);
    }

    async changePassword(
        user: UserEntity,
        id: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<ResponseDto> {
        const result = new ResponseDto();
        const foundUser: UserEntity = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new NotFoundException('No existe el user');
        }
        try {
            const {password} = changePasswordDto;
            foundUser.password = await UserService.hashPassword(
                password,
                foundUser.salt,
            );
            await this.userRepository.update(foundUser);
            delete foundUser.salt;
            delete foundUser.password;
            await this.trazaService.create(user, foundUser, HISTORY_ACTION.MOD);
            result.successStatus = true;
            result.message = 'success';
        } catch (error) {
            result.message = error.response;
            result.successStatus = false;
            return result;
        }
        return result;
    }

    async createSelect(): Promise<SelectDto[]> {
        const items: any[] = await this.userRepository.createSelect();
        const selectDto: SelectDto[] = [];
        for (const item of items) {
            selectDto.push(new SelectDto(item.id, item.toString()));
        }
        return selectDto;
    }
}
