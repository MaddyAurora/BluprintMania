import type { Edge, Viewport } from '@xyflow/react';
import type { BlueprintNode } from '../types';

export const exportBlueprintToJSON = (
  nodes: BlueprintNode[],
  edges: Edge[],
  viewport?: Viewport
) => {
  const exportData = {
    nodes,
    edges,
    viewport,
    version: '1.0',
    exportDate: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `blueprint_${Date.now()}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
