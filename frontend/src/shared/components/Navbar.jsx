import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ChefHat, Heart, User, LogOut, PlusCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">Yummy</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/recipes/new"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nueva Receta</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </Link>
                <Link
                  to="/my-recipes"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Mis Recetas
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-800"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu offcanvas */}
        <div
          className={`${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Menú</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/recipes/new"
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nueva Receta</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </Link>
                <Link
                  to="/my-recipes"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Recetas
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
