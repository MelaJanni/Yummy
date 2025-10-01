import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '../../../shared/api/recipes';
import { favoritesApi } from '../../../shared/api/favorites';
import { ratingsApi } from '../../../shared/api/ratings';
import { commentsApi } from '../../../shared/api/comments';
import { useAuthStore } from '../../../shared/stores/authStore';
import { Clock, Users, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // ID del comentario al que se responde
  const [userRating, setUserRating] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['recipe', slug],
    queryFn: () => recipesApi.getBySlug(slug),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => favoritesApi.toggle(data.data.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', slug]);
      toast.success('Favorito actualizado');
    },
  });

  const submitRatingMutation = useMutation({
    mutationFn: (score) => ratingsApi.create(data.data.id, { score }),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', slug]);
      toast.success('Calificación enviada');
      setUserRating(0);
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: (commentData) => commentsApi.create(data.data.id, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', slug]);
      queryClient.invalidateQueries(['comments', data.data.id]);
      toast.success(replyingTo ? 'Respuesta publicada' : 'Comentario agregado');
      setCommentText('');
      setGuestName('');
      setGuestEmail('');
      setReplyingTo(null);
    },
  });

  const { data: commentsData } = useQuery({
    queryKey: ['comments', data?.data?.id],
    queryFn: () => commentsApi.getByRecipe(data.data.id),
    enabled: !!data?.data?.id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const recipe = data?.data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {recipe.imageUrl && (
          <div className="h-96 bg-gray-200">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
              <p className="text-gray-600">Por {recipe.author?.name}</p>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => toggleFavoriteMutation.mutate()}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Heart
                  className={`w-6 h-6 ${
                    recipe.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-6 mb-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{recipe.minutes} minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{recipe.servings} porciones</span>
            </div>
            {recipe.averageRating && (
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>{recipe.averageRating} ({recipe.ratingCount} calificaciones)</span>
              </div>
            )}
          </div>

          {recipe.description && (
            <p className="text-gray-700 mb-6">{recipe.description}</p>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
            <ul className="space-y-2">
              {recipe.recipeIngredients?.map((ri) => (
                <li key={ri.id} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <span>
                    {ri.quantity} {ri.unit} de {ri.ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Preparación</h2>
            <ol className="space-y-4">
              {recipe.steps?.map((step) => (
                <li key={step.id} className="flex">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {step.order}
                  </span>
                  <p className="text-gray-700 pt-1">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {isAuthenticated && !recipe.userRating && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Calificá esta receta</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    onDoubleClick={() => submitRatingMutation.mutate(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= userRating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <button
                  onClick={() => submitRatingMutation.mutate(userRating)}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Enviar calificación
                </button>
              )}
            </div>
          )}

          {/* Comentarios */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Comentarios</h2>

            {/* Formulario de comentarios */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">
                {replyingTo ? 'Responder comentario' : 'Dejar un comentario'}
              </h3>

              {replyingTo && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Respondiendo a comentario</span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
              )}

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                rows="4"
                placeholder="Compartí tu experiencia con esta receta..."
              />
              <button
                onClick={() => {
                  const commentData = isAuthenticated
                    ? { body: commentText, parentId: replyingTo }
                    : { body: commentText, guestName, guestEmail, parentId: replyingTo };
                  submitCommentMutation.mutate(commentData);
                }}
                disabled={
                  !commentText.trim() ||
                  (!isAuthenticated && (!guestName.trim() || !guestEmail.trim())) ||
                  submitCommentMutation.isPending
                }
                className="mt-3 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitCommentMutation.isPending ? 'Enviando...' : (replyingTo ? 'Publicar respuesta' : 'Publicar comentario')}
              </button>
            </div>

            {/* Lista de comentarios */}
            <div className="space-y-4">
              {commentsData?.data?.items?.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              )}

              {commentsData?.data?.items?.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.user?.name || comment.guestName}
                        {!comment.userId && (
                          <span className="ml-2 text-xs text-gray-500 font-normal">(Invitado)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.body}</p>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Responder
                  </button>

                  {/* Respuestas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded">
                          <p className="font-semibold text-sm text-gray-900">
                            {reply.user?.name || reply.guestName}
                            {!reply.userId && (
                              <span className="ml-2 text-xs text-gray-500 font-normal">(Invitado)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(reply.createdAt).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-700">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
