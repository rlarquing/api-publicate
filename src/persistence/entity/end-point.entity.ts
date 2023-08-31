import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FunctionEntity } from './function.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';

@Entity('end_point', { schema: SchemaEnum.MOD_AUTH, orderBy: { id: 'ASC' } })
export class EndPointEntity {
  @PrimaryGeneratedColumn ('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'controller',
  })
  controller: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'servicio',
  })
  servicio: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'ruta',
  })
  ruta: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'nombre',
  })
  nombre: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: false,
    nullable: false,
    name: 'metodo',
  })
  metodo: string;
  @ManyToMany(() => FunctionEntity, (funcion) => funcion.endPoints,{ onDelete: 'CASCADE'})
  @JoinColumn()
  funcions: FunctionEntity[];
  constructor(
    controller: string,
    servicio: string,
    ruta: string,
    nombre: string,
    metodo: string,
  ) {
    this.controller = controller;
    this.servicio = servicio;
    this.ruta = ruta;
    this.nombre = nombre;
    this.metodo = metodo;
  }
  public toString(): string {
    return this.nombre;
  }
}
