import { Module } from '@nestjs/common';
import {
  AuthController,
  EndPointController,
  FunctionController,
  GenericNomenclatorController,
  MenuController,
  MunicipalityController,
  ProvinceController,
  RolController,
  SocketController,
  LogHistoryController,
  UserController, ClientController, PlanController, BusinessController, ProductController,
} from './controller';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [
    LogHistoryController,
    AuthController,
    UserController,
    RolController,
    GenericNomenclatorController,
    MunicipalityController,
    ProvinceController,
    EndPointController,
    FunctionController,
    MenuController,
    SocketController,
    ClientController,
    PlanController,
    BusinessController,
    ProductController
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}
