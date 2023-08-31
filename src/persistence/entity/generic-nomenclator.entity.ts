import { Column, Unique } from 'typeorm';
import { GenericEntity } from './generic.entity';

@Unique(['name'])
export class GenericNomenclatorEntity extends GenericEntity {
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }

  public toString(): string {
    return this.name;
  }
}
