import { ApiProperty } from '@nestjs/swagger';
import { ReadProvinceDto } from './read-province.dto';

export class ReadMunicipalityDto {
  dtoToString: string;

  @ApiProperty({ description: 'id del municipio.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del municipio.', example: 'Minas' })
  name: string;

  @ApiProperty({
    description: 'Provincia a que pertenece',
    example: ReadProvinceDto,
  })
  province: ReadProvinceDto;

  constructor(
    dtoToString: string,
    id: string,
    name: string,
    province: ReadProvinceDto,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.province = province;
  }
}
