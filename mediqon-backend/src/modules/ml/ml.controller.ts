import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MlService } from './ml.service';
import {
  PredictHeartDto,
  PredictDiabetesDto,
  PredictKidneyDto,
} from './dto/ml-prediction.dto';

@UseGuards(JwtAuthGuard)
@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('predict/heart')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async predictHeart(@Req() req: any, @Body() dto: PredictHeartDto) {
    const userId = req.user.userId || req.user.id;
    return this.mlService.predictHeart(userId, dto.inputData);
  }

  @Post('predict/diabetes')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async predictDiabetes(@Req() req: any, @Body() dto: PredictDiabetesDto) {
    const userId = req.user.userId || req.user.id;
    return this.mlService.predictDiabetes(userId, dto.inputData);
  }

  @Post('predict/kidney')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async predictKidney(@Req() req: any, @Body() dto: PredictKidneyDto) {
    const userId = req.user.userId || req.user.id;
    return this.mlService.predictKidney(userId, dto.inputData);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.mlService.getPredictionHistory(userId);
  }

  @Get('prediction/:id')
  async getPredictionById(@Param('id') id: string) {
    return this.mlService.getPredictionById(id);
  }

  @Post('consult')
  async consultationChat(@Body() body: { message: string; history?: any[] }) {
    return this.mlService.consultationChat(body.message, body.history);
  }
}

