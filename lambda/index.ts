import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { streamifyResponse, ResponseStream } from 'lambda-stream';
import { amazonBedrockConversePrompt } from './prompts';
import { getChatBedrockConverseModel } from './models';
import { queryHandlerSchema } from './schemas';

const handleInternal = async (event: APIGatewayProxyEventV2, responseStream: ResponseStream) => {
  responseStream.setContentType('application/json');
  try {
    // get body payload
    const body = event.body;
    console.log({ body, isBase64Encoded: event.isBase64Encoded });
    if (!body) {
      throw new Error('No request payload found');
    }
    const isBase64Encoded = event.isBase64Encoded;
    // decode base64 if needed
    const bodyString = isBase64Encoded ? Buffer.from(body, 'base64').toString('utf-8') : body;
    const parsedBody = JSON.parse(bodyString);
    // Validate the parsed body
    const bodyValidation = queryHandlerSchema.safeParse(parsedBody);
    if (!bodyValidation.success) {
      throw new Error(bodyValidation.error.errors[0].message);
    }
    const { question } = bodyValidation.data;
    const prompt = amazonBedrockConversePrompt;
    const model = getChatBedrockConverseModel();
    const chain = prompt.pipe(model);
    const stream = await chain.stream({ question });

    let text = '';
    let reasoningText = '';

    for await (const chunk of stream) {
      const parsedChunk = JSON.parse(JSON.stringify(chunk.content));
      const isText = typeof parsedChunk === 'string';
      const isArray = Array.isArray(parsedChunk);
      const reasoningChunk =
        isArray && parsedChunk[0]?.type === 'reasoning_content'
          ? parsedChunk[0].reasoningText.text
          : '';

      if (reasoningChunk) {
        reasoningText += reasoningChunk;
        responseStream.write({ reasoningText });
        responseStream.write('\n');
      }
      if (isText && parsedChunk) {
        text += parsedChunk;
        responseStream.write({ text });
        responseStream.write('\n');
      }
    }

    responseStream.end();
  } catch (error) {
    responseStream.write(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
    );
    responseStream.end();
  }
};

export const handler = streamifyResponse(handleInternal);
