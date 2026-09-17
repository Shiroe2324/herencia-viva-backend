export const EMAIL_EXAMPLE = 'john.smith@demo.com';
export const USERNAME_EXAMPLE = 'johnsmith';
export const DISPLAY_NAME_EXAMPLE = 'John Smith';
export const PASSWORD_EXAMPLE = 'MyStr0ng_Passw0rd#2025';
export const PHONE_EXAMPLE = '+573001112233';
export const GENDER_EXAMPLE = 'male';
export const AGE_EXAMPLE = 29;
export const IMAGE_EXAMPLE = `https://cdn.demo.com/profiles/${USERNAME_EXAMPLE}.png`;
export const TOTP_EXAMPLE = '482913';
export const BACKUP_CODES_EXAMPLE = ['9K4M-82LD', 'C7P9-Q2RT', 'Z3NM-1HJK'];
export const UUID_EXAMPLE = '8bbd5fc4-4ee1-4d79-a6f6-c7be9f80a8fc';
export const DATE_EXAMPLE = new Date().toISOString();
export const BASE32_EXAMPLE = 'JBSWY3DPEHPK3PXPIZXXEZJA';
export const OTPAUTH_URL_EXAMPLE = `otpauth://totp/MyApp:${EMAIL_EXAMPLE}?secret=${BASE32_EXAMPLE}&issuer=MyApp`;
export const QR_CODE_EXAMPLE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
export const USER_IDENTIFIER_EXAMPLE = `${EMAIL_EXAMPLE} or ${USERNAME_EXAMPLE}`;
export const EXPIRATION_TIME_EXAMPLE = 3600;
export const USER_PROMPT_EXAMPLE = 'What is the best way to improve pasture quality during the dry season?';
export const VECTORING_DB_ID_EXAMPLE = '9d5de639f4c2f5547db4f76cc95ce8f8b72ddf5266f4d8d35b8437e2519064f2';
export const VECTORING_DB_QUESTION_EXAMPLE = 'How can I reduce heat stress in my cattle during summer?';
export const VECTORING_DB_TAGS_EXAMPLE = ['cattle', 'heat-stress', 'summer'];
export const VECTORING_DB_ANSWER_EXAMPLE = `To reduce heat stress in your cattle during summer, you can implement shade structures in grazing areas, ensure constant access to clean and cool water, adjust feeding schedules to cooler parts of the day, consider using fans or misting systems to increase air circulation, and closely monitor your cattle for signs of heat stress such as excessive panting or lethargy. Taking these steps can help keep your cattle comfortable and healthy during hot weather.`;
export const VECTORING_DB_DOCUMENT_EXAMPLE = `Pregunta: ${VECTORING_DB_QUESTION_EXAMPLE}\nRespuesta: ${VECTORING_DB_ANSWER_EXAMPLE}`;
export const RECOMMENDATION_CHAT_TITLE_EXAMPLE = 'Pasture rotation plan for rainy season';
export const RECOMMENDATION_CHAT_ROLE_EXAMPLE = 'user';
export const RECOMMENDATION_EXAMPLE =
  'To improve pasture quality during the dry season, consider implementing rotational grazing, planting drought-resistant forage species, and supplementing with high-quality feed. Additionally, ensure proper soil management and irrigation practices to maintain pasture health.';
export const RECOMMENDATION_ERROR = 'Failed to generate recommendation due to an internal error. Please try again later.';
export const JOB_ID_EXAMPLE = '123456789';
export const JOB_PREV_EXAMPLE = 'waiting';
export const JOB_PROGRESS_EXAMPLE = { progress: 50, message: 'Halfway there!' };
export const JOB_FAILED_REASON_EXAMPLE = 'An unexpected error occurred while processing the job.';
export const JOB_ERROR_MESSAGE_EXAMPLE = 'Failed to connect to the database';
export const TOKEN_EXAMPLE = '5d76dd446a0076843cb14a6cf51ac0d1c849b3c3fd8126ee11cd183b1645141c';
export const JWT_TOKEN_EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImpvaG5zbWl0aCIsImlhdCI6MTUxNjIzOTAyMn0.' +
  'uIb2Ng_YtcJGB25oz5TDfzQ3x5UroincpPnT4HgvE64';
