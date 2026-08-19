import React from 'react';

export function FilterBar({ filters = [], activeFilter, onFilterClick }) {
  return (
    <div className="flex overflow-x-auto gap-2 px-4 py-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterClick(filter.value)}
            className={`h-9 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-primary-500 text-neutral-900 border border-transparent'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
