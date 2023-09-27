import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RolEntity, UserEntity } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import * as moment from 'moment';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import { RolType } from '../../shared/enum';
import { ResponseDto } from '../../shared/dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {}

  async signUp(userEntity: UserEntity): Promise<UserEntity> {
    const wheres = {
      active: true,
      name: RolType.USUARIO,
    } as FindOptionsWhere<RolEntity>;
    const rol: RolEntity = await this.rolRepository.findOneBy(wheres);

    if (!rol) {
      throw new NotFoundException('No existe el rol');
    }
    userEntity.roles = [rol];
    try {
      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'El nombre del usuario ya existe en el sistema.',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    // Ejemplo funcional de como trabajar con queryBuilder
    // const queryBuilder = this.userRepository.createQueryBuilder('u');
    // queryBuilder.leftJoinAndSelect('u.roles', 'roles')
    // queryBuilder.where('u.status = :status', { active: true });
    // return await paginate<UserEntity>(queryBuilder, options);
    const where = {
      where: { active: true },
      relations: ['roles', 'functions', 'plan', 'province', 'municipality'],
    } as FindManyOptions;
    return await paginate<UserEntity>(this.userRepository, options, where);
  }

  async findById(id: string): Promise<UserEntity> {
    const options = {
      where: { id: id, active: true },
      relations: ['roles', 'functions', 'plan', 'province', 'municipality'],
    } as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    const options = {
      where: { id: In(ids), active: true },
      relations: {
        roles: true,
        functions: true,
      },
    } as FindManyOptions<UserEntity>;
    return await this.userRepository.find(options);
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    try {
      return await this.userRepository.save(userEntity);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El email o el usuario ya ha sido registrado',
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async update(updatedUser: UserEntity): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      await this.userRepository.save(updatedUser);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async delete(id: string): Promise<ResponseDto> {
    const result = new ResponseDto();
    const options = { id, active: true } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (!user) {
      throw new NotFoundException('No existe el usuario');
    }
    user.active = false;
    try {
      await this.userRepository.save(user);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
    }
    return result;
  }

  async validateUserPassword(
    username: string,
    password: string,
  ): Promise<string> {
    const options = { username } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async findByName(username: string): Promise<UserEntity> {
    const options = {
      where: { active: true, username: username },
      relations: { roles: true, functions: true },
    } as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  public async validateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<UserEntity> {
    const currentDate = moment().format('YYYY/MM/DD');
    const options = {
      active: true,
      username: username,
      refreshToken: refreshToken,
      refreshTokenExp: MoreThanOrEqual(currentDate),
    } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (!user) {
      return null;
    }
    return user;
  }

  async filter(
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<UserEntity>> {
    const wheres = { active: true } as FindOptionsWhere<UserEntity>;
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        const date = { date: Between(start.toISOString(), end.toISOString()) };
        wheres[claves[i]] = date;
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const where = {
      where: wheres,
      relations: ['roles', 'functions', 'plan', 'province', 'municipality'],
    } as FindManyOptions;
    return await paginate<UserEntity>(this.userRepository, options, where);
  }

  async search(
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<UserEntity>> {
    if (!isEmpty(search)) {
      const where = { active: true } as FindManyOptions<UserEntity>;
      const result = await this.userRepository.find(where);
      const objs = new Map<string, string>();
      let keys: string[];
      if (result.length > 0) {
        keys = Object.keys(result[0]);
      }
      for (const key of keys) {
        for (const item of result) {
          if (
            isString(item[key]) &&
            isString(search) &&
            item[key].toLowerCase().indexOf(search.toLowerCase()) !== -1
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} ILIKE '%${search}%'`);
            }
          } else if (
            isNumber(item[key]) &&
            isNumber(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} = :search`);
            }
          } else if (
            isDate(item[key]) &&
            isDate(search) &&
            item[key] === search
          ) {
            const datep = item[key];
            const start = new Date(datep.setHours(0, 0, 0, 0));
            const end = new Date(datep.setHours(23, 59, 59, 999));
            const date = {
              date: Between(start.toISOString(), end.toISOString()),
            };
            if (!objs.has(key)) {
              objs.set(key, `${key}=${date}`);
            }
          } else if (
            isBoolean(item[key]) &&
            isBoolean(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key}= :search`);
            }
          }
        }
      }
      const queryBuilder = this.userRepository.createQueryBuilder('u');
      queryBuilder.leftJoinAndSelect('u.roles', 'roles');
      if (objs.size === 0) {
        queryBuilder.where(`u.active = true AND u.id=0`);
      } else {
        const where: string[] = [];
        objs.forEach((item) => {
          where.push(`u.${item}`);
        });
        queryBuilder.where(`u.active = true AND ${where.join(' OR ')}`, {
          search: search,
        });
      }
      return await paginate<UserEntity>(queryBuilder, options);
    }
  }

  async createSelect(): Promise<UserEntity[]> {
    const options = {
      where: { active: true },
      relations: ['roles', 'functions', 'plan', 'province', 'municipality'],
    } as FindManyOptions;
    return await this.userRepository.find(options);
  }

  async existe(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username: username },
    } as FindOneOptions);
  }

  async remove(ids: string[]): Promise<DeleteResult> {
    return await this.userRepository.delete(ids);
  }

  async activateUser(user: UserEntity): Promise<void> {
    user.active = true;
    await this.userRepository.save(user);
  }

  async findOneInactiveByIdAndCodeActivation(
    id: string,
    code: number,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: id, codeActivation: code, active: false },
    } as FindOneOptions);
  }
}
