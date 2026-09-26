import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class PredictHeartDto {
  @IsNotEmpty()
  @IsObject()
  inputData: Record<string, any>;
}

export class PredictDiabetesDto {
  @IsNotEmpty()
  @IsObject()
  inputData: Record<string, any>;
}

export class PredictKidneyDto {
  @IsNotEmpty()
  @IsObject()
  inputData: Record<string, any>;
}


export class ConsultationChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  history?: Array<any>;
}

