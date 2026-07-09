import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

/**
 * Central model registry. All agent/extraction code refers to models by ROLE,
 * never by provider/model id — swapping a provider is a one-line change here.
 *
 * Roles:
 *  - fast:      high-volume, low-cost work (extraction, classification, autofill)
 *  - reasoning: harder multi-step work (MARBIM chat, quote drafting, RFQ analysis)
 *  - embed:     text embeddings for semantic search / RAG
 */
export const models = {
  fast: google('gemini-2.5-flash'),
  reasoning: anthropic('claude-sonnet-4-5'),
} as const;

/** Embedding model is used via a different SDK entrypoint (embed/embedMany). */
export const embeddingModel = openai.embedding('text-embedding-3-small');

export type ModelRole = keyof typeof models;
