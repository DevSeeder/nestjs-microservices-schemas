import { GenericRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { DatabaseConnections } from '../application';
import { Automation } from '../schemas/automation.schema';

@Injectable()
export class AutomationsRepository extends GenericRepository<Automation> {
  constructor(
    @InjectModel(Automation.name, DatabaseConnections.SCHEMAS)
    model: Model<Automation & Document>,
  ) {
    super(model);
  }
}
