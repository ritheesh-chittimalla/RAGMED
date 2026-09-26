import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionHistory } from './prediction.entity';
import { MlService } from './ml.service';
import { MlController } from './ml.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PredictionHistory])],
  controllers: [MlController],
  providers: [MlService],
  exports: [MlService],
})
export class MlModule {}
