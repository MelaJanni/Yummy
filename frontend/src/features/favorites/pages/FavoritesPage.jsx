import { useQuery } from '@tanstack/react-query';
import { favoritesApi } from '../../../shared/api/favorites';
import RecipeCard from '../../recipes/components/RecipeCard';
import RecipeSkeleton from '../../../shared/components/RecipeSkeleton';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getMyFavorites({}),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <RecipeSkeleton key={i} />
          ))}
        </div>
      )}

      {data && data.data.items.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">No tenés ningún favorito :(</p>
          <p className="text-gray-500">Empezá a guardar tus recetas favoritas</p>
        </div>
      )}

      {data && data.data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.items.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
