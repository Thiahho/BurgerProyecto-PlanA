using Back.Models;
using System.Text.Json;

namespace Back.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            try
            {
                // Verificar que las tablas existen haciendo una consulta simple
                var tablesExist = context.Categories.Any() || !context.Categories.Any();
            }
            catch (Exception ex)
            {
                // Si las tablas no existen, fallar con mensaje claro
                throw new Exception("Las tablas de la base de datos no existen. Ejecuta el script SQL primero.", ex);
            }

            // El usuario admin se crea manualmente vía Postman usando /api/auth/register
        }
    }
}
