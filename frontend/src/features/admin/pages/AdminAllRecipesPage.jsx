import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../shared/api/admin';
import { BookOpen, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminAllRecipesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-recipes', statusFilter],
    queryFn: () => adminApi.getAllRecipes({ status: statusFilter }),
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: (recipeId) => adminApi.deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-recipes']);
      toast.success('Receta eliminada correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar la receta');
    },
  });

  const handleDeleteRecipe = (recipeId, title) => {
    if (window.confirm(`¿Estás seguro de eliminar la receta "${title}"? Esta acción no se puede deshacer.`)) {
      deleteRecipeMutation.mutate(recipeId);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Todas las Recetas</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const recipes = data?.data?.items || [];

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Borrador', class: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprobada', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rechazada', class: 'bg-red-100 text-red-800' },
    };
    const config = statusMap[status] || statusMap.draft;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="py-8">
      <div className="px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Todas las Recetas</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Todas</option>
            <option value="draft">Borradores</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      <div className="mx-4 bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200" style={{minWidth: '1000px'}}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {recipe.imageUrl && (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                      <div className="text-sm text-gray-500">{recipe.prepTime} min</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{recipe.author?.name || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{recipe.author?.email || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(recipe.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(recipe.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/recipes/${recipe.slug}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver receta"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/recipes/${recipe.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                      title="Editar receta"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                      disabled={deleteRecipeMutation.isPending}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="Eliminar receta"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No hay recetas con este filtro</p>
          </div>
        )}
      </div>
    </div>
  );
}
