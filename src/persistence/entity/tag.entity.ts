import { Entity, ManyToMany, JoinColumn } from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericNomenclatorEntity } from './generic-nomenclator.entity';
import {ProductEntity} from "./product.entity";


@Entity('nom_tag', {
    schema: SchemaEnum.MOD_NOMENCLATOR,
    orderBy: { id: 'ASC' },
})
export class TagEntity extends GenericNomenclatorEntity {
    @ManyToMany(() => ProductEntity, (product) => product.tags)
    @JoinColumn()
    products: ProductEntity[];
}
