import { describe, it } from 'vitest';
import { deploy, destroy, getOutputs } from '../automation';

describe('streaming endpoint function', async () => {
  beforeAll(async () => {
    await deploy();
  }, 60000);

  afterAll(async () => {
    await destroy();
  }, 60000);

  it('should have a streaming URL', async () => {
    const outputs = await getOutputs();
    const streamingUrl: string = outputs['streamingURL'].value;
    expect(streamingUrl).toBeDefined();
  });
  it('should return a response stream', { timeout: 60000 }, async () => {
    const outputs = await getOutputs();
    const streamingUrl: string = outputs['streamingURL'].value;
    const response = await fetch(streamingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        question: "What's Generative AI, in 200 chars or less"
      })
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/event-stream');
  });
});
