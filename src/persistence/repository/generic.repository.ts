import { NotFoundException } from '@nestjs/common';
import {
  Between,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { IRepository } from '../../shared/interface';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

export abstract class GenericRepository<ENTITY> implements IRepository<ENTITY> {
  protected constructor(
    protected repository: Repository<ENTITY>,
    protected relations?: string[],
  ) {}

  async findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<ENTITY> | ENTITY[]> {
    const findOptions = {
      where: { active: true },
      relations: this.relations,
    } as FindManyOptions;
    if (sinPaginacion === true) {
      return await this.repository.find(findOptions);
    } else {
      return await paginate<ENTITY>(this.repository, options, findOptions);
    }
  }

  async findById(id: string): Promise<ENTITY> {
    const options = {
      where: { id, active: true },
      relations: this.relations,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }

  async findOne(id: string): Promise<ENTITY> {
    const options = {
      where: { id },
      relations: this.relations,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }

  async findByIds(ids: string[]): Promise<ENTITY[]> {
    const options = {
      where: { id: In(ids), active: true },
      relations: this.relations,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async createSelect(): Promise<ENTITY[]> {
    const options = {
      where: { active: true },
      relations: this.relations,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async create(newObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(newObj);    
  }

  async update(updateObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(updateObj);
  }

  async delete(id: string): Promise<ENTITY> {
    const options = {
      where: { id, active: true },
    } as FindOneOptions;
    const obj: any = await this.repository.findOne(options);
    if (!obj) {
      throw new NotFoundException('No existe');
    }
    obj.active = false;
    return await this.repository.save(obj);
  }

  async remove(ids: string[]): Promise<DeleteResult> {
    return await this.repository.delete(ids);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async filter(
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<ENTITY>> {
    const wheres = { active: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const where = {
      where: wheres,
      relations: this.relations,
    } as FindManyOptions;
    return await paginate<ENTITY>(this.repository, options, where);
  }

  async search(
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<ENTITY>> {
    if (!isEmpty(search)) {
      const findOptions = {
        where: { active: true },
      } as FindManyOptions;
      const result = await this.repository.find(findOptions);
      const objs = new Map<string, string>();
      const keys = new Map<string, string>();
      if (result.length > 0) {
        Object.keys(result[0]).forEach((key) => {
          keys.set(key, key);
        });
        keys.delete('active');
        keys.delete('createdAt');
        keys.delete('updatedAt');
      }
      keys.forEach((key) => {
        for (const item of result) {
          if (
            isString(item[key]) &&
            isString(search) &&
            item[key].toLowerCase().indexOf(search.toLowerCase()) !== -1
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} ILIKE '%${search}%'`);
            }
          } else if (
            isNumber(item[key]) &&
            isNumber(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} = :search`);
            }
          } else if (
            isDate(item[key]) &&
            isDate(search) &&
            item[key] === search
          ) {
            const datep = item[key];
            const start = new Date(datep.setHours(0, 0, 0, 0));
            const end = new Date(datep.setHours(23, 59, 59, 999));
            const date = {
              date: Between(start.toISOString(), end.toISOString()),
            };
            if (!objs.has(key)) {
              objs.set(key, `${key}=${date}`);
            }
          } else if (
            isBoolean(item[key]) &&
            isBoolean(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key}= :search`);
            }
          }
        }
      });
      const queryBuilder = this.repository.createQueryBuilder('q');
      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.leftJoinAndSelect(`q.${relation}`, relation);
        }
      }
      if (objs.size === 0) {
        queryBuilder.where(`q.active = true AND q.id=0`);
      } else {
        const where: string[] = [];
        objs.forEach((item) => {
          where.push(`q.${item}`);
        });
        queryBuilder.where(`q.active = true AND ${where.join(' OR ')}`, {
          search: search,
        });
      }
      return await paginate<ENTITY>(queryBuilder, options);
    }
  }

  async findBy(
    claves: string[],
    valores: any[],
    order?: any,
    take?: number,
  ): Promise<ENTITY[]> {
    const wheres = { active: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
      relations: this.relations,
      order: order,
      take: take,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async findOneBy(
    claves: string[],
    valores: any[],
    order?: any,
  ): Promise<ENTITY> {
    const wheres = { active: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
      relations: this.relations,
      order: order,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }

  async createSelectFilter(
      claves: string[],
      valores: any[],
  ): Promise<ENTITY[]> {
    const wheres = { active: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
      relations: this.relations,
    } as FindManyOptions;
    return await this.repository.find(options);
  }
}
