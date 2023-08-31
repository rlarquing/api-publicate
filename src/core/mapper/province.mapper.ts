import { Injectable } from '@nestjs/common';
import { ProvinceEntity } from '../../persistence/entity';
import { ReadProvinceDto } from '../../shared/dto';

@Injectable()
export class ProvinceMapper {
  entityToDto(provinciaEntity: ProvinceEntity): ReadProvinceDto {
    const dtoToString: string = provinciaEntity.toString();
    return new ReadProvinceDto(
      dtoToString,
      provinciaEntity.id,
      provinciaEntity.name,
    );
  }
}
