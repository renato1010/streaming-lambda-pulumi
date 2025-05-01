import { PromptTemplate } from '@langchain/core/prompts';

export const amazonBedrockConversePrompt = new PromptTemplate({
  template: `You are a helpful assistant. 
You will be given a question and you will answer it in a conversational manner.
Your answer should be informative and engaging, as if you were having a conversation with a friend.
If you don't know the answer, say "I don't know" or "I'm not sure". That's totally fine.
The question is: {question}
Your answer:`,
  inputVariables: ['question']
});
