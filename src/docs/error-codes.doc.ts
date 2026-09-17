import { AUTH_ERROR_CODES, GENERIC_ERROR_CODES, RECOMMENDATIONS_ERROR_CODES, USERS_ERROR_CODES } from '@/constants';
import type { ErrorCodeMap, ErrorCodeSection } from '@/types';

const ERROR_CODE_SECTIONS: ErrorCodeSection[] = [
  { title: 'Authentication Error Codes (AUTH)', codes: AUTH_ERROR_CODES },
  { title: 'Recommendations Error Codes', codes: RECOMMENDATIONS_ERROR_CODES },
  { title: 'Users Error Codes (USERS)', codes: USERS_ERROR_CODES },
  { title: 'Generic Error Codes', codes: GENERIC_ERROR_CODES },
];

const generateErrorCodesMarkdown = (title: string, codes: ErrorCodeMap): string =>
  `### ${title}\n\n${Object.values(codes)
    .map((code) => `- \`${code}\``)
    .join('\n')}`;

export const errorCodesSection = [
  '## Global Error Codes',
  'All API endpoints that return an error status code (4xx or 5xx) return a response body that includes an `code` field. This code allows the client to handle errors programmatically. Below are all possible codes:',
  ...ERROR_CODE_SECTIONS.map(({ title, codes }) => generateErrorCodesMarkdown(title, codes)),
].join('\n\n---\n\n');
