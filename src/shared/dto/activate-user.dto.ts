import { IsNotEmpty, IsUUID } from 'class-validator';
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
  @ApiProperty({
    description: 'Code',
    example: '',
  })
  code: number;
}
