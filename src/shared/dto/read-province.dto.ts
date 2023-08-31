import { ApiProperty } from '@nestjs/swagger';

export class ReadProvinceDto {
  dtoToString: string;

  @ApiProperty({ description: 'id de la provincia.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre de la provincia.', example: 'Camaguey' })
  name: string;

  constructor(
    dtoToString: string,
    id: string,
    name: string,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
  }
}
