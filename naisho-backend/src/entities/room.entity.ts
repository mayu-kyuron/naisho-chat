import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Room {
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
  name: string;

  @Exclude()
  @Column({
    name: 'created_by',
    type: 'int',
    unsigned: true,
  })
  createdBy: number;

  @Exclude()
  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    default: () => "NOW()",
  })
  createdAt: Date;
}
