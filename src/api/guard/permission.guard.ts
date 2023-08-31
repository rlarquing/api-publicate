import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  aInicialMinuscula,
  eliminarDuplicado,
  quitarSeparador,
} from '../../../lib';
import { RolService } from '../../core/service';
import { FunctionEntity } from '../../persistence/entity';
import { ReadFunctionDto, ReadRolDto } from '../../shared/dto';
import { FunctionMapper } from '../../core/mapper';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly rolService: RolService,
    // private readonly funcionService: FunctionService,
    private readonly funcionMapper: FunctionMapper,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let endPoint: string = this.reflector.get<string>(
      'servicio',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    if (!endPoint) {
      return true;
    }
    if (endPoint.includes('undefined')) {
      const funcionalidad = endPoint.split('.')[1];
      const ruta: string[] = request.route.path
        .split(`/`)
        .filter((path) => path !== '');
      let controlador = ruta[1];
      controlador = aInicialMinuscula(quitarSeparador(controlador, '-'));
      endPoint = controlador + '.' + funcionalidad;
    }
    // const {
    //   user,
    //   headers: { authorization },
    // } = request;
    const { user } = request;
    const funcionsIndiv: FunctionEntity[] = user.funcions;
    let funcions: ReadFunctionDto[] = [];
    let item: ReadRolDto;
    for (const rol of user.roles) {
      item = await this.rolService.findById(rol.id);
      item.funcions.forEach((funcion: ReadFunctionDto) =>
        funcions.push(funcion),
      );
    }
    for (const fun of funcionsIndiv) {
      funcions.push(await this.funcionMapper.entityToDto(fun));
    }
    funcions = eliminarDuplicado(funcions);

    let endPoints: string[] = [];
    for (const funcion of funcions) {
      for (const endPoint of funcion.endPoints) {
        endPoints.push(endPoint.controller + '.' + endPoint.servicio);
      }
    }
    endPoints = eliminarDuplicado(endPoints);
    // const endPoints: string[] = await this.jwt.verify(
    //   authorization.split(' ')[1],
    // ).endPoints;
    const hasEndPoint = () => {
      return endPoints.includes(endPoint);
    };
    return user && hasEndPoint();
  }
}
