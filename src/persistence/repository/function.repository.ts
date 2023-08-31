import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FunctionEntity, MenuEntity} from '../entity';
import {IRepository} from '../../shared/interface';
import {GenericRepository} from './generic.repository';

@Injectable()
export class FunctionRepository
    extends GenericRepository<FunctionEntity>
    implements IRepository<FunctionEntity> {
    constructor(
        @InjectRepository(FunctionEntity)
        private funcionRepository: Repository<FunctionEntity>,
    ) {
        super(funcionRepository, ['endPoints', 'menu']);
    }

    async findByMenu(menu: MenuEntity): Promise<FunctionEntity> {
        return await this.funcionRepository.createQueryBuilder('f').
        leftJoinAndSelect('f.menu','menu').
        leftJoinAndSelect('f.endPoints','endPoints').
        where(`f.active = true AND f.menu_id=:menu_id`,{menu_id: menu.id}).getOne();
    }
}
