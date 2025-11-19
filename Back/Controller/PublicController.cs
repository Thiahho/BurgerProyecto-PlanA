using Back.Data;
using Back.Dtos;
using Back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Back.Controller
{
    [ApiController]
    [Route("api/admin/settings")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Back.Services.ImageService _imageService;

        public SettingsController(AppDbContext context, Back.Services.ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<BusinessInfoDto>> GetSettings()
        {
            var settings = await _context.SiteSettings.FindAsync(1);
            if (settings == null)
            {
                return NotFound();
            }

            return new BusinessInfoDto
            {
                Name = settings.BusinessName,
                Banner = new BannerDto { Title = settings.BannerTitle, Subtitle = settings.BannerSubtitle, ImageUrl = "" },
                Hours = JsonSerializer.Deserialize<string[]>(settings.HoursJson ?? "[]"),
                Contact = new ContactDto
                {
                    Phone = settings.ContactPhone,
                    Address = settings.ContactAddress,
                    Social = new SocialDto { Instagram = settings.SocialInstagram, Facebook = settings.SocialFacebook }
                }
            };
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromForm] UpdateBusinessInfoDto settingsDto)
        {
            var settings = await _context.SiteSettings.FindAsync(1);

            // Procesar imagen del banner ANTES de crear/actualizar el registro (igual que productos)
            byte[]? bannerImageData = null;
            if (settingsDto.BannerImage != null)
            {
                try
                {
                    bannerImageData = await _imageService.ProcessBannerImageAsync(settingsDto.BannerImage);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { error = ex.Message });
                }
            }

            // Si no existe, crear nuevo registro
            if (settings == null)
            {
                settings = new SiteSettings
                {
                    Id = 1,
                    BusinessName = settingsDto.Name ?? "",
                    BannerTitle = settingsDto.BannerTitle ?? "",
                    BannerSubtitle = settingsDto.BannerSubtitle ?? "",
                    BannerImage = bannerImageData,  // Asignar los bytes procesados
                    HoursJson = JsonSerializer.Serialize(settingsDto.Hours ?? Array.Empty<string>()),
                    ContactPhone = settingsDto.ContactPhone ?? "",
                    ContactAddress = settingsDto.ContactAddress ?? "",
                    SocialInstagram = settingsDto.SocialInstagram ?? "",
                    SocialFacebook = settingsDto.SocialFacebook ?? ""
                };

                _context.SiteSettings.Add(settings);
            }
            else
            {
                // Actualizar campos de texto
                settings.BusinessName = settingsDto.Name ?? settings.BusinessName ?? "";
                settings.BannerTitle = settingsDto.BannerTitle ?? settings.BannerTitle ?? "";
                settings.BannerSubtitle = settingsDto.BannerSubtitle ?? settings.BannerSubtitle ?? "";
                settings.HoursJson = JsonSerializer.Serialize(settingsDto.Hours ?? Array.Empty<string>());
                settings.ContactPhone = settingsDto.ContactPhone ?? settings.ContactPhone ?? "";
                settings.ContactAddress = settingsDto.ContactAddress ?? settings.ContactAddress ?? "";
                settings.SocialInstagram = settingsDto.SocialInstagram ?? settings.SocialInstagram ?? "";
                settings.SocialFacebook = settingsDto.SocialFacebook ?? settings.SocialFacebook ?? "";

                // Solo actualizar la imagen si se proporcionó una nueva
                if (bannerImageData != null)
                {
                    settings.BannerImage = bannerImageData;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
