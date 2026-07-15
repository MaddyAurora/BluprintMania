import type { Node } from '@xyflow/react';

export type BlueprintNodeData = {
  label: string;
  color: string;
  notes: string;
  image?: string; // Base64 string
  imageWidth?: number; // Intrinsic width
  imageHeight?: number; // Intrinsic height
  imagePosition?: 'before' | 'after'; // Position relative to notes
  isNew?: boolean; // Flag to indicate if the node was just created
};

export type BlueprintNode = Node<BlueprintNodeData, 'custom'>;
