import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { RolEntity } from './rol.entity';
import { FunctionEntity } from './function.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import { ProvinceEntity } from './province.entity';
import { PlanEntity } from './plan.entity';
import { MunicipalityEntity } from './municipality.entity';
import { BusinessEntity } from './business.entity';
import { ClientEntity } from './client.entity';

@Entity('user', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class UserEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;
  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  password: string;
  @Column({ nullable: true, name: 'refreshtoken' })
  refreshToken: string;
  @Column({ type: 'date', nullable: true, name: 'refreshtokenexp' })
  refreshTokenExp: string;
  @Column({ type: 'varchar', nullable: true })
  salt: string;
  @ManyToMany(() => RolEntity, (rol) => rol.users, { eager: false })
  @JoinTable({
    name: 'user_rol',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'rol_id', referencedColumnName: 'id' },
  })
  roles: RolEntity[];
  @ManyToMany(() => FunctionEntity, (funcion) => funcion.users, {
    eager: false,
  })
  @JoinTable({
    name: 'user_funcion',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'funcion_id',
      referencedColumnName: 'id',
    },
  })
  functions?: FunctionEntity[];

  @Column({ type: 'int4', nullable: true })
  phone?: number;

  @Column({ type: 'date', nullable: true })
  expire?: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'plan_id' })
  plan?: PlanEntity;

  @ManyToOne(() => ProvinceEntity, (province) => province.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'province_id' })
  province?: ProvinceEntity;

  @ManyToOne(() => MunicipalityEntity, (municipality) => municipality.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'municipality_id' })
  municipality?: MunicipalityEntity;

  @OneToMany(() => BusinessEntity, (business) => business.user)
  business: BusinessEntity[];

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({
    type: 'int4',
    unique: true,
    name: 'code_activation',
    nullable: true,
  })
  codeActivation?: number;

  @OneToMany(() => ClientEntity, (client) => client.user)
  clients: ClientEntity[];
  constructor(
    username: string,
    email: string,
    phone: number,
    expire?: Date,
    plan?: PlanEntity,
    province?: ProvinceEntity,
    municipality?: MunicipalityEntity,
    functions?: FunctionEntity[],
  ) {
    super();
    this.username = username;
    this.email = email;
    this.functions = functions;
    this.phone = phone;
    this.expire = expire;
    this.plan = plan;
    this.province = province;
    this.municipality = municipality;
  }
  public async validatePassword(password: string): Promise<boolean> {
    return this.password === (await hash(password, this.salt));
  }
  public toString(): string {
    return this.username;
  }

  @AfterInsert()
  @AfterUpdate()
  public codigo(): void {
    this.codeActivation = Math.round(Math.random() * 999999);
  }
}
