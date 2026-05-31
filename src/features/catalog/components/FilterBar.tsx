interface FilterBarProps {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function FilterBar({ categories, selected, onSelect }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar por categoría">
      {categories.map((category) => {
        const isActive = category === selected;
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-white shadow-sm'
                : 'border border-border bg-surface text-muted hover:border-accent/30 hover:text-primary dark:border-white/10 dark:bg-primary dark:text-muted dark:hover:border-accent/30 dark:hover:text-white'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
