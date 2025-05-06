[English](README.md)

# 🚀 Lambda de AWS con Streaming usando Pulumi & LangChain (TypeScript)

**Despliega y prueba una función Lambda con capacidad de streaming** utilizando herramientas modernas de IaC y flujos de trabajo de IA. ¡Desarrollado con funciones vanguardistas de AWS e integración LLM!

![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![Pulumi](https://img.shields.io/badge/Pulumi-IAAC_%E2%9A%99%EF%B8%8F-blue)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda_Streaming-FF9900)
![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-Models)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18)

## 🌟 Características

- **Streaming de Respuestas en Lambda** (Función de AWS desde Abril 2023) 💨
- **Infraestructura como Código con Pulumi** (Versión TypeScript) 🏗️
- **LangChain LCEL** integrado con **AWS Bedrock** (Modelo DeepSeek R1) ⚡
- **Pruebas full-stack** (Vitest + Pulumi Automation API) 🧪
- **Despliegue sin dependencias** usando `pnpm` 📦

## 🛠️ Requisitos Previos

- [Cuenta de AWS](https://aws.amazon.com/free) (Free Tier válido)
- [Node.js 18+](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- AWS CLI configurado con credenciales válidas

## ⚡ Inicio Rápido

```bash
# Clonar y configurar
git clone https://github.com/renato1010/streaming-lambda-pulumi
cd streaming-lambda-pulumi
pnpm install

# Desplegar infraestructura
pulumi up -y

# Ejecutar pruebas unitarias
pnpm vitest -t utils

# Ejecutar pruebas de integración
pnpm test -t streaming
```

## 🔍 Arquitectura de Pruebas

### 1. Pruebas Unitarias (`/tests/utils.test.ts`)

```typescript
// Ejemplo de caso Vitest
const base64String = 'eyJxdWVzdGlvbiI6IldoYXQncyBHZW5lcmF0aXZlIEFJLCBpbiAyMDAgY2hhcnMgb3IgbGVzcyJ9';
const expectedJsonString = `{"question":"What's Generative AI, in 200 chars or less"}`;

it('decodifica base64 correctamente', () => {
  const jsonString = decodeBase64String(base64String, true);
  expect(jsonString).toEqual(expectedJsonString);
});

it('valida el payload contra el esquema', () => {
  const bodyString = expectedJsonString;
  const validatedBody = queryBodySchemaValidator(bodyString, queryHandlerSchema);
  expect(validatedBody).toStrictEqual(JSON.parse(expectedJsonString));
});
```

### 2. Pruebas de Infraestructura (`/tests/streaming-function.test.ts`)

```typescript
// Prueba de integración con Pulumi Automation API
it('debe tener URL de streaming', async () => {
  const outputs = await getOutputs();
  const streamingUrl: string = outputs['streamingURL'].value;
  expect(streamingUrl).toBeDefined();
});

it('devuelve un stream de respuesta', { timeout: 60000 }, async () => {
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

## 🎬 Demo en Vivo: Streaming con HTTPie

```bash
http --stream POST $(pulumi stack output streamingURL )  \
  question="What's Generative AI, in 200 chars or less"
```

## 🧩 Stack Tecnológico

| Componente                   | Función                            |
| ---------------------------- | ---------------------------------- |
| 🐑 **Pulumi**                | Orquestación de IaC                |
| ⚡ **AWS Lambda Streaming**  | Entrega de respuestas en chunk     |
| 🔗 **LangChain LCEL(TS)**    | Lenguaje de Expresión de Langchain |
| 🤖 **AWS Bedrock**           | Modelo DeepSeek R1                 |
| 🧪 **Vitest**                | Pruebas unitarias/de componentes   |
| 🤖 **Pulumi Automation API** | Validación de infraestructura      |

## 🔗 Recursos

- [Anuncio de AWS Lambda Streaming](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/)
- [Guía Pulumi para Streaming](https://www.pulumi.com/blog/aws-lambda-response-streaming/)
- [Documentación de LangChain JS](https://js.langchain.com/docs/how_to/sequence/)

---

**¿Te resultó útil?** ⭐ Dale una estrella al repositorio  
_Licencia: [MIT](LICENSE)_ 📜
