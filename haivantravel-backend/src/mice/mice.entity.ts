import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mice')
export class Mice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  html_content: string | null;

  @Column({ type: 'text', nullable: true })
  css_content: string | null;
}

