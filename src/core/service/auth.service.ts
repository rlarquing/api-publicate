import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import {
  FunctionRepository,
  MenuRepository,
  MunicipalityRepository,
  PlanRepository,
  ProvinceRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  ActivateUserDto,
  AuthCredentialsDto,
  ChangePasswordDto,
  ReadFunctionDto,
  ReadMenuDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  ResponseDto,
  SecretDataDto,
  UserDto,
} from '../../shared/dto';
import {
  FunctionEntity,
  MunicipalityEntity,
  PlanEntity,
  ProvinceEntity,
  RolEntity,
  UserEntity,
} from '../../persistence/entity';
import { eliminarDuplicado } from '../../../lib';
import { IJwtPayload } from '../../shared/interface';
import { FunctionMapper, MenuMapper } from '../mapper';
import { MailService } from '../../mail/mail.service';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';
import { AppConfig } from '../../app.keys';
import { ConfigService } from '@nestjs/config';
import { LogHistoryService } from './log-history.service';

@Injectable()
export class AuthService {
  private isProductionEnv;
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private funcionRepository: FunctionRepository,
    private funcionMapper: FunctionMapper,
    private menuRepository: MenuRepository,
    private menuMapper: MenuMapper,
    private jwtService: JwtService,
    private mailService: MailService,
    private planRepository: PlanRepository,
    private provinceRepository: ProvinceRepository,
    private municipalityRepository: MunicipalityRepository,
    private logHistoryService: LogHistoryService,
  ) {
    this.isProductionEnv =
      this.configService.get(AppConfig.NODE_ENV) === 'production';
  }
  async signUp(userDto: UserDto): Promise<ResponseDto> {
    const result = new ResponseDto();
    const {
      username,
      password,
      email,
      phone,
      expire,
      plan,
      province,
      municipality,
    } = userDto;
    const planEntity: PlanEntity = await this.planRepository.findById(plan);
    const provinceEntity: ProvinceEntity =
      await this.provinceRepository.findById(province);
    const municipalityEntity: MunicipalityEntity =
      await this.municipalityRepository.findById(municipality);
    const userEntity: UserEntity = new UserEntity(
      username,
      email,
      phone,
      expire,
      planEntity,
      provinceEntity,
      municipalityEntity,
    );
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
    await this.mailService.sendUserConfirmation(userEntity);
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
    funcions = await this.funcionRepository.findByIds(
      funcions.map((item) => item.id),
    );
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

  async activateUser(activateUserDto: ActivateUserDto): Promise<ResponseDto> {
    const response = new ResponseDto();
    const { id, code } = activateUserDto;
    const user: UserEntity =
      await this.userRepository.findOneInactiveByIdAndCodeActivation(id, code);

    if (!user) {
      throw new UnprocessableEntityException(
        'La cuenta del usuario no se pudo activar',
      );
    }
    await this.userRepository.activateUser(user);
    response.successStatus = true;
    response.message = 'Se ha activado su cuenta de usuario.';
    return response;
  }

  async requestResetPasword(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<ResponseDto> {
    const { email } = requestResetPasswordDto;
    const user: UserEntity = await this.userRepository.findOneByEmail(email);
    user.resetPasswordCode = Math.round(Math.random() * 999999);
    const response = await this.userRepository.update(user);
    if (response.successStatus) {
      response.message = `Enviado el código al correo: ${email}`;
    }
    await this.mailService.sendRequestResetPassword(user);
    return response;
  }

  async resetPasword(resetPasswordDto: ResetPasswordDto): Promise<ResponseDto> {
    const { resetPasswordCode, password } = resetPasswordDto;
    const user: UserEntity =
      await this.userRepository.findOneByResetPasswordCode(resetPasswordCode);
    user.password = await AuthService.hashPassword(password, user.salt);
    user.resetPasswordCode = null;
    const response = await this.userRepository.update(user);
    if (response.successStatus) {
      response.message = `Se ha cambiado su contraseña.`;
    }
    return response;
  }

  async changePassword(
    user: UserEntity,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const foundUser: UserEntity = await this.userRepository.findById(user.id);
    if (!foundUser) {
      throw new NotFoundException('No existe el user');
    }

    let { password, oldPassword } = changePasswordDto;
    password = await AuthService.hashPassword(password, foundUser.salt);
    oldPassword = await AuthService.hashPassword(oldPassword, foundUser.salt);

    if (oldPassword === user.password) {
      foundUser.password = await AuthService.hashPassword(
        password,
        foundUser.salt,
      );
    } else {
      result.message = 'La contraseña anterior no coincide.';
      result.successStatus = false;
      return result;
    }
    try {
      await this.userRepository.update(foundUser);
      delete foundUser.salt;
      delete foundUser.password;
      if (this.isProductionEnv) {
        await this.logHistoryService.create(
          user,
          foundUser,
          HISTORY_ACTION.MOD,
        );
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }
}
