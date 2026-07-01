import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  author!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column()
  publishedYear!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  genre!: string | null;
}
