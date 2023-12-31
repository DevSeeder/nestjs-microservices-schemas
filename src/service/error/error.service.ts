import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';

import { NotFoundException } from '@devseeder/microservices-exceptions';
import { SchemaDependecyTokens } from '../../application';
import { ErrorSchema } from '../../schemas/error-schemas.schema';
import { GetTranslationService } from '../../translations';
import { ErrorSchemaException } from '../../exceptions/error-schema.exception';

@Injectable()
export class ErrorService extends AbstractService {
  constructor(
    @Inject(SchemaDependecyTokens.ERROR_SCHEMA_DB)
    protected readonly errors: ErrorSchema[],
    protected readonly translationService: GetTranslationService,
  ) {
    super();
  }

  throwError(
    errorKey: string,
    errorProps?: {
      key?: string;
      value?: string;
      pattern?: string;
    },
  ): void {
    const lang = this.translationService.getLang();
    this.logger.log(`Error Key: ${errorKey}`);
    const errorSchema = this.errors.filter((err) => err.key === errorKey);

    if (!errorSchema.length) throw new NotFoundException('Error Schema');

    let messageError = errorSchema[0].message;

    const errorTranslation = errorSchema[0].translations.filter(
      (tra) => tra.locale === lang,
    );

    if (errorTranslation.length) messageError = errorTranslation[0].value;

    throw new ErrorSchemaException(
      replaceTemplateObject(messageError, errorProps),
      errorSchema[0].httpStatus,
      errorSchema[0].code,
      errorSchema[0].name,
    );
  }

  async getJoiErrors(): Promise<Record<string, string>> {
    const joiMessages = {};
    const joiErrors = this.errors.filter(
      (err) =>
        err['metadata'] &&
        err['metadata']['joiMessages'] &&
        err['metadata']['joiMessages'].length,
    );

    for await (const err of joiErrors) {
      const translatedMessage = err.translations.filter(
        (tra) => tra.locale === this.translationService.getLang(),
      );
      err['metadata']['joiMessages'].forEach((joiMsg) => {
        const objReplace = {
          key: err['metadata']['joiFieldTranslation']
            ? '@translate({#label})'
            : '{#label}',
          value:
            (err['metadata']['joiAlias'] &&
              err['metadata']['joiAlias'].value) ||
            '',
          pattern:
            (err['metadata']['joiAlias'] &&
              err['metadata']['joiAlias'].pattern) ||
            '',
        };

        let replaceMessage = translatedMessage[0].value
          .replace('${key}', objReplace.key)
          .replace('${pattern}', `{#${objReplace.pattern}}`);

        switch (objReplace.value) {
          case 'type':
            const type = joiMsg.split('.')[0];
            replaceMessage = replaceMessage.replace(
              '${value}',
              `${this.translationService.getServiceKeyTranslation(type)}`,
            );
            break;
          case '@empty':
            replaceMessage = replaceMessage
              .replace('${value}', '')
              .replace("'' ", '');
            break;
          default:
            replaceMessage = replaceMessage.replace(
              '${value}',
              `{#${objReplace.value}}`,
            );
            break;
        }

        joiMessages[joiMsg] = replaceMessage;
      });
    }

    return joiMessages;
  }

  getJoiErrorByType(type: string): ErrorSchema {
    return this.errors.filter(
      (err) =>
        err['metadata'] &&
        err['metadata']['joiMessages'] &&
        err['metadata']['joiMessages'].includes(type),
    )[0];
  }
}

function replaceTemplateObject(str: string, data: object) {
  if (!str || !data || !Object.keys(data).length) return str;

  return str.replace(/\$\{(\w+)\}/g, (match, token) => data[token] || match);
}
