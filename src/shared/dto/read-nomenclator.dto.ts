import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReadNomenclatorDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id', example: '81d4b744-4540-42ba-82e0-d936cac550d5' })
  id: string;

  @ApiProperty({ description: 'Nombre del nomenclador.', example: 'Nom 1' })
  name: string;

  @ApiProperty({
    description: 'Descripción del nomenclador.',
    example: 'Descripción del nom',
  })
  description: string;

  constructor(
    id: string,
    name: string,
    description: string,
    dtoToString: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.dtoToString = dtoToString;
  }
}
