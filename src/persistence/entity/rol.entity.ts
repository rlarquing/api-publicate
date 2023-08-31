import {
  Entity,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { FunctionEntity } from './function.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';

@Entity('rol', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class RolEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;
  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinColumn()
  users: UserEntity[];
  @ManyToMany(() => FunctionEntity, (funcion) => funcion.rols, { eager: false })
  @JoinTable({
    name: 'rol_funcion',
    joinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'funcion_id',
      referencedColumnName: 'id',
    },
  })
  functions: FunctionEntity[];
  constructor(
    name: string,
    description: string,
    functions: FunctionEntity[],
    users?: UserEntity[],
  ) {
    super();
    this.name = name;
    this.description = description;
    this.users = users;
    this.functions = functions;
  }
  public toString(): string {
    return this.name;
  }
}
