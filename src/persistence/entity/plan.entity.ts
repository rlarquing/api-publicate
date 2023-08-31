import {Column, Entity, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import {PermissionEntity} from "./permission.entity";
import {UserEntity} from "./user.entity";

@Entity('plan', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class PlanEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  name: string;
  @Column({ type: 'float8', nullable: true })
  price: number;

  @ManyToMany(() => PermissionEntity, (permission) => permission.plans, { eager: false })
  @JoinTable({
    name: 'plan_permission',
    joinColumn: { name: 'plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.plan)
  users: UserEntity[];
  constructor(name: string, price: number, permissions: PermissionEntity[]) {
    super();
    this.name = name;
    this.price = price;
    this.permissions = permissions;
  }
  public toString(): string {
    return this.name;
  }
}
