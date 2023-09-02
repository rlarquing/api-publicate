import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadBusinessDto } from './read-business.dto';
import { ReadNomenclatorDto } from './read-nomenclator.dto';
import { ReadProvinceDto } from './read-province.dto';
import { ReadMunicipalityDto } from './read-municipality.dto';

export class ReadProductDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del cliente.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del cliente.', example: 'Pepe' })
  name: string;

  @ApiProperty({
    description: 'Descripción del nomenclador.',
    example: 'Alerta 1',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto.',
    example: 26,
  })
  price: number;

  @ApiProperty({ description: 'Servicio a domicilio.', example: false })
  homeService: boolean;

  @ApiProperty({
    description: 'Negocio al que pertenece el producto.',
    example: ReadBusinessDto,
  })
  business: ReadBusinessDto;

  @ApiProperty({
    description: 'Tags que tienen este producto.',
    example: [ReadNomenclatorDto],
  })
  tags: ReadNomenclatorDto[];

  @ApiProperty({
    description: 'Provincias que puede brindar este producto.',
    example: [ReadProvinceDto],
  })
  provincies: ReadProvinceDto[];

  @ApiProperty({
    description: 'Municipios que puede brindar este producto.',
    example: [ReadMunicipalityDto],
  })
  municipalities: ReadMunicipalityDto[];


  constructor(dtoToString: string, id: string, name: string, description: string, price: number, homeService: boolean, business: ReadBusinessDto, tags: ReadNomenclatorDto[], provincies: ReadProvinceDto[], municipalities: ReadMunicipalityDto[]) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.homeService = homeService;
    this.business = business;
    this.tags = tags;
    this.provincies = provincies;
    this.municipalities = municipalities;
  }
}
