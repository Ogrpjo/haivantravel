import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gala')
export class Gala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;
}

