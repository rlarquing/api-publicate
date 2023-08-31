import {
  Column,
  Entity,
  JoinColumn, ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import {UserEntity} from "./user.entity";
import {ProductEntity} from "./product.entity";

@Entity('municipality', { schema: SchemaEnum.MOD_DPA, orderBy: { id: 'ASC' } })
export class MunicipalityEntity {
  @PrimaryGeneratedColumn ('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false }) name: string;

  @ManyToOne(() => ProvinceEntity, (province) => province.municipalities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @OneToMany(() => UserEntity, (user) => user.municipality)
  users: UserEntity[];

  @ManyToMany(() => ProductEntity, (product) => product.municipalities)
  @JoinColumn()
  products: ProductEntity[];

  public toString(): string {
    return this.name;
  }
}
