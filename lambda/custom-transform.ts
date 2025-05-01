import { Transform } from 'node:stream';

export class CustomTextAccumulator extends Transform {
  private text = '';
  private reasoningText = '';
  constructor() {
    super({ objectMode: true });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform(chunk: any, _encoding: string, callback: (error?: Error | null) => void) {
    try {
      // Parse chunk content
      const parsedChunk = JSON.parse(JSON.stringify(chunk.content));
      const isText = typeof parsedChunk === 'string';
      const isArray = Array.isArray(parsedChunk);

      // Handle reasoning content
      if (isArray && parsedChunk[0]?.type === 'reasoning_content') {
        // accumulate text just to show how tokens are flowing-in
        // in real life, you would want just to send the small current chunk(token)
        this.reasoningText += parsedChunk[0].reasoningText?.text || '';
        this.push(JSON.stringify({ reasoningText: this.reasoningText }) + '\n');
      }

      // Update accumulators
      if (isText && parsedChunk) {
        this.text += parsedChunk;
        this.push(JSON.stringify({ text: this.text }) + '\n');
      }

      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error('Error processing chunk'));
    }
  }
}
