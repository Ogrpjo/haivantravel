import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recruitment')
export class Recruitment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  html_content: string | null;

  @Column({ type: 'text', nullable: true })
  css_content: string | null;
}
