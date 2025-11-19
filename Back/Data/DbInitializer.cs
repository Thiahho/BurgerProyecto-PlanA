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
                throw new Exception("Las tablas de la base de datos no existen. Ejecuta el script BD/bd_fixed.sql primero.", ex);
            }

            // Crear usuario admin si no existe
            if (!context.Users.Any(u => u.Usuario == "admin"))
            {
                var adminUser = new User
                {
                    Usuario = "admin",
                    Password = BCrypt.Net.BCrypt.HashPassword("admin"), // Password por defecto: admin
                    Rol = "admin"
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
}
