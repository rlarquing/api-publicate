import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MunicipalityService } from '../../core/service';
import { ReadMunicipalityDto, SelectDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Municipalities')
@Controller('municipality')
export class MunicipalityController {
  constructor(
    private municipioService: MunicipalityService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de los municipios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de los municipios',
    type: ReadMunicipalityDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipios no encontrados.',
  })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ReadMunicipalityDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.municipioService.findAll({
      page,
      limit,
      route: url + '/municipios',
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un municipio' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un municipio',
    type: ReadMunicipalityDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipio no encontrado.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ReadMunicipalityDto> {
    return await this.municipioService.findById(id);
  }

  @ApiOperation({ summary: 'Listado de los municipios de una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de los municipios de una provincia',
    type: ReadMunicipalityDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipios no encontrados.',
  })
  @Get('/provincia/:id')
  async findByProvincia(
    @Param('id') id: string,
  ): Promise<ReadMunicipalityDto[]> {
    return await this.municipioService.findByProvincia(id);
  }

}
