import * as vscode from 'vscode';
import { APIConfig, APIEmbedding, SemanticSimilarity } from '../types/api-types';

export class EmbeddingEngine {
    private embeddings: Map<string, APIEmbedding> = new Map();

    async generateEmbeddings(apis: APIConfig[]): Promise<APIEmbedding[]> {
        const config = vscode.workspace.getConfiguration('apiOrchestrator');
        const provider = config.get<string>('embeddingProvider') || 'local';

        const embeddings: APIEmbedding[] = [];

        for (const api of apis) {
            try {
                let embedding: number[];
                
                switch (provider) {
                    case 'openai':
                        embedding = await this.generateOpenAIEmbedding(api);
                        break;
                    case 'huggingface':
                        embedding = await this.generateHuggingFaceEmbedding(api);
                        break;
                    default:
                        embedding = await this.generateLocalEmbedding(api);
                }

                const apiEmbedding: APIEmbedding = {
                    apiId: api.id,
                    embedding,
                    metadata: {
                        name: api.name,
                        type: api.type,
                        capabilities: api.capabilities,
                        description: api.description
                    }
                };

                embeddings.push(apiEmbedding);
                this.embeddings.set(api.id, apiEmbedding);
            } catch (error) {
                console.error(`Failed to generate embedding for ${api.name}:`, error);
            }
        }

        return embeddings;
    }

    private async generateOpenAIEmbedding(api: APIConfig): Promise<number[]> {
        // Create a text representation of the API for embedding
        const text = this.createAPIText(api);
        
        // For demonstration, return a mock embedding
        // In a real implementation, this would call OpenAI's embedding API
        return this.generateMockEmbedding(text);
    }

    private async generateHuggingFaceEmbedding(api: APIConfig): Promise<number[]> {
        const text = this.createAPIText(api);
        // Mock implementation - would call Hugging Face API
        return this.generateMockEmbedding(text);
    }

    private async generateLocalEmbedding(api: APIConfig): Promise<number[]> {
        const text = this.createAPIText(api);
        return this.generateMockEmbedding(text);
    }

    private createAPIText(api: APIConfig): string {
        return `${api.name} ${api.type} ${api.description} ${api.capabilities.join(' ')}`;
    }

    private generateMockEmbedding(text: string): number[] {
        // Simple hash-based mock embedding for demonstration
        // In reality, this would use actual embedding models
        const embedding = new Array(384).fill(0);
        
        for (let i = 0; i < text.length && i < embedding.length; i++) {
            embedding[i % embedding.length] += text.charCodeAt(i) / 1000;
        }

        // Normalize the vector
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return embedding.map(val => val / (magnitude || 1));
    }

    calculateSimilarity(embedding1: number[], embedding2: number[]): number {
        if (embedding1.length !== embedding2.length) {
            throw new Error('Embeddings must have the same dimension');
        }

        // Calculate cosine similarity
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (let i = 0; i < embedding1.length; i++) {
            dotProduct += embedding1[i] * embedding2[i];
            magnitude1 += embedding1[i] * embedding1[i];
            magnitude2 += embedding2[i] * embedding2[i];
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }

        return dotProduct / (magnitude1 * magnitude2);
    }

    findSimilarAPIs(targetApiId: string, threshold: number = 0.7): SemanticSimilarity[] {
        const targetEmbedding = this.embeddings.get(targetApiId);
        if (!targetEmbedding) {
            return [];
        }

        const similarities: SemanticSimilarity[] = [];

        for (const [apiId, embedding] of this.embeddings) {
            if (apiId === targetApiId) continue;

            const similarity = this.calculateSimilarity(targetEmbedding.embedding, embedding.embedding);
            
            if (similarity >= threshold) {
                const sharedCapabilities = targetEmbedding.metadata.capabilities.filter(
                    cap => embedding.metadata.capabilities.includes(cap)
                );

                similarities.push({
                    api1: targetApiId,
                    api2: apiId,
                    similarity,
                    sharedCapabilities
                });
            }
        }

        return similarities.sort((a, b) => b.similarity - a.similarity);
    }

    getAllEmbeddings(): Map<string, APIEmbedding> {
        return this.embeddings;
    }
}