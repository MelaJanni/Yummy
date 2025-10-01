import { Link } from 'react-router-dom';
import { Clock, Users, Star, Heart } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  const difficultyColors = {
    easy: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    hard: 'text-red-600 bg-red-50',
  };

  const difficultyLabels = {
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil',
  };

  return (
    <Link to={`/recipes/${recipe.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        <div className="relative h-48 min-h-[12rem] max-h-[12rem] bg-gray-200">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5">
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 min-h-[3.5rem]">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">{recipe.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.minutes} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} porciones</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                difficultyColors[recipe.difficulty]
              }`}
            >
              {difficultyLabels[recipe.difficulty]}
            </span>

            {recipe.averageRating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{recipe.averageRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
