import { ChatBedrockConverse, type ChatBedrockConverseInput } from '@langchain/aws';

type ChatBedrockModelRestInput = Omit<ChatBedrockConverseInput, 'region' | 'model' | 'temperature'>;
type ChatBedrockConverseModelInput = ChatBedrockModelRestInput & {
  region: string;
  model: string;
  temperature: number;
};
export function getChatBedrockConverseModel(
  model = 'us.deepseek.r1-v1:0',
  temperature = 0,
  region = 'us-east-1',
  rest?: ChatBedrockModelRestInput
) {
  return new ChatBedrockConverse({
    model,
    region,
    temperature,
    ...rest
  } as ChatBedrockConverseModelInput);
}
