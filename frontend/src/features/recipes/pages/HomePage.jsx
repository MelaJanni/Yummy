import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recipesApi } from '../../../shared/api/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';
import RecipeSkeleton from '../../../shared/components/RecipeSkeleton';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    query: '',
    cuisine: '',
    difficulty: '',
    maxMinutes: '',
    sort: 'recent',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipesApi.getAll(filters),
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.lastPage || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Descubrí Recetas</h1>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar recetas..."
              value={filters.query}
              onChange={(e) => handleFilterChange({ query: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <RecipeFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <RecipeSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar las recetas</p>
        </div>
      )}

      {data && data.data.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron recetas</p>
        </div>
      )}

      {data && data.data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.items.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show first page, last page, current page and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          page === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
