import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('authors')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality!: string | null;

  @Column({ type: 'int', nullable: true })
  birthYear!: number | null;
}
