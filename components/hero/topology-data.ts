import * as THREE from "three";

export interface TopologyNode {
  id: string;
  label: string;
  position: [number, number, number];
  /** Larger radius reads as a more "central" system in the graph. */
  radius: number;
  color: string;
}

export interface TopologyEdge {
  from: string;
  to: string;
}

/**
 * A small, deliberately schema-shaped graph: a client talks to an API layer,
 * which is the single point of contact for auth and the database, which in
 * turn relates out to the domain tables a full-stack + database-systems
 * portfolio would actually model. This is content, not decoration — every
 * node/edge name is a real piece of the mental model of a database-backed
 * web app.
 */
export const TOPOLOGY_NODES: TopologyNode[] = [
  { id: "client", label: "Client", position: [-2.6, 0.6, 0.4], radius: 0.16, color: "#7A8B99" },
  { id: "api", label: "API Layer", position: [-0.9, 0.9, -0.3], radius: 0.2, color: "#8A9A82" },
  { id: "auth", label: "Auth", position: [-0.6, -0.9, 0.6], radius: 0.15, color: "#B08968" },
  { id: "database", label: "Database", position: [0.9, 0, 0], radius: 0.26, color: "#5F6B58" },
  { id: "users", label: "Users", position: [2.4, 1.0, -0.5], radius: 0.16, color: "#8A9A82" },
  { id: "projects", label: "Projects", position: [2.2, -0.4, 0.7], radius: 0.16, color: "#C97B63" },
  { id: "schema", label: "Schema", position: [0.9, 1.6, 0.8], radius: 0.13, color: "#7A8B99" },
];

export const TOPOLOGY_EDGES: TopologyEdge[] = [
  { from: "client", to: "api" },
  { from: "api", to: "auth" },
  { from: "api", to: "database" },
  { from: "auth", to: "database" },
  { from: "database", to: "users" },
  { from: "database", to: "projects" },
  { from: "database", to: "schema" },
];

export function findNode(id: string): TopologyNode {
  const node = TOPOLOGY_NODES.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown topology node id: ${id}`);
  return node;
}

export function nodeVector(node: TopologyNode): THREE.Vector3 {
  return new THREE.Vector3(...node.position);
}
