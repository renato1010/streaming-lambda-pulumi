[Spanish](README.es.md)

# 🚀 Stream-Ready AWS Lambda with Pulumi & LangChain (TypeScript)

**Deploy and test a streaming-capable Lambda function** using modern IaC tools and AI workflows. Built with cutting-edge AWS features and LLM integration!

![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![Pulumi](https://img.shields.io/badge/Pulumi-IAAC_%E2%9A%99%EF%B8%8F-blue)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda_Streaming-FF9900)
![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-Models)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18)

## 🌟 Features

- **Lambda Response Streaming** (AWS April 2023 feature) 💨
- **Pulumi Infrastructure-as-Code** (TypeScript flavor) 🏗️
- **LangChain** LCEL workflows integrated with **AWS Bedrock** (DeepSeek R1 model) ⚡
- **Full-stack testing** (Vitest + Pulumi Automation API) 🧪
- **Zero-dependency** deployment with `pnpm` 📦

## 🛠️ Prerequisites

- [AWS Account](https://aws.amazon.com/free) (Free Tier OK)
- [Node.js 18+](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- AWS CLI configured with valid credentials

## ⚡ Quick Start

```bash
# Clone & setup
git clone https://github.com/renato1010/streaming-lambda-pulumi
cd streaming-lambda-pulumi
pnpm install

# Deploy infrastructure
pulumi up -y

# Run unit tests
pnpm vitest -t utils

# Execute integration tests
pnpm test -t streaming
```

## 🔍 Testing Architecture

### 1. Unit Tests (`/tests/utils.test.ts`)

```typescript
// Example Vitest case
const base64String = 'eyJxdWVzdGlvbiI6IldoYXQncyBHZW5lcmF0aXZlIEFJLCBpbiAyMDAgY2hhcnMgb3IgbGVzcyJ9';
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
```

### 2. Infrastructure Tests (`/tests/streaming-function.test.ts`)

```typescript
// Pulumi Automation API integration test
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
```

## 🎬 Live Demo: Stream Responses with HTTPie

```bash
http --stream POST $(pulumi stack output streamingURL )  \
  question="What's Generative AI, in 200 chars or less"
```

## 🧩 Tech Stack

| Component                    | Role                                    |
| ---------------------------- | --------------------------------------- |
| 🐑 **Pulumi**                | IaC orchestration                       |
| ⚡ **AWS Lambda Streaming**  | Chunked response delivery               |
| 🔗 **LangChain LCEL(TS)**    | Langchain Expression Language(Runnable) |
| 🤖 **AWS Bedrock**           | DeepSeek R1 model                       |
| 🧪 **Vitest**                | Unit/component testing                  |
| 🤖 **Pulumi Automation API** | Infrastructure validation               |

## 🔗 Resources

- [AWS Lambda Streaming Announcement](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/)
- [Pulumi Streaming Lambda Guide](https://www.pulumi.com/blog/aws-lambda-response-streaming/)
- [LangChain JS Documentation](https://js.langchain.com/docs/how_to/sequence/)

---

**Found this useful?** ⭐ Star the repo
_License: [MIT](LICENSE)_ 📜
