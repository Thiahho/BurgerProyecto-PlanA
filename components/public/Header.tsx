import React from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../hooks/useCatalog";
import { useAuth } from "../../hooks/useAuth";
import { getFullApiUrl } from "../../services/api/apiClient";

const Header: React.FC = () => {
  const { businessInfo } = useCatalog();
  const { isAuthenticated } = useAuth();

  // Botón de Login/Admin que se muestra siempre
  const loginButton = (
    <Link
      to={isAuthenticated ? "/admin" : "/login"}
      className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
      title={isAuthenticated ? "Panel Admin" : "Iniciar Sesión"}
    >
      {isAuthenticated ? (
        // Ícono de configuración/admin cuando está logueado
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ) : (
        // Ícono de usuario cuando no está logueado
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )}
    </Link>
  );

  // Mientras carga la información, mostrar esqueleto pero con el botón de login
  if (!businessInfo) {
    return (
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 animate-pulse">
        {loginButton}
      </div>
    );
  }

  const { banner } = businessInfo;

  return (
    <header className="relative w-full h-64 md:h-80 lg:h-96">
      {banner.imageUrl ? (
        <img
          src={getFullApiUrl(banner.imageUrl)}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Mostrar fondo gris si la imagen falla
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-300"></div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
          {banner.title}
        </h1>
        <p className="text-white text-lg md:text-xl mt-2 drop-shadow-md">
          {banner.subtitle}
        </p>
      </div>

      {loginButton}
    </header>
  );
};

export default Header;
