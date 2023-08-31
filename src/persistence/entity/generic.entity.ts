import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

export abstract class GenericEntity extends BaseEntity {
  @PrimaryGeneratedColumn ('uuid')
  id: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  public abstract toString(): string;
}
