import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('statistics')
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  number: string;
}
