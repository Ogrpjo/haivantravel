import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mice')
export class Mice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;
}

