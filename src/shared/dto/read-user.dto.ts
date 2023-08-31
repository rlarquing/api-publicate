import { ReadRolDto } from './read-rol.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReadFunctionDto } from './read-function.dto';
import { ReadProvinceDto } from './read-province.dto';
import { ReadMunicipalityDto } from './read-municipality.dto';
import { ReadPlanDto } from './read-plan.dto';

export class ReadUserDto {
  dtoToString: string;

  @ApiProperty({ description: 'id del usuario.', example: 'f49e75f2-4359-4276-a148-3c10c5aae7fd' })
  id: string;

  @ApiProperty({ description: 'Nombre del usuario.', example: 'juan' })
  username: string;

  @ApiPropertyOptional({
    description: 'Email del usuario.',
    example: 'juan@camaguey.geocuba.cu',
  })
  email: string;

  @ApiProperty({ description: 'Roles del usuario.', type: [ReadRolDto] })
  roles: ReadRolDto[];

  @ApiProperty({
    description: 'Funciones del usuario.',
    type: [ReadFunctionDto],
  })
  funcions: ReadFunctionDto[];


  @ApiProperty({
    description: 'Número de telefono.',
    example: 52037685,
  })
  phone: number;


  @ApiProperty({
    description: 'fecha de expiracion del usuario',
    example: '2023-07-08',
  })
  expire: Date;

  @ApiProperty({
    description: 'Plan al cual pertenece',
    example: ReadPlanDto,
  })
  plan: ReadPlanDto;

  @ApiProperty({
    description: 'Provincia al cual pertenece',
    example: ReadProvinceDto,
  })
  province: ReadProvinceDto;

  @ApiProperty({
    description: 'Municipio al cual pertenece',
    example: ReadMunicipalityDto,
  })
  municipality: ReadMunicipalityDto;


  constructor(dtoToString: string, id: string, username: string, email: string, roles: ReadRolDto[], funcions: ReadFunctionDto[], phone: number, expire: Date, plan: ReadPlanDto, province: ReadProvinceDto, municipality: ReadMunicipalityDto) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.funcions = funcions;
    this.phone = phone;
    this.expire = expire;
    this.plan = plan;
    this.province = province;
    this.municipality = municipality;
  }
}
