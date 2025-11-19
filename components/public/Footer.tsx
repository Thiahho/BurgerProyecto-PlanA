import React from "react";
import { useCatalog } from "../../hooks/useCatalog";

const Footer: React.FC = () => {
  const { businessInfo } = useCatalog();

  if (!businessInfo) {
    return null; // O un esqueleto de carga
  }

  const { hours, contact, name } = businessInfo;

  // Función para generar el enlace de WhatsApp
  const getWhatsAppLink = (phone: string) => {
    // Limpiar el número: remover espacios, guiones, paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    const message = encodeURIComponent(
      "Hola, vengo desde la web. Quisiera hacer un pedido"
    );
    return `https://wa.me/54${cleanPhone}?text=${message}`;
  };

  return (
    <footer className="bg-secondary text-white mt-12 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-2 text-primary">{name}</h3>
          <p className="text-gray-300">{contact.address}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-primary">Horarios</h3>
          <ul className="text-gray-300">
            {hours && hours.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-primary">Contactanos</h3>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            1:{" "}
            <a
              href={getWhatsAppLink(contact.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            ></a>
          </div>
          <div className="flex justify-center md:justify-start space-x-4 mt-2">
            <a
              href={contact.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <a
              href={contact.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} {name}. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
