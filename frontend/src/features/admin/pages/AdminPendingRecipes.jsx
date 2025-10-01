import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../shared/api/admin';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminPendingRecipes() {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pending-recipes'],
    queryFn: () => adminApi.getPendingRecipes({}),
  });

  const approveMutation = useMutation({
    mutationFn: (recipeId) => adminApi.approveRecipe(recipeId, { requiresReview: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pending-recipes']);
      queryClient.invalidateQueries(['admin-stats']);
      toast.success('Receta aprobada');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ recipeId, reason }) => adminApi.rejectRecipe(recipeId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pending-recipes']);
      queryClient.invalidateQueries(['admin-stats']);
      toast.success('Receta rechazada');
      setRejectingId(null);
      setRejectionReason('');
    },
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const recipes = data?.data?.items || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Recetas Pendientes</h1>

      {recipes.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">No hay recetas pendientes de revisión</p>
        </div>
      )}

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-2">{recipe.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Autor: {recipe.author?.name} ({recipe.author?.email})</p>
                  <p>Dificultad: {recipe.difficulty} | Tiempo: {recipe.minutes} min | Porciones: {recipe.servings}</p>
                  <p>Cocina: {recipe.cuisine || 'No especificada'}</p>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => window.open(`/recipes/${recipe.slug}`, '_blank')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Ver receta"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => approveMutation.mutate(recipe.id)}
                  disabled={approveMutation.isPending}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  title="Aprobar"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRejectingId(recipe.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Rechazar"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {rejectingId === recipe.id && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del rechazo
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Explicá por qué rechazás esta receta..."
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => rejectMutation.mutate({ recipeId: recipe.id, reason: rejectionReason })}
                    disabled={!rejectionReason.trim() || rejectMutation.isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirmar Rechazo
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
