import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EntityTranslation,
  EntityTranslationDocument,
} from '../schemas/entity-translations.schema';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { DatabaseConnections } from '../../application';

@Injectable()
export class EntityTranslationsRepository extends MongooseRepository<
  EntityTranslation,
  EntityTranslationDocument
> {
  constructor(
    @InjectModel(EntityTranslation.name, DatabaseConnections.TRANSLATIONS)
    model: Model<EntityTranslationDocument>,
  ) {
    super(model);
  }
}
