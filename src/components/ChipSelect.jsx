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
            className={`flex items-center h-9 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
              isSelected
                ? 'bg-primary-100 text-primary-700 border-primary-300'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 mr-1.5" strokeWidth={3} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
