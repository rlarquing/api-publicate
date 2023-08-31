import {
  BusinessRepository,
  ClientRepository,
  EndPointRepository,
  FunctionRepository,
  GenericNomenclatorRepository,
  MenuRepository,
  MunicipalityRepository,
  PlanRepository, ProductRepository,
  ProvinceRepository,
  RolRepository,
  TrazaRepository,
  UserRepository,
} from './repository';

export const repository = [
  TrazaRepository,
  UserRepository,
  RolRepository,
  FunctionRepository,
  EndPointRepository,
  MenuRepository,
  GenericNomenclatorRepository,
  MunicipalityRepository,
  ProvinceRepository,
  BusinessRepository,
  ClientRepository,
  PlanRepository,
  ProductRepository,
];
