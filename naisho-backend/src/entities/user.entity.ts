import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 256,
    collation: 'utf8mb4_general_ci',
  })
  username: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 256,
    collation: 'utf8mb4_general_ci',
  })
  password: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 32,
    collation: 'utf8mb4_general_ci',
  })
  @Column()
  role: string;
}
