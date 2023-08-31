import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BusinessEntity,
  ClientEntity,
  EndPointEntity,
  FunctionEntity,
  MenuEntity,
  MunicipalityEntity,
  PermissionEntity,
  PlanEntity,
  ProductEntity,
  ProvinceEntity,
  RolEntity,
  TagEntity,
  TrazaEntity,
  UserEntity,
} from './entity';
import { repository } from './persistence.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EndPointEntity,
      FunctionEntity,
      MenuEntity,
      MunicipalityEntity,
      ProvinceEntity,
      RolEntity,
      TrazaEntity,
      UserEntity,
      PermissionEntity,
      TagEntity,
      PlanEntity,
      BusinessEntity,
      ClientEntity,
      ProductEntity,
    ]),
    SharedModule,
  ],
  providers: [...repository],
  exports: [...repository],
})
export class PersistenceModule {}
