import { Injectable } from '@nestjs/common';
import {
  BusinessRepository, GenericNomenclatorRepository, MunicipalityRepository,
  ProductRepository, ProvinceRepository,
} from '../../persistence/repository';
import {
  BusinessEntity, MunicipalityEntity,
  ProductEntity,
  ProvinceEntity,
  TagEntity,
} from '../../persistence/entity';
import {
  CreateProductDto, ReadBusinessDto, ReadMunicipalityDto,
  ReadNomenclatorDto,
  ReadProductDto, ReadProvinceDto,
  UpdateProductDto,
} from '../../shared/dto';
import { NomenclatorTypeEnum } from '../../shared/enum';
import { GenericNomenclatorMapper } from './generic-nomenclator.mapper';
import { BusinessMapper } from './business.mapper';
import { ProvinceMapper } from './province.mapper';
import { MunicipalityMapper } from './municipality.mapper';

@Injectable()
export class ProductMapper {
  constructor(
    protected productRepository: ProductRepository,
    protected genericNomenclatorRepository: GenericNomenclatorRepository,
    protected genericNomenclatorMapper: GenericNomenclatorMapper,
    protected businessRepository: BusinessRepository,
    protected businessMapper: BusinessMapper,
    protected provinceRepository: ProvinceRepository,
    protected provinceMapper: ProvinceMapper,
    protected municipalityRepository: MunicipalityRepository,
    protected municipalityMapper: MunicipalityMapper,
  ) {
  }

  async dtoToEntity(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const business: BusinessEntity = await this.businessRepository.findById(createProductDto.business);
    let tags: TagEntity[] = [];
    if (createProductDto.tags != undefined) {
      tags = await this.genericNomenclatorRepository.findByIds(NomenclatorTypeEnum.TAG, createProductDto.tags);
    }
    let provincies: ProvinceEntity[] = [];
    if (createProductDto.provincies != undefined) {
      provincies = await this.provinceRepository.findByIds(createProductDto.provincies);
    }
    let municipalities: MunicipalityEntity[] = [];
    if (createProductDto.municipalities != undefined) {
      municipalities = await this.municipalityRepository.findByIds(createProductDto.municipalities);
    }
    return new ProductEntity(
      createProductDto.name,
      createProductDto.description,
      createProductDto.price,
      createProductDto.amount,
      createProductDto.homeService,
      business,
      municipalities,
      provincies,
      tags,
    );
  }

  async dtoToUpdateEntity(
    updateProductDto: UpdateProductDto,
    updateProductEntity: ProductEntity,
  ): Promise<ProductEntity> {
    if (updateProductDto.tags != undefined) {
      const tags: TagEntity[] = await this.genericNomenclatorRepository.findByIds(NomenclatorTypeEnum.TAG, updateProductDto.tags);

      if (tags) {
        updateProductEntity.tags = tags;
      }
    }
    if (updateProductDto.provincies != undefined) {
      const provincies: ProvinceEntity[] = await this.provinceRepository.findByIds(updateProductDto.provincies);

      if (provincies) {
        updateProductEntity.provincies = provincies;
      }
    }
    if (updateProductDto.municipalities != undefined) {
      const municipalities: MunicipalityEntity[] = await this.municipalityRepository.findByIds(updateProductDto.municipalities);

      if (municipalities) {
        updateProductEntity.municipalities = municipalities;
      }
    }

    updateProductEntity.name = updateProductDto.name;
    updateProductEntity.description = updateProductDto.description;
    updateProductEntity.price = updateProductDto.price;
    updateProductEntity.amount = updateProductDto.amount;
    updateProductEntity.homeService = updateProductDto.homeService;

    return updateProductEntity;
  }

  async entityToDto(productEntity: ProductEntity): Promise<ReadProductDto> {
    const product: ProductEntity = await this.productRepository.findById(productEntity.id);
    const readBusinessDto: ReadBusinessDto = await this.businessMapper.entityToDto(productEntity.business);

    const readTagsDto: ReadNomenclatorDto[] = [];
    for (const tag of product.tags) {
      readTagsDto.push(this.genericNomenclatorMapper.entityToDto(tag));
    }

    const readProvinciesDto: ReadProvinceDto[] = [];
    for (const province of product.provincies) {
      readProvinciesDto.push(this.provinceMapper.entityToDto(province));
    }

    const readMunicipalitiesDto: ReadMunicipalityDto[] = [];
    for (const municipality of product.municipalities) {
      readMunicipalitiesDto.push(await this.municipalityMapper.entityToDto(municipality));
    }

    const dtoToString: string = product.toString();
    return new ReadProductDto(
      dtoToString,
      productEntity.id,
      productEntity.name,
      productEntity.description,
      productEntity.price,
      productEntity.homeService,
      readBusinessDto,
      readTagsDto,
      readProvinciesDto,
      readMunicipalitiesDto,
    );
  }
}
