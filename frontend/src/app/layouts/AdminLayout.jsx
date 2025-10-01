import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Clock, Users, BookOpen, Menu, X, Home } from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button - Fixed */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-orange-500 hover:text-orange-600">
            <Home className="w-6 h-6" />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-gray-900"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static top-16 lg:top-0 bottom-0 lg:inset-y-0 left-0 z-[60] w-64 bg-white shadow-md min-h-screen transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 hidden lg:block">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6 lg:mt-0">
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-6 py-3 text-orange-600 hover:bg-orange-50 border-b border-gray-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Volver al Inicio
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/pending"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Clock className="w-5 h-5 mr-3" />
              Recetas Pendientes
            </Link>
            <Link
              to="/admin/recipes"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Todas las Recetas
            </Link>
            <Link
              to="/admin/users"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-3" />
              Usuarios
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
