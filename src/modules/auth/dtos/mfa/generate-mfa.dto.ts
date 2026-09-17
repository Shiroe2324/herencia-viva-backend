import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { GENERATE_MFA_DOCS } from '@/auth/docs/constants/auth-mfa.constant';
import { BASE32_EXAMPLE, OTPAUTH_URL_EXAMPLE, QR_CODE_EXAMPLE } from '@/constants';

const { NAME, DESCRIPTION, FIELDS } = GENERATE_MFA_DOCS.RESPONSE;

@ApiSchema({ name: NAME, description: DESCRIPTION })
export class GenerateMfaResponse {
  @ApiProperty({ description: FIELDS.BASE32, example: BASE32_EXAMPLE })
  public base32!: string;

  @ApiProperty({ description: FIELDS.OTPAUTH_URL, example: OTPAUTH_URL_EXAMPLE })
  public otpauthUrl!: string;

  @ApiProperty({ description: FIELDS.QR, example: QR_CODE_EXAMPLE })
  public qr!: string;
}
