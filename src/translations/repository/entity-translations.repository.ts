import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EntityTranslation,
  EntityTranslationDocument,
} from '../schemas/entity-translations.schema';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class EntityTranslationsRepository extends MongooseRepository<
  EntityTranslation,
  EntityTranslationDocument
> {
  constructor(
    @InjectModel(EntityTranslation.name)
    model: Model<EntityTranslationDocument>,
  ) {
    super(model);
  }
}
