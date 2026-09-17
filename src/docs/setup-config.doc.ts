import { HttpStatus } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { SwaggerCustomOptions } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject, ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { ApiReferenceOptions } from '@scalar/nestjs-api-reference';
import basicAuth from 'express-basic-auth';
import type { RedocOptions } from 'nestjs-redoc';
import { RedocModule } from 'nestjs-redoc';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import {
  AUTH_APPLE_TAG,
  AUTH_GOOGLE_TAG,
  AUTH_MFA_TAG,
  AUTH_PASSWORD_TAG,
  AUTH_REGISTRATION_TAG,
  AUTH_SESSION_LOGS_TAG,
  AUTH_SESSION_TAG,
  HEALTH_CORE_TAG,
  HEALTH_NOTIFICATIONS_TAG,
  RECOMMENDATIONS_CHATS_TAG,
  RECOMMENDATIONS_CONTEXTS_TAG,
  RECOMMENDATIONS_LLM_TAG,
  USERS_CLIENTS_TAG,
  USERS_CORE_TAG,
  USERS_PICTURE_TAG,
  USERS_RECOVERY_TAG,
} from '@/constants';
import { errorCodesSection } from '@/docs/error-codes.doc';
import { LanguageCodes } from '@/enums';
import { TooManyRequestsModel } from '@/models';
import { toSnakeCase } from '@/utils';

const SWAGGER_TAGS = [
  HEALTH_CORE_TAG,
  HEALTH_NOTIFICATIONS_TAG,
  AUTH_APPLE_TAG,
  AUTH_GOOGLE_TAG,
  AUTH_MFA_TAG,
  AUTH_PASSWORD_TAG,
  AUTH_REGISTRATION_TAG,
  AUTH_SESSION_TAG,
  AUTH_SESSION_LOGS_TAG,
  RECOMMENDATIONS_LLM_TAG,
  RECOMMENDATIONS_CONTEXTS_TAG,
  RECOMMENDATIONS_CHATS_TAG,
  USERS_CLIENTS_TAG,
  USERS_CORE_TAG,
  USERS_PICTURE_TAG,
  USERS_RECOVERY_TAG,
];

const TAG_GROUPS = [
  {
    name: 'Health',
    tags: [HEALTH_CORE_TAG.NAME, HEALTH_NOTIFICATIONS_TAG.NAME],
  },
  {
    name: 'Recommendations',
    tags: [RECOMMENDATIONS_LLM_TAG.NAME, RECOMMENDATIONS_CONTEXTS_TAG.NAME, RECOMMENDATIONS_CHATS_TAG.NAME],
  },
  {
    name: 'Authentication',
    tags: [
      AUTH_APPLE_TAG.NAME,
      AUTH_GOOGLE_TAG.NAME,
      AUTH_MFA_TAG.NAME,
      AUTH_PASSWORD_TAG.NAME,
      AUTH_REGISTRATION_TAG.NAME,
      AUTH_SESSION_TAG.NAME,
      AUTH_SESSION_LOGS_TAG.NAME,
    ],
  },
  {
    name: 'Users',
    tags: [USERS_CLIENTS_TAG.NAME, USERS_CORE_TAG.NAME, USERS_PICTURE_TAG.NAME, USERS_RECOVERY_TAG.NAME],
  },
];

type SwaggerSchema = SchemaObject & {
  properties?: Record<string, SwaggerSchema | ReferenceObject>;
  items?: SwaggerSchema | ReferenceObject;
};

type SwaggerTag = (typeof SWAGGER_TAGS)[number];

const isSwaggerSchema = (schema: SwaggerSchema | ReferenceObject | undefined): schema is SwaggerSchema =>
  !!schema && typeof schema === 'object' && !('$ref' in schema);

const snakeCaseSchema = (schema: SwaggerSchema | ReferenceObject | undefined): void => {
  if (!isSwaggerSchema(schema)) return;

  if (schema.properties) {
    const newProperties: Record<string, SwaggerSchema | ReferenceObject> = {};
    for (const key in schema.properties) {
      const snakeKey = toSnakeCase(key);
      newProperties[snakeKey] = schema.properties[key];
      snakeCaseSchema(newProperties[snakeKey]);
    }
    schema.properties = newProperties;
  }

  if (schema.type === 'array' && schema.items) {
    snakeCaseSchema(schema.items);
  }

  if (schema.required && Array.isArray(schema.required)) {
    schema.required = schema.required.map((field: string) => toSnakeCase(field));
  }
};

const createLangSchema = (defaultLanguage: string): SchemaObject => ({
  enum: Object.values(LanguageCodes),
  default: defaultLanguage,
  type: 'string',
});

const addTagToBuilder = (builder: DocumentBuilder, tag: SwaggerTag) => builder.addTag(tag.NAME, tag.DESCRIPTION);

function buildSwaggerConfig(configService: ConfigService) {
  const config = {
    defaultLanguage: configService.getOrThrow<string>('main-config.defaultLanguage'),
    title: configService.getOrThrow<string>('docs-config.title'),
    description: configService.getOrThrow<string>('docs-config.description'),
    version: configService.getOrThrow<string>('docs-config.version'),
  };

  const langSchema = createLangSchema(config.defaultLanguage);
  const sections = [config.description, errorCodesSection].join('\n\n---\n\n');

  return SWAGGER_TAGS.reduce(
    addTagToBuilder,
    new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(sections)
      .setVersion(config.version)
      .addGlobalParameters({ name: 'x-lang', in: 'header', description: 'Language code', required: false, schema: langSchema })
      .addGlobalResponse({ description: 'Too many requests', status: HttpStatus.TOO_MANY_REQUESTS, type: TooManyRequestsModel })
      .addBearerAuth(),
  ).build();
}

function buildScalarOptions(docsName: string, docsFavicon: string): ApiReferenceOptions {
  return {
    title: docsName,
    hideDownloadButton: false,
    favicon: docsFavicon,
    theme: 'solarized',
  };
}

function buildSwaggerOptions(docsFavicon: string, docsName: string): SwaggerCustomOptions {
  const theme = new SwaggerTheme();
  return {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.FLATTOP),
    customfavIcon: docsFavicon,
    customSiteTitle: docsName,
    swaggerOptions: { persistAuthorization: true },
  };
}

function buildRedocOptions(docsName: string, docsFavicon: string, docsIcon: string): RedocOptions {
  return {
    title: docsName,
    favicon: docsFavicon,
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    expandResponses: '200,201,202',
    logo: { url: docsIcon, backgroundColor: '#ffffff', altText: 'API Logo' },
    tagGroups: TAG_GROUPS,
  };
}

function snakeCaseSchemas(document: OpenAPIObject): void {
  const schemas = document.components?.schemas;
  if (!schemas) return;

  for (const schemaName in schemas) {
    snakeCaseSchema(schemas[schemaName]);
  }
}

export async function configureSwagger(app: NestExpressApplication, configService: ConfigService) {
  const docsConfig = {
    name: configService.getOrThrow<string>('docs-config.name'),
    icon: configService.getOrThrow<string>('docs-config.icon'),
    favicon: configService.getOrThrow<string>('docs-config.favicon'),
  };

  const swaggerUser = configService.getOrThrow<string>('docs-config.user');
  const swaggerPassword = configService.getOrThrow<string>('docs-config.password');

  app.use(['/swagger', '/reference', '/docs'], basicAuth({ challenge: true, users: { [swaggerUser]: swaggerPassword } }));

  const swaggerConfig = buildSwaggerConfig(configService);
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  snakeCaseSchemas(document);

  const scalarOptions = buildScalarOptions(docsConfig.name, docsConfig.favicon);
  const swaggerOptions = buildSwaggerOptions(docsConfig.favicon, docsConfig.name);
  const redocOptions = buildRedocOptions(docsConfig.name, docsConfig.favicon, docsConfig.icon);
  const redocApp = app as unknown as Parameters<typeof RedocModule.setup>[1];

  app.use('/reference', apiReference({ content: document, ...scalarOptions }));
  SwaggerModule.setup('/swagger', app, document, swaggerOptions);
  await RedocModule.setup('/docs', redocApp, document, redocOptions);
}
