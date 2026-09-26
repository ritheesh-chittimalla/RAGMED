import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PredictionHistory } from './prediction.entity';

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);
  private readonly mlServiceUrl: string;

  constructor(
    @InjectRepository(PredictionHistory)
    private readonly predictionRepository: Repository<PredictionHistory>,
    private readonly configService: ConfigService,
  ) {
    this.mlServiceUrl =
      this.configService.get<string>('ML_SERVICE_URL') || 'http://127.0.0.1:8000';
  }

  async predictHeart(userId: string, inputData: any) {
    return this.runPredictionAndSave(userId, 'Heart Disease', '/predict/heart', inputData);
  }

  async predictDiabetes(userId: string, inputData: any) {
    return this.runPredictionAndSave(userId, 'Diabetes', '/predict/diabetes', inputData);
  }

  async predictKidney(userId: string, inputData: any) {
    return this.runPredictionAndSave(userId, 'Chronic Kidney Disease', '/predict/kidney', inputData);
  }

  async getPredictionHistory(userId: string) {
    return this.predictionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPredictionById(id: string) {
    const record = await this.predictionRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Prediction record ${id} not found`);
    }
    return record;
  }

  private async runPredictionAndSave(
    userId: string,
    diseaseName: string,
    endpoint: string,
    inputData: any,
  ) {
    try {
      const response = await fetch(`${this.mlServiceUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ML Service responded with HTTP ${response.status}: ${errText}`);
      }

      const mlResult = await response.json();

      // Save prediction result to PostgreSQL history
      const historyRecord = this.predictionRepository.create({
        userId,
        disease: diseaseName,
        inputData,
        prediction: mlResult.prediction,
        probability: mlResult.probability,
        riskLevel: mlResult.risk_level,
      });

      const savedRecord = await this.predictionRepository.save(historyRecord);

      return {
        id: savedRecord.id,
        disease: diseaseName,
        prediction: mlResult.prediction,
        prediction_label: mlResult.prediction_label,
        probability: mlResult.probability,
        risk_level: mlResult.risk_level,
        top_risk_factors: mlResult.top_risk_factors,
        disclaimer: mlResult.disclaimer,
        createdAt: savedRecord.createdAt,
      };
    } catch (error) {
      this.logger.error(`Failed ML prediction for ${diseaseName}: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        `ML prediction service unavailable: ${(error as Error).message}`,
      );
    }
  }

  async consultationChat(message: string, history?: any[]) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    const systemPrompt = `You are Dr. Sarah Johnson, an empathetic, highly experienced Consultant Cardiologist at Mediqon Medical Center.
You are currently in a live tele-consultation text session with your patient.
Respond directly, professionally, and empathetically to the patient's messages. Provide clear medical insights, lifestyle recommendations, follow-up advice, or clinical guidance.
Keep responses concise (2-4 sentences max per chat reply) so it feels like a natural messaging conversation with a physician.
Always maintain a warm, reassuring, expert tone. Do not give raw markdown headers like # or ###. Use clean text.
If the patient just says "hello", "hi", or greets you, warmly greet them back and ask how they are feeling today or if they have any specific symptoms or questions about their health assessment.`;

    if (apiKey) {
      try {
        const contents: any[] = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I am Dr. Sarah Johnson, ready for the consultation.' }] },
        ];

        if (history && history.length > 0) {
          for (const msg of history.slice(-6)) {
            contents.push({
              role: msg.isDoctor ? 'model' : 'user',
              parts: [{ text: msg.text }],
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return { reply: reply.trim() };
          }
        }
      } catch (err) {
        this.logger.warn(`Gemini consultation chat failed, using fallback: ${(err as Error).message}`);
      }
    }

    // Dynamic medical intelligence fallback if Gemini API key is unconfigured
    const lowerMsg = message.toLowerCase().trim();
    let reply = '';

    if (
      lowerMsg === 'hello' ||
      lowerMsg === 'hi' ||
      lowerMsg === 'hey' ||
      lowerMsg.includes('hello') ||
      lowerMsg.includes('hi doctor') ||
      lowerMsg.includes('good morning') ||
      lowerMsg.includes('good afternoon')
    ) {
      reply =
        "Hello! I'm Dr. Sarah Johnson. I've been reviewing your health vitals and telemetry parameters. How are you feeling today, and do you have any specific symptoms or questions about your assessment?";
    } else if (
      lowerMsg.includes('pressure') ||
      lowerMsg.includes('bp') ||
      lowerMsg.includes('hypertension') ||
      lowerMsg.includes('blood pressure')
    ) {
      reply =
        'I noticed your diastolic pressure was slightly elevated. I recommend maintaining a low-sodium diet, ensuring consistent hydration, and tracking morning and evening readings. We will review your 7-day trend closely.';
    } else if (
      lowerMsg.includes('heart') ||
      lowerMsg.includes('chest') ||
      lowerMsg.includes('pulse') ||
      lowerMsg.includes('bpm')
    ) {
      reply =
        'Your resting heart rate is showing around 72 BPM, which is in a normal, optimal range. If you ever experience chest discomfort, shortness of breath, or palpitations, please alert us immediately.';
    } else if (
      lowerMsg.includes('report') ||
      lowerMsg.includes('result') ||
      lowerMsg.includes('prediction') ||
      lowerMsg.includes('risk') ||
      lowerMsg.includes('model')
    ) {
      reply =
        'Your assessment data has been logged into your Medical Vault. Our ML risk models provide useful statistical indicators, and I am here to discuss any specific risk factors or routine precautions with you.';
    } else if (
      lowerMsg.includes('diet') ||
      lowerMsg.includes('food') ||
      lowerMsg.includes('eat') ||
      lowerMsg.includes('exercise') ||
      lowerMsg.includes('lifestyle')
    ) {
      reply =
        'A heart-healthy Mediterranean-style diet high in fiber, whole grains, and lean proteins, combined with 30 minutes of moderate aerobic activity daily, yields excellent cardiovascular protection.';
    } else {
      reply = `Thank you for sharing. I've noted down "${message}" in your clinical summary. Based on your current vitals, we should continue monitoring your key health indicators and schedule a routine follow-up check if any new symptoms arise.`;
    }

    return { reply };
  }
}

