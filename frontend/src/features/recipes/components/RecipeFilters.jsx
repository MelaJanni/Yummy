export default function RecipeFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={filters.difficulty}
        onChange={(e) => onFilterChange({ difficulty: e.target.value })}
        className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      >
        <option value="">Todas las dificultades</option>
        <option value="easy">Fácil</option>
        <option value="medium">Media</option>
        <option value="hard">Difícil</option>
      </select>

      <select
        value={filters.maxMinutes}
        onChange={(e) => onFilterChange({ maxMinutes: e.target.value })}
        className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      >
        <option value="">Cualquier tiempo</option>
        <option value="15">Hasta 15 min</option>
        <option value="30">Hasta 30 min</option>
        <option value="60">Hasta 1 hora</option>
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onFilterChange({ sort: e.target.value })}
        className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      >
        <option value="recent">Más recientes</option>
        <option value="popular">Más populares</option>
        <option value="rating">Mejor calificadas</option>
      </select>
    </div>
  );
}
