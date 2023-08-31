import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import {
  FunctionRepository,
  MenuRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  AuthCredentialsDto,
  ReadFunctionDto,
  ReadMenuDto,
  ResponseDto,
  SecretDataDto,
  UserDto,
} from '../../shared/dto';
import { FunctionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import { eliminarDuplicado } from '../../../lib';
import { IJwtPayload } from '../../shared/interface';
import { FunctionMapper, MenuMapper, UserMapper } from '../mapper';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private funcionRepository: FunctionRepository,
    private funcionMapper: FunctionMapper,
    private menuRepository: MenuRepository,
    private menuMapper: MenuMapper,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async signUp(userDto: UserDto): Promise<ResponseDto> {
    const result = new ResponseDto();
    const { username, password, email } = userDto;
    const userEntity: UserEntity = new UserEntity(username, email);
    userEntity.salt = await genSalt();
    userEntity.password = await AuthService.hashPassword(
      password,
      userEntity.salt,
    );
    try {
      await this.userRepository.signUp(userEntity);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SecretDataDto> {
    const { username, password } = authCredentialsDto;
    const credential = await this.userRepository.validateUserPassword(
      username,
      password,
    );
    if (!credential) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const user: UserEntity = await this.userRepository.findByName(username);
    const funcionsIndiv: FunctionEntity[] = user.functions;
    let funcions: FunctionEntity[] = [];
    let item: RolEntity;
    for (const rol of user.roles) {
      item = await this.rolRepository.findById(rol.id);
      item.functions.forEach((funcion: FunctionEntity) =>
        funcion.active ? funcions.push(funcion) : null,
      );
    }
    funcions = funcions.concat(funcionsIndiv);
    funcions = eliminarDuplicado(funcions);
    funcions = await this.funcionRepository.findByIds(funcions.map(item=>item.id));
    const readFuncionDtos: ReadFunctionDto[] = [];
    for (const funcion of funcions) {
      readFuncionDtos.push(await this.funcionMapper.entityToDto(funcion));
    }
    const readMenuDtos: ReadMenuDto[] = [];
    for (const readFuncionDto of readFuncionDtos) {
      if (readFuncionDto.menu !== undefined) {
        readMenuDtos.push(readFuncionDto.menu);
      }
    }
    const payload: IJwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);
    // await this.mailService.sendUserConfirmation(user);
    return {
      accessToken,
      refreshToken,
      functions: readFuncionDtos,
      menus: readMenuDtos,
    };
  }
  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return hash(password, salt);
  }
  public async getRefreshToken(id: string): Promise<string> {
    const userEntity: UserEntity = await this.userRepository.findById(id);
    userEntity.refreshToken = randomToken.generate(16);
    userEntity.refreshTokenExp = moment().add(1, 'days').format('YYYY/MM/DD');
    await this.userRepository.update(userEntity);
    return userEntity.refreshToken;
  }
  async regenerateTokens(user: UserEntity): Promise<SecretDataDto> {
    const username = user.username;
    const userEntity: UserEntity = await this.userRepository.findById(user.id);
    const funcionsIndiv: FunctionEntity[] = userEntity.functions;
    let funcions: FunctionEntity[] = [];
    let item: RolEntity;
    for (const rol of userEntity.roles) {
      item = await this.rolRepository.findById(rol.id);
      item.functions.forEach((funcion: FunctionEntity) =>
        funcion.active ? funcions.push(funcion) : null,
      );
    }
    funcions = funcions.concat(funcionsIndiv);
    funcions = eliminarDuplicado(funcions);

    const readFuncionDtos: ReadFunctionDto[] = [];
    for (const funcion of funcions) {
      readFuncionDtos.push(await this.funcionMapper.entityToDto(funcion));
    }
    // const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
    const readMenuDtos: ReadMenuDto[] = [];
    for (const readFuncionDto of readFuncionDtos) {
      if (readFuncionDto.menu !== undefined) {
        readMenuDtos.push(readFuncionDto.menu);
      }
    }
    const payload: IJwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      functions: readFuncionDtos,
      menus: readMenuDtos,
    };
  }
  async logout(user: UserEntity): Promise<ResponseDto> {
    user.refreshToken = null;
    user.refreshTokenExp = null;
    await this.userRepository.update(user);
    const result = new ResponseDto();
    result.successStatus = true;
    result.message = 'success';
    return result;
  }
}
