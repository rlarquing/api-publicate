import { Injectable } from '@nestjs/common';
import {
  ClientRepository, UserRepository,
} from '../../persistence/repository';
import { ClientEntity, UserEntity } from '../../persistence/entity';
import {
  CreateClientDto,
  ReadClientDto,
  UpdateClientDto, ReadUserDto,
} from '../../shared/dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class ClientMapper {
  constructor(
    protected clientRepository: ClientRepository,
    protected userRepository: UserRepository,
    protected userMapper: UserMapper
  ) {}
  async dtoToEntity(createClientDto: CreateClientDto): Promise<ClientEntity> {
    const user: UserEntity = await this.userRepository.findById(createClientDto.user);
    return new ClientEntity(
      createClientDto.name,
      createClientDto.lastName,
      createClientDto.age,
      createClientDto.sex,
      createClientDto.ci,
      createClientDto.addressClient,
      user,
    );
  }
  async dtoToUpdateEntity(
    updateClientDto: UpdateClientDto,
    updateClientEntity: ClientEntity,
  ): Promise<ClientEntity> {
    const user: UserEntity = await this.userRepository.findById(updateClientDto.user);
    if (user) {
      updateClientEntity.user = user;
    }

    updateClientEntity.name = updateClientDto.name;
    updateClientEntity.lastName = updateClientDto.lastName;
    updateClientEntity.age = updateClientDto.age;
    updateClientEntity.sex = updateClientDto.sex;
    updateClientEntity.ci = updateClientDto.ci;
    updateClientEntity.addressClient = updateClientDto.addressClient;

    return updateClientEntity;
  }
  async entityToDto(clientEntity: ClientEntity): Promise<ReadClientDto> {
    const client: ClientEntity = await this.clientRepository.findById(clientEntity.id);
    const readUserDto: ReadUserDto = await this.userMapper.entityToDto(client.user);

    const dtoToString: string = client.toString();
    return new ReadClientDto(
      dtoToString,
      clientEntity.id,
      clientEntity.name,
      clientEntity.lastName,
      clientEntity.age,
      clientEntity.sex,
      clientEntity.ci,
      clientEntity.addressClient,
      readUserDto
    );
  }
}
