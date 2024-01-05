import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatDocumentsAsString } from "langchain/util/document";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export class Retrieval {
  private readonly chunkSize: number;
  private readonly chunkOverlap: number;
  private retriever: any;
  // private shortTermMemory: BufferMemory;

  private embeddingModel = null;
  private textSplitter = null;

  constructor(embeddingModel: any, chunkSize: number) {
    this.chunkSize = chunkSize;
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
    this.embeddingModel = embeddingModel;

    // this.shortTermMemory = new BufferMemory({
    //   memoryKey: "chatHistory",
    // });
  }

  public ingestDocument = async (
    documentPath: string,
    memoryPath: string
  ): Promise<any> => {
    /* Load in the file we want to do question answering over */
    const loader = new PDFLoader(documentPath, {
      splitPages: false,
      parsedItemSeparator: "",
    });

    const doc = await loader.load();
    const docs = await this.textSplitter.splitDocuments(doc);
    const vectorStore = await HNSWLib.fromDocuments(docs, this.embeddingModel);
    await vectorStore.save(memoryPath);
  };

  public ingestConversationalHistory = async (
    conversationHistoryArray
  ): Promise<any> => {};

  public loadRetrievalAgent = async (memoryPath: string): Promise<any> => {
    const vectorStore = await HNSWLib.load(memoryPath, this.embeddingModel);
    this.retriever = vectorStore.asRetriever(2);
  };

  public generateAnswer = async (query: string): Promise<string> => {
    // Fetch relevant docs and serialize to a string.
    const relevantDocs = await this.retriever.getRelevantDocuments(query);
    const serializedDoc = formatDocumentsAsString(relevantDocs);
    return serializedDoc;
  };

  public generateFollowUpQuestion = async (): Promise<any> => {
    return;
  };
}
