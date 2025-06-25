import * as vscode from 'vscode';
import { APIConfig, APIOrchestrationFlow, OrchestrationStep } from '../types/api-types';
import { APIDiscoveryService } from './api-discovery';
import { EmbeddingEngine } from './embedding-engine';

export class OrchestrationEngine {
    private apiDiscovery: APIDiscoveryService;
    private embeddingEngine: EmbeddingEngine;
    private activeFlows: Map<string, APIOrchestrationFlow> = new Map();

    constructor() {
        this.apiDiscovery = new APIDiscoveryService();
        this.embeddingEngine = new EmbeddingEngine();
    }

    async createOrchestrationFlow(name: string, apis: APIConfig[]): Promise<APIOrchestrationFlow> {
        const flow: APIOrchestrationFlow = {
            id: `flow-${Date.now()}`,
            name,
            steps: [],
            apis: apis.map(api => api.id),
            status: 'pending'
        };

        this.activeFlows.set(flow.id, flow);
        return flow;
    }

    async addOrchestrationStep(flowId: string, step: Omit<OrchestrationStep, 'id'>): Promise<void> {
        const flow = this.activeFlows.get(flowId);
        if (!flow) {
            throw new Error(`Flow ${flowId} not found`);
        }

        const newStep: OrchestrationStep = {
            id: `step-${Date.now()}`,
            ...step
        };

        flow.steps.push(newStep);
        flow.steps.sort((a, b) => a.order - b.order);
    }

    async executeFlow(flowId: string): Promise<void> {
        const flow = this.activeFlows.get(flowId);
        if (!flow) {
            throw new Error(`Flow ${flowId} not found`);
        }

        flow.status = 'running';
        
        try {
            vscode.window.showInformationMessage(`🚀 Executing orchestration flow: ${flow.name}`);

            for (const step of flow.steps) {
                await this.executeStep(step);
                vscode.window.showInformationMessage(`✅ Completed step: ${step.action}`);
            }

            flow.status = 'completed';
            vscode.window.showInformationMessage(`🎉 Flow ${flow.name} completed successfully`);
        } catch (error) {
            flow.status = 'failed';
            vscode.window.showErrorMessage(`❌ Flow ${flow.name} failed: ${error}`);
            throw error;
        }
    }

    private async executeStep(step: OrchestrationStep): Promise<any> {
        // Simulate step execution
        switch (step.action) {
            case 'authenticate':
                return this.authenticateAPI(step.apiId, step.payload);
            case 'query':
                return this.queryAPI(step.apiId, step.payload);
            case 'transform':
                return this.transformData(step.payload);
            case 'forward':
                return this.forwardData(step.apiId, step.payload);
            default:
                throw new Error(`Unknown action: ${step.action}`);
        }
    }

    private async authenticateAPI(apiId: string, payload: any): Promise<any> {
        // Mock authentication
        return {
            success: true,
            message: `API ${apiId} authenticated successfully`,
            token: 'mock-auth-token'
        };
    }

    private async queryAPI(apiId: string, payload: any): Promise<any> {
        // Mock API query
        return {
            success: true,
            data: `Mock response from API ${apiId}`,
            query: payload.query || 'default query'
        };
    }

    private async transformData(payload: any): Promise<any> {
        // Mock data transformation
        return {
            success: true,
            originalData: payload.input,
            transformedData: `Transformed: ${JSON.stringify(payload.input)}`,
            transformationType: payload.type || 'default'
        };
    }

    private async forwardData(apiId: string, payload: any): Promise<any> {
        // Mock data forwarding
        return {
            success: true,
            message: `Data forwarded to API ${apiId}`,
            dataSize: JSON.stringify(payload.data || {}).length
        };
    }

    async findOptimalRoute(sourceApi: string, targetApi: string, capability: string): Promise<string[]> {
        // Find the best path between two APIs for a specific capability
        const apis = await this.apiDiscovery.discoverAPIs();
        const embeddings = await this.embeddingEngine.generateEmbeddings(apis);

        // Simple path finding - in reality, this would use graph algorithms
        const route: string[] = [sourceApi];
        
        // Find intermediate APIs that can help bridge the gap
        const intermediateAPIs = apis.filter(api => 
            api.id !== sourceApi && 
            api.id !== targetApi && 
            api.capabilities.includes(capability)
        );

        if (intermediateAPIs.length > 0) {
            // Add the most relevant intermediate API
            route.push(intermediateAPIs[0].id);
        }

        route.push(targetApi);
        return route;
    }

    async suggestOrchestration(requirement: string): Promise<APIOrchestrationFlow> {
        const apis = await this.apiDiscovery.discoverAPIs();
        
        // Create a suggested flow based on the requirement
        const flow = await this.createOrchestrationFlow(`Auto-generated: ${requirement}`, apis);

        // Add suggested steps based on common patterns
        if (requirement.toLowerCase().includes('text') || requirement.toLowerCase().includes('content')) {
            // Text processing workflow
            const aiAPIs = apis.filter(api => api.type === 'ai');
            if (aiAPIs.length > 0) {
                await this.addOrchestrationStep(flow.id, {
                    action: 'query',
                    apiId: aiAPIs[0].id,
                    payload: { query: requirement },
                    order: 1
                });
            }
        }

        if (requirement.toLowerCase().includes('save') || requirement.toLowerCase().includes('store')) {
            // Storage workflow
            const storageAPIs = apis.filter(api => 
                api.capabilities.includes('repository-management') || 
                api.type === 'version-control'
            );
            if (storageAPIs.length > 0) {
                await this.addOrchestrationStep(flow.id, {
                    action: 'forward',
                    apiId: storageAPIs[0].id,
                    payload: { data: 'processed content' },
                    order: 2
                });
            }
        }

        return flow;
    }

    getActiveFlows(): APIOrchestrationFlow[] {
        return Array.from(this.activeFlows.values());
    }

    getFlow(flowId: string): APIOrchestrationFlow | undefined {
        return this.activeFlows.get(flowId);
    }

    async deleteFlow(flowId: string): Promise<void> {
        this.activeFlows.delete(flowId);
    }
}