export interface APIConfig {
    id: string;
    name: string;
    type: string;
    description: string;
    endpoints: string[];
    capabilities: string[];
    apiKey: string;
    envKey: string;
    configSource: string;
}

export interface APIEmbedding {
    apiId: string;
    embedding: number[];
    metadata: {
        name: string;
        type: string;
        capabilities: string[];
        description: string;
    };
}

export interface SemanticSimilarity {
    api1: string;
    api2: string;
    similarity: number;
    sharedCapabilities: string[];
}

export interface SymbolicCommand {
    symbol: string;
    payload: any;
    timestamp: Date;
    result?: SymbolicResult;
}

export interface SymbolicResult {
    success: boolean;
    message: string;
    data?: any;
}

export interface APIOrchestrationFlow {
    id: string;
    name: string;
    steps: OrchestrationStep[];
    apis: string[];
    status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface OrchestrationStep {
    id: string;
    action: string;
    apiId: string;
    payload: any;
    order: number;
}