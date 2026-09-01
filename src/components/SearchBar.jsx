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

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative flex items-center w-full rounded-2xl transition-all duration-300 ${
      isFocused ? 'ring-3 ring-primary-300/60 shadow-sm' : ''
    }`}>
      <Search className={`absolute left-4 w-5 h-5 transition-all duration-200 ${
        isFocused ? 'text-primary-500 scale-110' : 'text-neutral-400 scale-100'
      }`} />
      <input
        type="text"
        value={query}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 bg-neutral-100/90 focus:bg-white rounded-2xl pl-11 pr-11 text-sm font-medium placeholder:text-neutral-400 outline-none border border-neutral-200/60 focus:border-primary-400 transition-all duration-200"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 w-6 h-6 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center animate-scale-in active:scale-90 transition-all cursor-pointer"
          title="Hapus pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
