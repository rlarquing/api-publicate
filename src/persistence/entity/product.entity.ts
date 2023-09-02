import {
  Entity,
  JoinColumn,
  Column, ManyToOne, ManyToMany, JoinTable,
} from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import {BusinessEntity} from "./business.entity";
import {MunicipalityEntity} from "./municipality.entity";
import {ProvinceEntity} from "./province.entity";
import {TagEntity} from "./tag.entity";

@Entity('product', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class ProductEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'float8', nullable: false })
  price: number;

  @Column({ type: 'int4', nullable: false })
  amount: number;

  @Column({ type: 'boolean', name: 'home_service',  nullable: false })
  homeService: boolean;

  @ManyToOne(() => BusinessEntity, (business) =>business.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessEntity;

  @ManyToMany(() => MunicipalityEntity, (municipality) => municipality.products, { eager: false })
  @JoinTable({
    name: 'product_municipality',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'municipality_id',
      referencedColumnName: 'id',
    },
  })
  municipalities: MunicipalityEntity[];

  @ManyToMany(() => ProvinceEntity, (province) => province.products, { eager: false })
  @JoinTable({
    name: 'product_province',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'province_id',
      referencedColumnName: 'id',
    },
  })
  provincies: ProvinceEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.products, { eager: false })
  @JoinTable({
    name: 'product_tag',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];


  constructor(name: string, description: string, price: number, amount: number, homeService: boolean, business: BusinessEntity, municipalities: MunicipalityEntity[], provincies: ProvinceEntity[], tags: TagEntity[]) {
    super();
    this.name = name;
    this.description = description;
    this.price = price;
    this.amount = amount;
    this.homeService = homeService;
    this.business = business;
    this.municipalities = municipalities;
    this.provincies = provincies;
    this.tags = tags;
  }

  public toString(): string {
    return this.name;
  }
}
