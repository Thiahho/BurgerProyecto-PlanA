using Back.Data;
using Back.Dtos;
using Back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Back.Controller
{
    [ApiController]
    [Route("api/public")]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("catalog")]
        public async Task<ActionResult<CatalogDto>> GetFullCatalog()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    HasImage = p.ImageData != null && p.ImageData.Length > 0,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            var categories = await _context.Categories
                .Select(c => new CategoryDto { Id = c.Id, Name = c.Name })
                .ToListAsync();

            var settings = await _context.SiteSettings.FindAsync(1);

            // Si no hay configuración, crear valores por defecto
            BusinessInfoDto businessInfo;
            if (settings == null)
            {
                businessInfo = new BusinessInfoDto
                {
                    Name = "Mi Negocio",
                    Banner = new BannerDto
                    {
                        Title = "Bienvenido",
                        Subtitle = "Configura tu negocio en el panel de administración",
                        ImageUrl = "/img/banner2.webp" // Imagen estática
                    },
                    Hours = Array.Empty<string>(),
                    Contact = new ContactDto
                    {
                        Phone = "",
                        Address = "",
                        Social = new SocialDto { Instagram = "", Facebook = "" }
                    }
                };
            }
            else
            {
                businessInfo = new BusinessInfoDto
                {
                    Name = settings.BusinessName,
                    Banner = new BannerDto
                    {
                        Title = settings.BannerTitle,
                        Subtitle = settings.BannerSubtitle,
                        ImageUrl = "/img/banner2.webp" // Imagen estática
                    },
                    Hours = JsonSerializer.Deserialize<string[]>(settings.HoursJson ?? "[]"),
                    Contact = new ContactDto
                    {
                        Phone = settings.ContactPhone,
                        Address = settings.ContactAddress,
                        Social = new SocialDto { Instagram = settings.SocialInstagram, Facebook = settings.SocialFacebook }
                    }
                };
            }

            var catalog = new CatalogDto
            {
                Products = products,
                Categories = categories,
                BusinessInfo = businessInfo
            };

            return Ok(catalog);
        }
        [HttpGet("products/{id}/image")]
        public async Task<IActionResult> GetProductsImage(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p == null || p.ImageData == null || p.ImageData.Length == 0) return NotFound();
            return File(p.ImageData, "image/webp");
        }

        [HttpGet("banner/image")]
        public async Task<IActionResult> GetBannerImage()
        {
            var settings = await _context.SiteSettings.FindAsync(1);

            if (settings == null)
            {
                return NotFound("Settings not found");
            }

            if (settings.BannerImage == null || settings.BannerImage.Length == 0)
            {
                return NotFound("Banner image not found");
            }

            return File(settings.BannerImage, "image/webp");
        }

        [HttpGet("banner/check")]
        public async Task<IActionResult> CheckBannerImage()
        {
            var settings = await _context.SiteSettings.FindAsync(1);
            return Ok(new
            {
                settingsFound = settings != null,
                hasImage = settings?.BannerImage != null,
                imageLength = settings?.BannerImage?.Length ?? 0,
                businessName = settings?.BusinessName ?? "N/A"
            });
        }

        [HttpDelete("banner/clear")]
        public async Task<IActionResult> ClearBannerImage()
        {
            var settings = await _context.SiteSettings.FindAsync(1);
            if (settings == null)
            {
                return NotFound("Settings not found");
            }

            settings.BannerImage = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Banner image cleared successfully" });
        }

    }
}
