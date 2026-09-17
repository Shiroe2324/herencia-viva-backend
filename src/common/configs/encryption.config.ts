import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';

import { ENV_VALIDATION_CONFIG } from '@/constants';
import type { EncryptionConfig as IEncryptionConfig } from '@/types';

const encryptionSchema = Joi.object<IEncryptionConfig>({
  ENCRYPTION_ALGORITHM: Joi.string().valid('aes-128-gcm', 'aes-192-gcm', 'aes-256-gcm').default('aes-256-gcm'),
  ENCRYPTION_IV_LENGTH: Joi.number().valid(12, 16).default(12),
  ENCRYPTION_KEY: Joi.string()
    .required()
    .when(Joi.ref('ENCRYPTION_ALGORITHM'), {
      switch: [
        {
          is: 'aes-128-gcm',
          then: Joi.string()
            .length(32)
            .regex(/^[0-9a-fA-F]+$/)
            .message('ENCRYPTION_KEY must be 32 hexadecimal characters for aes-128-gcm'),
        },
        {
          is: 'aes-192-gcm',
          then: Joi.string()
            .length(48)
            .regex(/^[0-9a-fA-F]+$/)
            .message('ENCRYPTION_KEY must be 48 hexadecimal characters for aes-192-gcm'),
        },
        {
          is: 'aes-256-gcm',
          then: Joi.string()
            .length(64)
            .regex(/^[0-9a-fA-F]+$/)
            .message('ENCRYPTION_KEY must be 64 hexadecimal characters for aes-256-gcm'),
        },
      ],
      otherwise: Joi.forbidden(),
    }),
});

const { value, error } = encryptionSchema.validate(process.env, ENV_VALIDATION_CONFIG);
if (error) throw new Error(`Encryption configuration validation error: ${error.message}`);

export const encryptionConfig = registerAs('encryption-config', () => ({
  algorithm: value.ENCRYPTION_ALGORITHM,
  ivLength: value.ENCRYPTION_IV_LENGTH,
  key: value.ENCRYPTION_KEY,
}));

export type EncryptionConfig = ConfigType<typeof encryptionConfig>;

export const ENCRYPTION_ALGORITHM = value.ENCRYPTION_ALGORITHM;
export const ENCRYPTION_IV_LENGTH = value.ENCRYPTION_IV_LENGTH;
export const ENCRYPTION_KEY = value.ENCRYPTION_KEY;
