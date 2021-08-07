import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Creating entity properties with a bang operator (!),
// because strict checking is enabled in tsconfig.
@Entity()
class Task {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false
  })
  name!: string;

  @Column({
    type: 'boolean',
    default: false
  })
  tracked!: boolean;

  @Column({
    type: 'timestamptz',
    default: new Date().toUTCString()
  })
  createdAt!: string; // createdAt is a string due to the fact that it's a timestamp

  @Column({
    type: 'timestamptz',
    default: null
  })
  startedAt!: string; // Same as createdAt

  @Column({
    type: 'timestamptz',
    default: null
  })
  finishedAt!: string; // Same as createdAt
}

export { Task };
