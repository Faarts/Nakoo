import React from 'react';
import { Check } from 'lucide-react';

export function ChipSelect({ options = [], selectedValues = [], onChange }) {
  const toggleSelection = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleSelection(option.value)}
            className={`flex items-center h-9 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ease-out active:scale-95 cursor-pointer ${
              isSelected
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs scale-[1.02]'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-orange-200 hover:bg-orange-50/50'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 mr-1.5 stroke-[3] animate-check-pop" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
