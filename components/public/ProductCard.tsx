import React from "react";
import { Products } from "../../types";
import { useCatalog } from "../../hooks/useCatalog";
import { getProductsImageUrl } from "../../services/api/apiClient";

interface ProductsCardProps {
  product: Products;
}

const WhatsAppButton: React.FC<{ productName: string; productPrice: number }> = ({ productName, productPrice }) => {
  const { businessInfo } = useCatalog();

  if (!businessInfo) return null;

  const phoneNumber = +541122692061;
  //const phoneNumber = businessInfo.contact.phone;
  const message = encodeURIComponent(
    `Hola! Me gustaria ordernar una ${productName}, $${productPrice}.`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full mt-4 bg-accent hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-center"
    >
      Ordenar via WhatsApp
    </a>
  );
};

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
  const imageUrl = product.hasImage
    ? getProductsImageUrl(product.id)
    : "/placeholder.png";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          // Fallback si la imagen no carga
          (e.target as HTMLImageElement).src = "/placeholder.png";
        }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-text-main">{product.name}</h3>
        <p className="text-text-light mt-2 flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">
            ${product.price}
          </p>
        </div>
        <WhatsAppButton productName={product.name} productPrice={product.price} />
      </div>
    </div>
  );
};

export default ProductsCard;
