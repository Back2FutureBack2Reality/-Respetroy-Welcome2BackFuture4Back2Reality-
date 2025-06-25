import { APIEmbedding, SemanticSimilarity } from '../types/api-types';
import { EmbeddingEngine } from './embedding-engine';
import * as yaml from 'yaml';

export class SemanticGraphGenerator {
    private embeddingEngine: EmbeddingEngine;

    constructor() {
        this.embeddingEngine = new EmbeddingEngine();
    }

    async generateGraph(embeddings: APIEmbedding[]): Promise<string> {
        const graph = this.createSemanticGraph(embeddings);
        return this.formatGraphAsYAML(graph);
    }

    private createSemanticGraph(embeddings: APIEmbedding[]): SemanticGraph {
        const nodes: GraphNode[] = embeddings.map(embedding => ({
            id: embedding.apiId,
            name: embedding.metadata.name,
            type: embedding.metadata.type,
            capabilities: embedding.metadata.capabilities,
            description: embedding.metadata.description
        }));

        const edges: GraphEdge[] = [];
        const similarities: SemanticSimilarity[] = [];

        // Calculate similarities between all pairs of APIs
        for (let i = 0; i < embeddings.length; i++) {
            for (let j = i + 1; j < embeddings.length; j++) {
                const similarity = this.embeddingEngine.calculateSimilarity(
                    embeddings[i].embedding,
                    embeddings[j].embedding
                );

                if (similarity > 0.3) { // Only include meaningful similarities
                    const sharedCapabilities = embeddings[i].metadata.capabilities.filter(
                        cap => embeddings[j].metadata.capabilities.includes(cap)
                    );

                    const edge: GraphEdge = {
                        from: embeddings[i].apiId,
                        to: embeddings[j].apiId,
                        weight: similarity,
                        type: this.determineEdgeType(embeddings[i], embeddings[j]),
                        sharedCapabilities
                    };

                    edges.push(edge);

                    similarities.push({
                        api1: embeddings[i].apiId,
                        api2: embeddings[j].apiId,
                        similarity,
                        sharedCapabilities
                    });
                }
            }
        }

        return {
            metadata: {
                title: 'API Semantic Communication Graph',
                description: 'Semantic relationships between discovered APIs',
                generatedAt: new Date().toISOString(),
                totalAPIs: embeddings.length,
                totalConnections: edges.length
            },
            nodes,
            edges,
            clusters: this.identifyClusters(nodes, edges),
            recommendations: this.generateRecommendations(similarities)
        };
    }

    private determineEdgeType(api1: APIEmbedding, api2: APIEmbedding): string {
        const type1 = api1.metadata.type;
        const type2 = api2.metadata.type;

        if (type1 === type2) {
            return 'same-type';
        }

        // Check for complementary types
        const complementaryPairs = [
            ['ai', 'version-control'],
            ['ai', 'storage'],
            ['version-control', 'ci-cd']
        ];

        for (const pair of complementaryPairs) {
            if ((pair.includes(type1) && pair.includes(type2))) {
                return 'complementary';
            }
        }

        return 'cross-type';
    }

    private identifyClusters(nodes: GraphNode[], edges: GraphEdge[]): Cluster[] {
        const clusters: Cluster[] = [];
        const typeGroups = new Map<string, GraphNode[]>();

        // Group nodes by type
        nodes.forEach(node => {
            if (!typeGroups.has(node.type)) {
                typeGroups.set(node.type, []);
            }
            typeGroups.get(node.type)!.push(node);
        });

        // Create clusters for each type group
        typeGroups.forEach((groupNodes, type) => {
            if (groupNodes.length > 1) {
                clusters.push({
                    id: `cluster-${type}`,
                    name: `${type.charAt(0).toUpperCase() + type.slice(1)} APIs`,
                    type: 'type-based',
                    members: groupNodes.map(n => n.id),
                    description: `APIs of type: ${type}`
                });
            }
        });

        // Create capability-based clusters
        const capabilityGroups = new Map<string, GraphNode[]>();
        nodes.forEach(node => {
            node.capabilities.forEach(capability => {
                if (!capabilityGroups.has(capability)) {
                    capabilityGroups.set(capability, []);
                }
                capabilityGroups.get(capability)!.push(node);
            });
        });

        capabilityGroups.forEach((groupNodes, capability) => {
            if (groupNodes.length > 1) {
                clusters.push({
                    id: `cluster-capability-${capability}`,
                    name: `${capability} Providers`,
                    type: 'capability-based',
                    members: groupNodes.map(n => n.id),
                    description: `APIs providing ${capability} capability`
                });
            }
        });

        return clusters;
    }

    private generateRecommendations(similarities: SemanticSimilarity[]): Recommendation[] {
        const recommendations: Recommendation[] = [];

        // High similarity recommendations
        const highSimilarities = similarities.filter(s => s.similarity > 0.8);
        highSimilarities.forEach(sim => {
            recommendations.push({
                type: 'high-similarity',
                priority: 'high',
                title: 'Strong Semantic Match Found',
                description: `APIs ${sim.api1} and ${sim.api2} have high semantic similarity (${(sim.similarity * 100).toFixed(1)}%)`,
                suggestedAction: 'Consider creating a workflow that combines these APIs',
                affectedAPIs: [sim.api1, sim.api2]
            });
        });

        // Capability clustering recommendations
        const capabilityClusters = new Map<string, string[]>();
        similarities.forEach(sim => {
            sim.sharedCapabilities.forEach(cap => {
                if (!capabilityClusters.has(cap)) {
                    capabilityClusters.set(cap, []);
                }
                if (!capabilityClusters.get(cap)!.includes(sim.api1)) {
                    capabilityClusters.get(cap)!.push(sim.api1);
                }
                if (!capabilityClusters.get(cap)!.includes(sim.api2)) {
                    capabilityClusters.get(cap)!.push(sim.api2);
                }
            });
        });

        capabilityClusters.forEach((apis, capability) => {
            if (apis.length > 2) {
                recommendations.push({
                    type: 'capability-cluster',
                    priority: 'medium',
                    title: `Multiple ${capability} Providers`,
                    description: `${apis.length} APIs provide ${capability} capability`,
                    suggestedAction: 'Consider load balancing or failover strategies',
                    affectedAPIs: apis
                });
            }
        });

        return recommendations;
    }

    private formatGraphAsYAML(graph: SemanticGraph): string {
        return yaml.stringify(graph, {
            indent: 2,
            lineWidth: 0,
            minContentWidth: 0
        });
    }
}

interface SemanticGraph {
    metadata: {
        title: string;
        description: string;
        generatedAt: string;
        totalAPIs: number;
        totalConnections: number;
    };
    nodes: GraphNode[];
    edges: GraphEdge[];
    clusters: Cluster[];
    recommendations: Recommendation[];
}

interface GraphNode {
    id: string;
    name: string;
    type: string;
    capabilities: string[];
    description: string;
}

interface GraphEdge {
    from: string;
    to: string;
    weight: number;
    type: string;
    sharedCapabilities: string[];
}

interface Cluster {
    id: string;
    name: string;
    type: string;
    members: string[];
    description: string;
}

interface Recommendation {
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    suggestedAction: string;
    affectedAPIs: string[];
}