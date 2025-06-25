import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { APIConfig } from '../types/api-types';

export class APIDiscoveryService {
    private knownAPIPatterns: { [key: string]: any } = {
        'OPENAI_API_KEY': {
            name: 'OpenAI',
            type: 'ai',
            description: 'OpenAI API for language models and embeddings',
            endpoints: ['https://api.openai.com/v1'],
            capabilities: ['text-generation', 'embeddings', 'chat']
        },
        'HUGGINGFACE_API_KEY': {
            name: 'Hugging Face',
            type: 'ai',
            description: 'Hugging Face API for machine learning models',
            endpoints: ['https://api-inference.huggingface.co'],
            capabilities: ['text-generation', 'embeddings', 'classification']
        },
        'GITHUB_TOKEN': {
            name: 'GitHub',
            type: 'version-control',
            description: 'GitHub API for repository management',
            endpoints: ['https://api.github.com'],
            capabilities: ['repository-management', 'user-management', 'webhook']
        },
        'GITLAB_TOKEN': {
            name: 'GitLab',
            type: 'version-control',
            description: 'GitLab API for repository management',
            endpoints: ['https://gitlab.com/api/v4'],
            capabilities: ['repository-management', 'ci-cd', 'user-management']
        },
        'COHERE_API_KEY': {
            name: 'Cohere',
            type: 'ai',
            description: 'Cohere API for natural language processing',
            endpoints: ['https://api.cohere.ai/v1'],
            capabilities: ['text-generation', 'embeddings', 'classification']
        },
        'ANTHROPIC_API_KEY': {
            name: 'Anthropic',
            type: 'ai',
            description: 'Anthropic API for Claude AI models',
            endpoints: ['https://api.anthropic.com/v1'],
            capabilities: ['text-generation', 'chat', 'analysis']
        }
    };

    async discoverAPIs(): Promise<APIConfig[]> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder open');
        }

        const discoveredAPIs: APIConfig[] = [];

        for (const folder of workspaceFolders) {
            const envFiles = await this.findEnvFiles(folder.uri.fsPath);
            
            for (const envFile of envFiles) {
                const apis = await this.parseEnvFile(envFile);
                discoveredAPIs.push(...apis);
            }
        }

        return discoveredAPIs;
    }

    private async findEnvFiles(folderPath: string): Promise<string[]> {
        const envFiles: string[] = [];
        const envFileNames = ['.env', '.env.local', '.env.development', '.env.production'];

        for (const fileName of envFileNames) {
            const filePath = path.join(folderPath, fileName);
            if (fs.existsSync(filePath)) {
                envFiles.push(filePath);
            }
        }

        return envFiles;
    }

    private async parseEnvFile(filePath: string): Promise<APIConfig[]> {
        const apis: APIConfig[] = [];
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, value] = trimmedLine.split('=');
                    if (key && value && this.knownAPIPatterns[key]) {
                        const pattern = this.knownAPIPatterns[key];
                        
                        apis.push({
                            id: `${pattern.name.toLowerCase()}-${Date.now()}`,
                            name: pattern.name,
                            type: pattern.type,
                            description: pattern.description,
                            endpoints: pattern.endpoints,
                            capabilities: pattern.capabilities,
                            apiKey: value.replace(/['"]/g, ''), // Remove quotes
                            envKey: key,
                            configSource: filePath
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Failed to parse env file ${filePath}:`, error);
        }

        return apis;
    }

    getAPICapabilities(apiName: string): string[] {
        const pattern = Object.values(this.knownAPIPatterns).find(p => p.name === apiName);
        return pattern?.capabilities || [];
    }

    isCompatibleAPIs(api1: APIConfig, api2: APIConfig): boolean {
        // Check if APIs have complementary capabilities
        const sharedCapabilities = api1.capabilities.filter(cap => api2.capabilities.includes(cap));
        return sharedCapabilities.length > 0;
    }
}