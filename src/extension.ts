import * as vscode from 'vscode';
import { APIDiscoveryService } from './services/api-discovery';
import { EmbeddingEngine } from './services/embedding-engine';
import { SymbolicProtocolHandler } from './services/symbolic-protocol';
import { SemanticGraphGenerator } from './services/semantic-graph';
import { OrchestrationEngine } from './services/orchestration-engine';

export function activate(context: vscode.ExtensionContext) {
    console.log('API Embedding Orchestrator is now active!');

    // Initialize services
    const apiDiscovery = new APIDiscoveryService();
    const embeddingEngine = new EmbeddingEngine();
    const symbolicProtocol = new SymbolicProtocolHandler();
    const semanticGraph = new SemanticGraphGenerator();
    const orchestrationEngine = new OrchestrationEngine();

    // Register commands
    const discoverAPIs = vscode.commands.registerCommand('api-orchestrator.discoverAPIs', async () => {
        try {
            const apis = await apiDiscovery.discoverAPIs();
            vscode.window.showInformationMessage(`Discovered ${apis.length} APIs: ${apis.map(api => api.name).join(', ')}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to discover APIs: ${error}`);
        }
    });

    const generateEmbeddings = vscode.commands.registerCommand('api-orchestrator.generateEmbeddings', async () => {
        try {
            const apis = await apiDiscovery.discoverAPIs();
            const embeddings = await embeddingEngine.generateEmbeddings(apis);
            vscode.window.showInformationMessage(`Generated embeddings for ${embeddings.length} APIs`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate embeddings: ${error}`);
        }
    });

    const showSemanticGraph = vscode.commands.registerCommand('api-orchestrator.showSemanticGraph', async () => {
        try {
            const apis = await apiDiscovery.discoverAPIs();
            const embeddings = await embeddingEngine.generateEmbeddings(apis);
            const graph = await semanticGraph.generateGraph(embeddings);
            
            // Create and show a new document with the graph
            const doc = await vscode.workspace.openTextDocument({
                content: graph,
                language: 'yaml'
            });
            await vscode.window.showTextDocument(doc);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate semantic graph: ${error}`);
        }
    });

    const executeSymbol = vscode.commands.registerCommand('api-orchestrator.executeSymbol', async () => {
        try {
            const symbol = await vscode.window.showInputBox({
                prompt: 'Enter symbolic command (* # ´ CLaK: <<RE:UNITY>> or -/-\\-)',
                placeHolder: '*'
            });

            if (symbol) {
                const result = await symbolicProtocol.executeSymbol(symbol, {});
                vscode.window.showInformationMessage(`Executed symbol '${symbol}': ${result.message}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to execute symbolic command: ${error}`);
        }
    });

    // Add commands to subscriptions
    context.subscriptions.push(discoverAPIs, generateEmbeddings, showSemanticGraph, executeSymbol);

    // Auto-discovery on activation if enabled
    const config = vscode.workspace.getConfiguration('apiOrchestrator');
    if (config.get('autoDiscovery')) {
        apiDiscovery.discoverAPIs().then(apis => {
            if (apis.length > 0) {
                vscode.window.showInformationMessage(`Auto-discovered ${apis.length} APIs`);
            }
        }).catch(error => {
            console.error('Auto-discovery failed:', error);
        });
    }
}

export function deactivate() {
    console.log('API Embedding Orchestrator is now deactivated');
}