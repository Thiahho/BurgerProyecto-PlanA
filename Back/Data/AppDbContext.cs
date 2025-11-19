using Back.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Back.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SiteSettings> SiteSettings { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar nombres de tablas en minúsculas (PostgreSQL style)
            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<SiteSettings>().ToTable("site_settings");
            modelBuilder.Entity<User>().ToTable("user");

            // Configuración adicional si es necesaria
            modelBuilder.Entity<SiteSettings>()
                .HasKey(s => s.Id);

            // Configurar columnas bytea explícitamente para PostgreSQL
            modelBuilder.Entity<SiteSettings>()
                .Property(s => s.BannerImage)
                .HasColumnType("bytea");

            modelBuilder.Entity<Product>()
                .Property(p => p.ImageData)
                .HasColumnType("bytea");

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);
        }
    }
}
