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

  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  lastname: string;

  @Column({ type: 'int4', nullable: false })
  age: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sex: string;

  @Column({ type: 'varchar', unique: true, length: 11, nullable: false })
  ci: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  addressClient: string;

  @ManyToOne(() => UserEntity, (user) => user.business, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'municipality_id' })
  user: UserEntity;

  constructor(name: string, lastname: string, age: number, sex: string, ci: string, addressClient: string, user: UserEntity) {
    super();
    this.name = name;
    this.lastname = lastname;
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
