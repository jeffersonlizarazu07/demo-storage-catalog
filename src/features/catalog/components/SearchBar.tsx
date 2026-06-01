import { SearchIcon } from '../../../shared/components/Icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function SearchBar({ value, onChange, totalCount, filteredCount }: SearchBarProps) {
  const hasFilter = filteredCount !== totalCount;

  return (
    <div className="relative">
      {/* Search icon */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        aria-hidden="true"
      >
        <SearchIcon className="h-5 w-5 text-muted" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos por nombre, marca o descripción..."
        className="w-full rounded-xl border border-border bg-surface py-3 pr-4 pl-10 text-sm text-primary placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none dark:border-white/10 dark:bg-primary dark:text-white dark:placeholder:text-muted"
      />

      {/* Result count */}
      {hasFilter && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-xs text-muted">
            {filteredCount} de {totalCount}
          </span>
        </div>
      )}
    </div>
  );
}
