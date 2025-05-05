import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { streamifyResponse, ResponseStream } from 'lambda-stream';
import { amazonBedrockConversePrompt } from './prompts';
import { getChatBedrockConverseModel } from './models';
import { queryHandlerSchema } from './schemas';
import { CustomTextAccumulator } from './custom-transform';
import { decodeBase64String, queryBodySchemaValidator } from './utils';

const handleInternal = async (event: APIGatewayProxyEventV2, responseStream: ResponseStream) => {
  responseStream.setContentType('application/json');
  try {
    // Get and validate body
    const body = event.body;
    if (!body) throw new Error('No request payload found');

    const bodyString = decodeBase64String(body, event.isBase64Encoded);

    // Initialize model and chain
    const { question } = queryBodySchemaValidator(bodyString, queryHandlerSchema);
    const model = getChatBedrockConverseModel();
    const chain = amazonBedrockConversePrompt.pipe(model);
    const bedrockStream = await chain.stream({ question });

    // Create source stream
    const sourceStream = Readable.from(bedrockStream);

    // Create transform stream
    const transformStream = new CustomTextAccumulator();

    // Connect streams with pipeline
    await pipeline(sourceStream, transformStream, responseStream);
  } catch (error) {
    responseStream.write(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
    );
    responseStream.end();
  }
};

export const handler = streamifyResponse(handleInternal);
