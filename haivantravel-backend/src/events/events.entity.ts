import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  time: string | null;
}
