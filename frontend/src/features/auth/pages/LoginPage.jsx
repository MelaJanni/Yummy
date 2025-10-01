import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api/auth';
import { useAuthStore } from '../../../shared/stores/authStore';
import toast from 'react-hot-toast';
import { ChefHat } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      toast.success('Sesión iniciada correctamente');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Error al iniciar sesión');
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <ChefHat className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
            Registrate acá
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-4">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿No tenés cuenta? </span>
          <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
            Registrate acá
          </Link>
        </div>
      </form>
    </div>
  );
}
