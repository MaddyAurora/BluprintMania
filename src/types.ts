import type { Node } from '@xyflow/react';

export type BlueprintNodeData = {
  label: string;
  color: string;
  notes: string;
};

export type BlueprintNode = Node<BlueprintNodeData, 'custom'>;
