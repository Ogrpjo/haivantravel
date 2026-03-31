import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('emotion_creators')
export class EmotionCreator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  center_image_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  left_image_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  right_image_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  description_detail: string | null;
}
