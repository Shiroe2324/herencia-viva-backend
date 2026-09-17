import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { PathImpl2 } from '@nestjs/config';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { ValidationError } from 'class-validator';
import type { Request, Response } from 'express';
import { I18nContext, I18nService, I18nValidationException } from 'nestjs-i18n';
import { Logger } from 'nestjs-pino';

import type { ErrorCode } from '@/constants';
import { GENERIC_ERROR_CODES } from '@/constants';
import { LanguageCodes } from '@/enums';
import { I18nTranslations } from '@/generated/i18n.generated';
import type { FormattedValidationError, HttpErrorBody, HttpExceptionResponse } from '@/types';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly logger: Logger,
  ) {}

  public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const lang = I18nContext.current()?.lang || (req.headers['x-lang'] as string) || LanguageCodes.EN;

    let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorName = HttpStatus[status];
    let code: ErrorCode = GENERIC_ERROR_CODES.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: FormattedValidationError[] | null = null;

    if (exception instanceof HttpException) {
      const responseRaw = exception.getResponse();

      if (this.isHealthCheckPayload(responseRaw)) {
        res.status(status).json(responseRaw);
        return;
      }

      const response: HttpExceptionResponse = typeof responseRaw === 'string' ? { message: responseRaw } : (responseRaw as HttpExceptionResponse);
      const possibleCode = response.message ?? exception.message;

      if (this.isErrorCode(possibleCode)) {
        code = possibleCode;
        message = await this.translateFromCode(code, lang);
      } else {
        message = await this.translateIfPossible(possibleCode, lang);
      }

      if (status === HttpStatus.TOO_MANY_REQUESTS) {
        code = GENERIC_ERROR_CODES.THROTTLED;
        message = await this.translateFromCode(code, lang);
      }

      if (status === HttpStatus.NOT_FOUND && !this.isErrorCode(possibleCode)) {
        code = GENERIC_ERROR_CODES.NOT_FOUND;
        message = await this.translateFromCode(code, lang);
      }

      errorName = response.error ?? HttpStatus[status];

      if (exception instanceof I18nValidationException) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        errorName = 'Unprocessable Entity';
        code = GENERIC_ERROR_CODES.INVALID_INPUT;
        message = await this.translateFromCode(code, lang);
        errors = await this.formatErrors(exception.errors, lang);
      }
    } else {
      this.safeInternalLogging(exception, req, status);
    }

    const body: HttpErrorBody = {
      statusCode: status,
      error: errorName,
      code,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      path: req.url,
      ...(errors && { errors }),
    };

    if (status >= 500) {
      this.logger.error(body, 'HTTP Server Error');
    }

    res.status(status).json(body);
  }

  private isHealthCheckPayload(value: unknown): value is HealthIndicatorResult {
    if (!value || typeof value !== 'object') return false;
    const payload = value as Record<string, unknown>;
    return payload['status'] === 'error';
  }

  private isErrorCode(value: unknown): value is ErrorCode {
    return typeof value === 'string' && /^[A-Z]+(\.[A-Z0-9_]+)+$/.test(value);
  }

  private async translateFromCode(code: ErrorCode, lang: string): Promise<string> {
    const [module, key] = code.split('.', 2);
    return this.i18n.translate(`${module.toLowerCase()}.${key}` as PathImpl2<I18nTranslations>, { lang, defaultValue: code });
  }

  private safeInternalLogging(exception: unknown, req: Request, status: number): void {
    const isAuthRoute = req.url.includes('login') || req.url.includes('register');
    const logDetails: Record<string, unknown> = { statusCode: status, path: req.url };

    if (!isAuthRoute) {
      logDetails['stack'] = exception instanceof Error ? exception.stack : 'No stack trace';
      logDetails['details'] = exception;
    }

    this.logger.error(logDetails, `Unhandled Internal Server Error`);
  }

  private async translateIfPossible(value: string, lang: string, defaultValue?: string): Promise<string> {
    if (!value || typeof value !== 'string') return value;
    if (!/^[a-zA-Z0-9_.-]+$/.test(value)) return value;

    try {
      return await this.i18n.translate(value as PathImpl2<I18nTranslations>, { lang, defaultValue: defaultValue ?? value });
    } catch {
      return defaultValue ?? value;
    }
  }

  private async formatErrors(errors: ValidationError[], lang: string): Promise<FormattedValidationError[]> {
    const result: FormattedValidationError[] = [];

    for (const error of errors) {
      if (error.children?.length) {
        result.push(...(await this.formatErrors(error.children, lang)));
      }

      if (!error.constraints) continue;

      for (const constraint of Object.values(error.constraints)) {
        if (typeof constraint !== 'string') {
          result.push({ field: error.property, message: String(constraint).trim() });
          continue;
        }

        const [key, rawArgs] = constraint.split('|', 2);
        let args: Record<string, unknown> = { property: error.property };

        if (rawArgs) {
          try {
            args = { ...args, ...JSON.parse(rawArgs) };
          } catch {
            args = { property: error.property };
          }
        }

        const translated = this.i18n.translate(key as PathImpl2<I18nTranslations>, { lang, args, defaultValue: key });

        result.push({ field: error.property, message: String(translated).trim() });
      }
    }

    return result;
  }
}
