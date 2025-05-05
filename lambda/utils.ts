import { z } from 'zod';
import { queryHandlerSchema } from './schemas';

export function decodeBase64String(
  bodyString: string | undefined,
  isBase64Encoded: boolean
): string {
  if (!bodyString) {
    throw new Error('Base64 string is undefined or empty');
  }
  return isBase64Encoded ? Buffer.from(bodyString, 'base64').toString('utf-8') : bodyString;
}

export function queryBodySchemaValidator(
  bodyString: string,
  schema: typeof queryHandlerSchema
): z.infer<typeof schema> {
  const parsedBody = JSON.parse(bodyString);
  const bodyValidation = schema.safeParse(parsedBody);
  if (!bodyValidation.success) {
    throw new Error(bodyValidation.error.errors[0].message);
  }
  return bodyValidation.data;
}
