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
  TrazaController,
  UserController,
} from './controller';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [
    TrazaController,
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
  ],
  providers: [],
  exports: [],
})
export class ApiModule {}
