'use client';

import { Sword, Shield, Backpack, Map } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export default function ActionPanel({ onAction, disabled }: ActionPanelProps) {
  const actions = [
    { id: 'explore', label: 'Explore', icon: Map, color: 'bg-blue-600' },
    { id: 'attack', label: 'Attack', icon: Sword, color: 'bg-red-600' },
    { id: 'defend', label: 'Defend', icon: Shield, color: 'bg-green-600' },
    { id: 'inventory', label: 'Bag', icon: Backpack, color: 'bg-yellow-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-4 bg-rpg-panel border-t border-gray-700">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          disabled={disabled}
          className={`${action.color} p-4 rounded-lg flex flex-col items-center justify-center active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <action.icon className="w-6 h-6 mb-1 text-white" />
          <span className="text-white font-bold text-sm">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
