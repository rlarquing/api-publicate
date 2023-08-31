import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ProvinceService } from '../../core/service';
import { ReadProvinceDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Provincies')
@Controller('province')
export class ProvinceController {
  constructor(
    private provinciaService: ProvinceService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Listado de las provincias',
    type: ReadProvinceDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Provincias no encontradas.',
  })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ReadProvinceDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.provinciaService.findAll({
      page,
      limit,
      route: url + '/provincia',
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de una provincia',
    type: ReadProvinceDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'provincia no encontrada.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ReadProvinceDto> {
    return await this.provinciaService.findById(id);
  }

}
