import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  FieldTranslation,
  FieldTranslationDocument,
} from '../schemas/field-translations.schema';
import { DatabaseConnections } from '../../application';

@Injectable()
export class FieldTranslationsRepository extends MongooseRepository<
  FieldTranslation,
  FieldTranslationDocument
> {
  constructor(
    @InjectModel(FieldTranslation.name, DatabaseConnections.TRANSLATIONS)
    model: Model<FieldTranslationDocument>,
  ) {
    super(model);
  }
}
