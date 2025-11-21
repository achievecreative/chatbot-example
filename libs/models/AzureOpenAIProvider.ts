import { LanguageModel } from "ai"
import { IModelProvider } from "./index"
import { createAzure } from "@ai-sdk/azure"

export class AzureOpenAIProvider implements IModelProvider {
  getModel(): LanguageModel {
    const azure = createAzure({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION!,
      resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME!,
    })
    return azure.chat(process.env.AZURE_OPENAI_MODEL!)
  }
}
