import {
  Column,
  Entity, JoinColumn, ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MunicipalityEntity } from './municipality.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import {UserEntity} from "./user.entity";
import {ProductEntity} from "./product.entity";

@Entity('province', { schema: SchemaEnum.MOD_DPA, orderBy: { id: 'ASC' } })
export class ProvinceEntity {
  @PrimaryGeneratedColumn ('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: false }) name: string;
  @OneToMany(() => MunicipalityEntity, (municipio) => municipio.province)
  municipalities: MunicipalityEntity[];

  @OneToMany(() => UserEntity, (user) => user.province)
  users: UserEntity[];

  @ManyToMany(() => ProductEntity, (product) => product.provincies)
  @JoinColumn()
  products: ProductEntity[];

  public toString(): string {
    return this.name;
  }
}
