'use client';

import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

export default function RepoViewer({ data }) {
  const [expandedPaths, setExpandedPaths] = useState(new Set());

  const toggleExpand = (path) => {
    const newExpanded = new Set(expandedPaths);
    if (expandedPaths.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderItem = (item, depth = 0) => {
    const isExpanded = expandedPaths.has(item.path);
    const hasChildren = item.type === 'dir' && item.children?.length > 0;

    return (
      <div key={item.path} className="font-mono">
        <div
          className="flex items-center hover:bg-gray-100 cursor-pointer p-1"
          style={{ paddingLeft: `${depth * 20}px` }}
          onClick={() => hasChildren && toggleExpand(item.path)}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <span className="w-4" />
          )}
          {item.type === 'dir' ? (
            <Folder size={16} className="mr-2 text-blue-500" />
          ) : (
            <File size={16} className="mr-2 text-gray-500" />
          )}
          <span>{item.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {item.children?.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-lg font-semibold mb-4">Repository Structure</div>
      {data.map((item) => renderItem(item))}
    </div>
  );
}