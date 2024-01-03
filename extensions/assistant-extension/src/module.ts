import { Retrieval } from "./tools/retrieval/node";
import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const run = async () => {
  const embeddingModel = new HuggingFaceTransformersEmbeddings();

  const retrieval = new Retrieval(embeddingModel, 1000);
  await retrieval.ingestDocument(
    "/Users/hiro/Downloads/791610_Optimizing_and_Running_LLaMA2_on_Intel_CPU_Whitepaper__Rev1.0.pdf",
    "/Users/hiro/jan/threads/testing_mem"
  );
  await retrieval.loadRetrievalAgent("/Users/hiro/jan/threads/testing_mem");
  const result = await retrieval.generateAnswer(
    "What is the best way to run LLaMA2 on Intel CPU?"
  );
  console.log(result);
};

run();