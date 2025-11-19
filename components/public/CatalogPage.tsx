import React, { useState } from "react";
import { useCatalog } from "../../hooks/useCatalog";
import Header from "./Header";
import Footer from "./Footer";
import ProductsCard from "./ProductCard";

const CatalogPage: React.FC = () => {
  const { products, categories, isLoading } = useCatalog();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8">
          Menus
        </h2>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              selectedCategoryId === null
                ? "bg-primary text-white"
                : "bg-white text-primary border border-primary hover:bg-primary hover:text-white"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                selectedCategoryId === category.id
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-primary hover:bg-primary hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductsCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;
