import { LanguageModel } from "ai";
import { AzureOpenAIProvider } from "./AzureOpenAIProvider";

export interface IModelProvider{
    getModel(): LanguageModel
}

const provider: IModelProvider = new AzureOpenAIProvider()

export default provider
