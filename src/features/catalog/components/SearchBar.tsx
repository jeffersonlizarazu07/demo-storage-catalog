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
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
        <svg
          className="h-5 w-5 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos por nombre, marca o descripción..."
        className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-primary dark:text-white dark:placeholder:text-muted"
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
