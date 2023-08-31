import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import {
  AuthService,
  EndPointService,
  FunctionService,
  GenericNomenclatorService,
  MenuService,
  MunicipalityService,
  ProvinceService,
  RolService,
  SocketService,
  TrazaService,
  UserService,
} from './service';
import {
  EndPointMapper,
  FunctionMapper,
  GenericNomenclatorMapper,
  MenuMapper,
  MunicipalityMapper,
  ProvinceMapper,
  RolMapper,
  TrazaMapper,
  UserMapper,
} from './mapper';
import { LoggerProvider } from './logger/logger.provider';

export const providers = [
  JwtStrategy,
  RefreshStrategy,
  TrazaService,
  TrazaMapper,
  LoggerProvider,
  AuthService,
  UserService,
  UserMapper,
  RolMapper,
  FunctionMapper,
  EndPointMapper,
  MenuMapper,
  RolService,
  GenericNomenclatorService,
  GenericNomenclatorMapper,
  MunicipalityService,
  MunicipalityMapper,
  ProvinceService,
  ProvinceMapper,
  EndPointService,
  FunctionService,
  MenuService,
  SocketService,
];
