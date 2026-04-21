import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teambuilding')
export class TeamBuilding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  html_content: string | null;

  @Column({ type: 'text', nullable: true })
  css_content: string | null;
}

