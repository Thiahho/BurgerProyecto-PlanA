import React, { useState } from "react";
import { useCatalog } from "../../hooks/useCatalog";
import { useToast } from "../../contexts/ToastContext";
import { Category } from "../../types";

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCatalog();
  const { showToast, showConfirm } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Partial<Category> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (category: Partial<Category> | null = null) => {
    setCurrentCategory(category || { name: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentCategory) return;
    setCurrentCategory({ ...currentCategory, name: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory || !currentCategory.name) return;
    setIsSubmitting(true);

    const success = currentCategory.id
      ? await updateCategory(currentCategory as Category)
      : await addCategory({ name: currentCategory.name });

    if (success) {
      showToast(
        currentCategory.id
          ? "Categoria actualizado correctamente!"
          : "Category agregado correctamente!",
        "success"
      );
      closeModal();
    } else {
      showToast("Error al guardar la categorias.", "error");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (categoryId: string) => {
    showConfirm("Quiere eliminar la categoria?", async () => {
      const success = await deleteCategory(categoryId);
      if (success) {
        showToast("Categoria eliminado!", "success");
      } else {
        showToast("Fallo al eliminar la categoria.", "error");
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-amber-600 transition-colors"
        >
          Añadir Categoria
        </button>
      </div>

      {/* Vista de tabla para desktop */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre de Categoria
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {category.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => openModal(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para móvil */}
      <div className="md:hidden space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(category)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && currentCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-4 md:p-8 z-50 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {currentCategory.id ? "Editar Categoria" : "Añadir Categoria"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-amber-600 transition-colors disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
