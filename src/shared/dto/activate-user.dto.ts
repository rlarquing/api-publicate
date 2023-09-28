import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateUserDto {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({
    description: 'Id.',
    example: '',
  })
  id: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'El atributo code debe ser un número' })
  @ApiProperty({
    description: 'Code',
    example: 456123,
  })
  code: number;
}
