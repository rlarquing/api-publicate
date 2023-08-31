import { Injectable } from '@nestjs/common';
import { MenuRepository } from '../../persistence/repository';
import {
  CreateMenuDto,
  ReadMenuDto,
  SelectDto,
  UpdateMenuDto,
} from '../../shared/dto';
import { MenuEntity } from '../../persistence/entity';

@Injectable()
export class MenuMapper {
  constructor(protected menuRepository: MenuRepository) {}

  async dtoToEntity(createMenuDto: CreateMenuDto): Promise<MenuEntity> {
    const menu: MenuEntity = await this.menuRepository.findById(
      createMenuDto.menu,
    );
    return new MenuEntity(
      createMenuDto.label,
      createMenuDto.icon,
      createMenuDto.to,
      menu,
      createMenuDto.tipo,
    );
  }

  async dtoToUpdateEntity(
    updateMenuDto: UpdateMenuDto,
    updateMenuEntity: MenuEntity,
  ): Promise<MenuEntity> {
    const menu: MenuEntity = await this.menuRepository.findById(
      updateMenuDto.menu,
    );
    updateMenuEntity.label = updateMenuDto.label;
    updateMenuEntity.icon = updateMenuDto.icon;
    updateMenuEntity.tipo = updateMenuDto.tipo;
    updateMenuEntity.to = updateMenuDto.to;
    updateMenuEntity.menu = menu;
    return updateMenuEntity;
  }

  async entityToDto(menuEntity: MenuEntity): Promise<ReadMenuDto> {
    const menu: MenuEntity = await this.menuRepository.findById(menuEntity.id);
    let menuPadre = '';
    let menuSelectDto: SelectDto;
    const menuDto: ReadMenuDto[] = [];
    if (menu.menu === null) {
      for (const menuHijo of menu.menus) {
        if (menuHijo.active === true) {
          menuDto.push(await this.entityToDto(menuHijo));
        }
      }
    } else {
      menuPadre = menu.menu.toString();
      menuSelectDto = new SelectDto(menu.menu.id, menu.menu.toString());
    }

    const dtoToString: string = menuEntity.toString();
    return new ReadMenuDto(
      dtoToString,
      menuEntity.id,
      menuEntity.label,
      menuEntity.icon,
      menuEntity.to,
      menuDto,
      menuEntity.tipo,
      menuPadre,
      menuSelectDto,
    );
  }
}
