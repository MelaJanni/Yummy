import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { recipesApi } from '../../../shared/api/recipes';
import toast from 'react-hot-toast';
import { Plus, X, Upload } from 'lucide-react';

const recipeSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  minutes: z.number().min(1),
  servings: z.number().min(1),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.string().min(1),
    })
  ).min(1),
  steps: z.array(
    z.object({
      text: z.string().min(1),
    })
  ).min(1),
});

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      difficulty: 'easy',
      minutes: 30,
      servings: 4,
      ingredients: [{ name: '', quantity: 1, unit: '' }],
      steps: [{ text: '' }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps',
  });

  const uploadImageMutation = useMutation({
    mutationFn: recipesApi.uploadImage,
  });

  const createRecipeMutation = useMutation({
    mutationFn: recipesApi.create,
    onSuccess: (data) => {
      toast.success('Receta creada correctamente');
      navigate(`/recipes/${data.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Error al crear receta');
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    let imageUrl = null;

    if (imageFile) {
      try {
        const uploadResult = await uploadImageMutation.mutateAsync(imageFile);
        imageUrl = `${import.meta.env.VITE_BACKEND_URL}${uploadResult.data.url}`;
      } catch (error) {
        toast.error('Error al subir la imagen');
        return;
      }
    }

    const recipeData = {
      ...data,
      imageUrl,
      ingredients: data.ingredients.map((ing, index) => ({ ...ing, order: index + 1 })),
      steps: data.steps.map((step, index) => ({ ...step, order: index + 1 })),
      status: 'pending',
    };

    createRecipeMutation.mutate(recipeData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nueva Receta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              <Upload className="w-5 h-5" />
              <span>Subir imagen</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            {...register('description')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad *</label>
            <select
              {...register('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cocina</label>
            <input
              {...register('cuisine')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minutos *</label>
            <input
              {...register('minutes', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Porciones *</label>
            <input
              {...register('servings', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Ingredientes *</label>
            <button
              type="button"
              onClick={() => appendIngredient({ name: '', quantity: 1, unit: '' })}
              className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
          <div className="space-y-2">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`ingredients.${index}.name`)}
                  placeholder="Ingrediente"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="Cant"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  {...register(`ingredients.${index}.unit`)}
                  placeholder="Unidad"
                  className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Pasos *</label>
            <button
              type="button"
              onClick={() => appendStep({ text: '' })}
              className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
          <div className="space-y-2">
            {stepFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <textarea
                  {...register(`steps.${index}.text`)}
                  placeholder="Describe este paso..."
                  rows="2"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {stepFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createRecipeMutation.isPending}
            className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {createRecipeMutation.isPending ? 'Enviando...' : 'Enviar a revisión'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
