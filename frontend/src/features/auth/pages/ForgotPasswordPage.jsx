import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authApi } from '../../../shared/api/auth';
import toast from 'react-hot-toast';
import { ChefHat } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Si el email existe, recibirás un link de recuperación');
    },
    onError: () => {
      toast.error('Error al procesar la solicitud');
    },
  });

  const onSubmit = (data) => {
    forgotMutation.mutate(data.email);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <ChefHat className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Recuperar Contraseña</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ingresá tu email y te enviaremos un link para recuperar tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {forgotMutation.isPending ? 'Enviando...' : 'Enviar Link'}
        </button>

        <div className="text-center">
          <Link to="/login" className="text-sm text-orange-600 hover:text-orange-500">
            Volver al login
          </Link>
        </div>
      </form>
    </div>
  );
}
