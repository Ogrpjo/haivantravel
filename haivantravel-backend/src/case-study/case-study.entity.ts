import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('case_study')
export class CaseStudy {
  @PrimaryGeneratedColumn()
  id: number;

  /** GrapesJS project JSON from editor.getProjectData() */
  @Column({ type: 'text', nullable: true })
  content: string | null;
}
