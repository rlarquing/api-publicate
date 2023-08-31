import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericNomenclatorMapper } from '../mapper';
import { DeleteResult } from 'typeorm';
import { GenericNomenclatorRepository } from '../../persistence/repository';
import { LogHistoryService } from './log-history.service';
import {
  BuscarDto,
  FiltroGenericoDto,
  ReadNomenclatorDto,
  ResponseDto,
  SelectDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class GenericNomenclatorService {
  constructor(
    protected repository: GenericNomenclatorRepository,
    protected mapper: GenericNomenclatorMapper,
    protected logHistoryService: LogHistoryService,
  ) {}

  async findAll(
    name: string,
    options: IPaginationOptions,
  ): Promise<Pagination<ReadNomenclatorDto>> {
    const items: Pagination<any> = await this.repository.findAll(name, options);
    const readNomencladorDto: ReadNomenclatorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async findById(name: string, id: string): Promise<ReadNomenclatorDto> {
    const entity = await this.repository.findById(name, id);
    return this.mapper.entityToDto(entity);
  }

  async findByIds(name: string, ids: any[]): Promise<ReadNomenclatorDto[]> {
    const items: any[] = await this.repository.findByIds(name, ids);
    return items.map((item: any) => this.mapper.entityToDto(item));
  }

  async create(
    name: string,
    user: UserEntity,
    createDto: any,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const newEntity = await this.mapper.dtoToEntity(createDto);
    try {
      const objEntity: any = await this.repository.create(name, newEntity);
      await this.logHistoryService.create(user, objEntity, HISTORY_ACTION.ADD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async createMultiple(
    name: string,
    user: UserEntity,
    createDto: any[],
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      result.push(await this.create(name, user, dtoElement));
    }
    return result;
  }

  async createSelect(name: string): Promise<SelectDto[]> {
    const items: any[] = await this.repository.createSelect(name);
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }

  async importar(
    name: string,
    user: UserEntity,
    createDto: any[],
  ): Promise<ResponseDto[]> {
    const result: ResponseDto[] = [];
    for (const dtoElement of createDto) {
      const clave: string[] = [];
      const valor: any[] = [];
      for (const key in dtoElement) {
        clave.push(key);
        valor.push(createDto[key]);
      }
      const filtroGenericoDto: FiltroGenericoDto = { clave, valor };
      const filtro: any = await this.filter(
        name,
        {
          page: 1,
          limit: 10,
          route: '',
        },
        filtroGenericoDto,
      );
      if (filtro.data.meta.totalItems === 0) {
        result.push(await this.create(name, user, dtoElement));
      } else {
        result.push({
          id: 0,
          successStatus: false,
          message: 'Ya existe en la base de datos.',
        });
      }
    }
    return result;
  }

  async update(
    name: string,
    user: UserEntity,
    id: string,
    updateDto: any,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const foundObj: any = await this.repository.findById(name, id);
    if (!foundObj) {
      throw new NotFoundException('No existe');
    }
    const updateEntity = await this.mapper.dtoToUpdateEntity(
      updateDto,
      foundObj,
    );
    try {
      await this.repository.update(name, updateEntity);
      await this.logHistoryService.create(user, updateEntity, HISTORY_ACTION.MOD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async deleteMultiple(
    name: string,
    user: UserEntity,
    ids: string[],
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      for (const id of ids) {
        const objEntity: any = await this.repository.findById(name, id);
        if (!objEntity) {
          throw new NotFoundException('No existe');
        }
        await this.logHistoryService.create(user, objEntity, HISTORY_ACTION.DEL);
        await this.repository.delete(name, id);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async removeMultiple(
    name: string,
    user: UserEntity,
    ids: number[],
  ): Promise<DeleteResult> {
    for (const id of ids) {
      const objEntity: any = await this.repository.findOne(name, id);
      if (!objEntity) {
        throw new NotFoundException('No existe');
      }
      await this.logHistoryService.create(user, objEntity, HISTORY_ACTION.DEL);
    }
    return await this.repository.remove(name, ids);
  }

  async count(name: string): Promise<number> {
    return await this.repository.count(name);
  }

  async filter(
    name: string,
    options: IPaginationOptions,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<ReadNomenclatorDto>> {
    const items: Pagination<any> = await this.repository.filter(
      name,
      options,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const readNomencladorDto: ReadNomenclatorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async search(
    name: string,
    options: IPaginationOptions,
    buscarDto: BuscarDto,
  ): Promise<Pagination<ReadNomenclatorDto>> {
    const items: Pagination<any> = await this.repository.search(
      name,
      options,
      buscarDto.search,
    );
    const readNomencladorDto: ReadNomenclatorDto[] = items.items.map(
      (item: any) => this.mapper.entityToDto(item),
    );
    return new Pagination(readNomencladorDto, items.meta, items.links);
  }

  async createSelectDependiente(
    name: string,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<SelectDto[]> {
    const selectDto: SelectDto[] = [];
    const items: any[] = await this.repository.findBy(
      name,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }
}
