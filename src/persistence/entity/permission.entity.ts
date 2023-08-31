import { Entity, ManyToMany, JoinColumn } from 'typeorm';
import { SchemaEnum } from '../../database/schema/schema.enum';
import { GenericNomenclatorEntity } from './generic-nomenclator.entity';
import {PlanEntity} from "./plan.entity";


@Entity('nom_permission', {
    schema: SchemaEnum.MOD_NOMENCLATOR,
    orderBy: { id: 'ASC' },
})
export class PermissionEntity extends GenericNomenclatorEntity {
    @ManyToMany(() => PlanEntity, (plan) => plan.permissions)
    @JoinColumn()
    plans: PlanEntity[];
}
