import { useQuery } from '@tanstack/react-query';
import { recipesApi } from '../../../shared/api/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeSkeleton from '../../../shared/components/RecipeSkeleton';
import { ChefHat } from 'lucide-react';

export default function MyRecipesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-recipes'],
    queryFn: () => recipesApi.getMyRecipes(),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Recetas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <RecipeSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const recipes = data?.data?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Recetas</h1>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">No tenés ninguna receta :(</p>
          <p className="text-gray-500">Empezá a crear tus propias recetas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
