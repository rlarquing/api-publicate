import { Entity, JoinColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import { ProductEntity } from './product.entity';

@Entity('business', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class BusinessEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    name: 'address_business',
    length: 255,
    nullable: false,
  })
  addressBusiness: string;

  @ManyToOne(() => UserEntity, (user) => user.business, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.business)
  products: ProductEntity[];
  constructor(name: string, addressBusiness: string, user: UserEntity) {
    super();
    this.name = name;
    this.addressBusiness = addressBusiness;
    this.user = user;
  }
  public toString(): string {
    return this.name;
  }
}
