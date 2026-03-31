import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recruitment')
export class Recruitment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;
}
