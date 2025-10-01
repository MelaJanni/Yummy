import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../shared/api/admin';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const stats = data?.data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recetas Totales</p>
              <p className="text-3xl font-bold">{stats?.recipes?.total || 0}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.recipes?.pending || 0}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-3xl font-bold text-green-600">{stats?.recipes?.approved || 0}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-3xl font-bold text-red-600">{stats?.recipes?.rejected || 0}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Resumen de Usuarios</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Total de Usuarios</dt>
            <dd className="text-2xl font-bold">{stats?.users?.total || 0}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Administradores</dt>
            <dd className="text-2xl font-bold">{stats?.users?.admins || 0}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
