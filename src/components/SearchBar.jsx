import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ placeholder = "Cari...", onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 bg-neutral-100 rounded-xl pl-11 pr-11 text-base placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 border border-transparent transition-all duration-150"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-full text-neutral-400 hover:bg-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
