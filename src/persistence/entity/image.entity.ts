import { Entity, JoinColumn, Column, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericEntity } from './generic.entity';
import { ProductEntity } from './product.entity';

@Entity('image', { schema: SchemaEnum.PUBLIC, orderBy: { id: 'ASC' } })
export class ImageEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  constructor(name: string, url: string, product: ProductEntity) {
    super();
    this.name = name;
    this.url = url;
    this.product = product;
  }

  public toString(): string {
    return this.name;
  }
}
