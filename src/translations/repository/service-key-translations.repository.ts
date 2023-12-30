import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  ServiceKeyTranslation,
  ServiceKeyTranslationDocument,
} from '../schemas/service-key-translations.schema';

@Injectable()
export class ServiceKeyTranslationsRepository extends MongooseRepository<
  ServiceKeyTranslation,
  ServiceKeyTranslationDocument
> {
  constructor(
    @InjectModel(ServiceKeyTranslation.name)
    model: Model<ServiceKeyTranslationDocument>,
  ) {
    super(model);
  }
}
