import * as assert from 'assert';
import { APIDiscoveryService } from '../services/api-discovery';
import { EmbeddingEngine } from '../services/embedding-engine';
import { SymbolicProtocolHandler } from '../services/symbolic-protocol';
import { SemanticGraphGenerator } from '../services/semantic-graph';
import { OrchestrationEngine } from '../services/orchestration-engine';

describe('API Embedding Orchestrator', () => {
    
    describe('APIDiscoveryService', () => {
        it('should create API discovery service', () => {
            const service = new APIDiscoveryService();
            assert.ok(service);
        });

        it('should check API compatibility', () => {
            const service = new APIDiscoveryService();
            const api1 = {
                id: '1',
                name: 'OpenAI',
                type: 'ai',
                description: 'AI service',
                endpoints: ['https://api.openai.com'],
                capabilities: ['text-generation', 'embeddings'],
                apiKey: 'test',
                envKey: 'OPENAI_API_KEY',
                configSource: '.env'
            };
            const api2 = {
                id: '2',
                name: 'Hugging Face',
                type: 'ai',
                description: 'ML service',
                endpoints: ['https://api-inference.huggingface.co'],
                capabilities: ['text-generation', 'classification'],
                apiKey: 'test',
                envKey: 'HUGGINGFACE_API_KEY',
                configSource: '.env'
            };

            const compatible = service.isCompatibleAPIs(api1, api2);
            assert.strictEqual(compatible, true);
        });
    });

    describe('EmbeddingEngine', () => {
        it('should create embedding engine', () => {
            const engine = new EmbeddingEngine();
            assert.ok(engine);
        });

        it('should calculate similarity between embeddings', () => {
            const engine = new EmbeddingEngine();
            const embedding1 = [1, 0, 0];
            const embedding2 = [1, 0, 0];
            const similarity = engine.calculateSimilarity(embedding1, embedding2);
            assert.strictEqual(similarity, 1);
        });
    });

    describe('SymbolicProtocolHandler', () => {
        it('should create symbolic protocol handler', () => {
            const handler = new SymbolicProtocolHandler();
            assert.ok(handler);
        });

        it('should execute activation symbol', async () => {
            const handler = new SymbolicProtocolHandler();
            const result = await handler.executeSymbol('*', {});
            assert.strictEqual(result.success, true);
        });

        it('should execute super symbol', async () => {
            const handler = new SymbolicProtocolHandler();
            const result = await handler.executeSymbol('-/-\\-', {});
            assert.strictEqual(result.success, true);
            assert.ok(result.message.includes('Super symbol executed'));
        });

        it('should return all available symbols', () => {
            const handler = new SymbolicProtocolHandler();
            const symbols = handler.getAllSymbols();
            assert.ok(symbols.includes('*'));
            assert.ok(symbols.includes('#'));
            assert.ok(symbols.includes('´'));
            assert.ok(symbols.includes('CLaK:'));
            assert.ok(symbols.includes('<<RE:UNITY>>'));
            assert.ok(symbols.includes('-/-\\-'));
        });
    });

    describe('SemanticGraphGenerator', () => {
        it('should create semantic graph generator', () => {
            const generator = new SemanticGraphGenerator();
            assert.ok(generator);
        });
    });

    describe('OrchestrationEngine', () => {
        it('should create orchestration engine', () => {
            const engine = new OrchestrationEngine();
            assert.ok(engine);
        });

        it('should create orchestration flow', async () => {
            const engine = new OrchestrationEngine();
            const flow = await engine.createOrchestrationFlow('Test Flow', []);
            assert.ok(flow.id);
            assert.strictEqual(flow.name, 'Test Flow');
            assert.strictEqual(flow.status, 'pending');
        });
    });
});