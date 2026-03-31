import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  image_url: string;
}
