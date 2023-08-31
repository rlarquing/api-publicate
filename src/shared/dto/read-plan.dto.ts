import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadNomenclatorDto } from './read-nomenclator.dto';

export class ReadPlanDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del plan.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del plan.', example: 'Plan básico' })
  name: string;

  @ApiProperty({
    description: 'Precio del plan.',
    example: 10,
  })
  price: number;

  @ApiProperty({
    description: 'Permisos que tienen este plan.',
    example: [ReadNomenclatorDto],
  })
  permissions: ReadNomenclatorDto[];

  constructor(dtoToString: string, id: string, name: string, price: number, permissions: ReadNomenclatorDto[]) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.name = name;
    this.price = price;
    this.permissions = permissions;
  }
}
