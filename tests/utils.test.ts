import { describe, expect, it } from 'vitest';
import { queryHandlerSchema } from '../lambda/schemas';
import { decodeBase64String, queryBodySchemaValidator } from '../lambda/utils';

describe('utility functions', () => {
  const base64String =
    'eyJxdWVzdGlvbiI6IldoYXQncyBHZW5lcmF0aXZlIEFJLCBpbiAyMDAgY2hhcnMgb3IgbGVzcyJ9';
  const expectedJsonString = `{"question":"What's Generative AI, in 200 chars or less"}`;

  it('should decode base64', () => {
    const jsonString = decodeBase64String(base64String, true);
    expect(jsonString).toEqual(expectedJsonString);
  });
  it('should validate body payload against schema', () => {
    const bodyString = expectedJsonString;
    const validatedBody = queryBodySchemaValidator(bodyString, queryHandlerSchema);
    expect(validatedBody).toStrictEqual(JSON.parse(expectedJsonString));
  });
});
