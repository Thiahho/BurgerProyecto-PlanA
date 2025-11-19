import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 mt-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${
      isActive ? "bg-gray-700" : ""
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-secondary">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold uppercase">Panel Administrador</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-secondary">
            <NavLink to="/admin" end className={navLinkClasses}>
              Panel
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClasses}>
              Productos
            </NavLink>
            <NavLink to="/admin/categories" className={navLinkClasses}>
              Categorias
            </NavLink>
            <NavLink to="/admin/settings" className={navLinkClasses}>
              Configuración de la tienda
            </NavLink>
            <NavLink
              to="/"
              className={navLinkClasses}
            >
              Volver a la tienda
            </NavLink>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Cerrar Sesion
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        ></div>

        {/* Menu */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-64 bg-secondary transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
            <span className="text-white font-bold uppercase text-sm">Panel Admin</span>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-secondary">
              <NavLink to="/admin" end className={navLinkClasses} onClick={closeMobileMenu}>
                Panel
              </NavLink>
              <NavLink to="/admin/products" className={navLinkClasses} onClick={closeMobileMenu}>
                Productos
              </NavLink>
              <NavLink to="/admin/categories" className={navLinkClasses} onClick={closeMobileMenu}>
                Categorias
              </NavLink>
              <NavLink to="/admin/settings" className={navLinkClasses} onClick={closeMobileMenu}>
                Configuración de la tienda
              </NavLink>
              <NavLink
                to="/"
                className={navLinkClasses}
                onClick={closeMobileMenu}
              >
                Volver a la tienda
              </NavLink>
            </nav>
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile con botón hamburguesa */}
        <div className="md:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-gray-800 font-bold">Panel Admin</span>
          <div className="w-6"></div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
