import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('prediction_history')
export class PredictionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  disease: string;

  @Column({ type: 'json' })
  inputData: Record<string, any>;

  @Column({ type: 'int' })
  prediction: number;

  @Column({ type: 'float' })
  probability: number;

  @Column()
  riskLevel: string;


  @CreateDateColumn()
  createdAt: Date;
}
