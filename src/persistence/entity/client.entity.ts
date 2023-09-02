import {
  Entity,
  JoinColumn,
  Column, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';

@Entity('client', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class ClientEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'last_name', unique: true, length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'int4', nullable: false })
  age: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sex: string;

  @Column({ type: 'varchar', unique: true, length: 11, nullable: false })
  ci: string;

  @Column({ type: 'varchar', name: 'address_client', length: 255, nullable: false })
  addressClient: string;

  @ManyToOne(() => UserEntity, (user) => user.clients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(name: string, lastName: string, age: number, sex: string, ci: string, addressClient: string, user: UserEntity) {
    super();
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.sex = sex;
    this.ci = ci;
    this.addressClient = addressClient;
    this.user = user;
  }

  public toString(): string {
    return this.name;
  }
}
