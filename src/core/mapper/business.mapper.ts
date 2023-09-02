import { Injectable } from '@nestjs/common';
import {
  BusinessRepository,
  UserRepository,
} from '../../persistence/repository';
import {BusinessEntity, UserEntity } from '../../persistence/entity';
import {
  CreateBusinessDto,
  ReadBusinessDto,
  ReadUserDto,
  UpdateBusinessDto,
} from '../../shared/dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class BusinessMapper {
  constructor(
    protected businessRepository: BusinessRepository,
    protected userRepository: UserRepository,
    protected userMapper: UserMapper
  ) {}
  async dtoToEntity(createBusinessDto: CreateBusinessDto): Promise<BusinessEntity> {
    const user: UserEntity = await this.userRepository.findById(createBusinessDto.user);
    return new BusinessEntity(
      createBusinessDto.name,
      createBusinessDto.addressBusiness,
      user,
    );
  }
  async dtoToUpdateEntity(
    updateBusinessDto: UpdateBusinessDto,
    updateBusinessEntity: BusinessEntity,
  ): Promise<BusinessEntity> {
      const user: UserEntity = await this.userRepository.findById(updateBusinessDto.user);
      if (user) {
        updateBusinessEntity.user = user;
      }

    updateBusinessEntity.name = updateBusinessDto.name;
    updateBusinessEntity.addressBusiness = updateBusinessDto.addressBusiness;

    return updateBusinessEntity;
  }
  async entityToDto(businessEntity: BusinessEntity): Promise<ReadBusinessDto> {
    const business: BusinessEntity = await this.businessRepository.findById(businessEntity.id);
    const readUserDto: ReadUserDto = await this.userMapper.entityToDto(business.user);

    const dtoToString: string = business.toString();
    return new ReadBusinessDto(
      dtoToString,
      businessEntity.id,
      businessEntity.name,
      businessEntity.addressBusiness,
      readUserDto
    );
  }
}
