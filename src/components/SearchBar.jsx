import { useState } from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar({ placeholder = 'Cari...', value, onSearch }) {
  const [internalValue, setInternalValue] = useState('')
  const query = value ?? internalValue
  const change = next => { setInternalValue(next); onSearch?.(next) }
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-4 size-4 text-neutral-400 pointer-events-none" />
      <input type="search" aria-label={placeholder} value={query} onChange={e => change(e.target.value)} placeholder={placeholder} className="search-input w-full h-12 rounded-2xl bg-white border border-neutral-200/70 pl-11 pr-11 text-base placeholder:text-sm placeholder:text-neutral-400 outline-none focus:border-nakoo-green-400 focus:ring-2 focus:ring-nakoo-green-100" />
      {query && <button type="button" onClick={() => change('')} aria-label="Hapus pencarian" className="absolute right-0 top-0 size-12 flex items-center justify-center text-neutral-500"><X className="size-4" /></button>}
    </div>
  )
}
