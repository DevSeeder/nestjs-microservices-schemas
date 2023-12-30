import { Prop } from '@nestjs/mongoose';

export abstract class AbstractTranslation {
  @Prop({ required: true })
  projectKey: string;

  @Prop({ required: true })
  locale: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  translation: string;

  @Prop()
  context?: string;

  @Prop()
  source?: string;

  @Prop()
  quality?: number;
}
