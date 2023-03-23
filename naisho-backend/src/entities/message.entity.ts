import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn({
    type: 'varchar',
    length: 256,
    collation: 'utf8mb4_general_ci',
  })
  id: string;

  @Column({
    name: 'user_id',
    type: 'int',
    unsigned: true,
  })
  userId: number;

  @Column({
    type: 'text',
    collation: 'utf8mb4_general_ci',
  })
  body: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    default: () => "NOW()",
  })
  createdAt: Date;
}
