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
  LogHistoryService,
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
  LogHistoryMapper,
  UserMapper,
  PlanMapper
} from './mapper';
import { LoggerProvider } from './logger/logger.provider';

export const providers = [
  JwtStrategy,
  RefreshStrategy,
  LogHistoryService,
  LogHistoryMapper,
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
  PlanMapper
];
