import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('error_logs')
export class ErrorLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalJobId: string;

  @Column()
  originalJobName: string;

  @Column({ type: 'json' })
  data: Record<string, any>;

  @Column()
  error: string;

  @Column({ nullable: true })
  stack?: string;

  @Column()
  attemptsMade: number;

  @CreateDateColumn()
  failedAt: Date;
}
