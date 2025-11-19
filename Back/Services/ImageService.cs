using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;

namespace Back.Services
{
    public class ImageService
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        private const int MaxProductImageSize = 800;
        private const int MaxBannerWidth = 1920;

        public ImageService(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        /// <summary>
        /// Procesa una imagen de producto y la convierte a formato WebP (800x800 max)
        /// </summary>
        public async Task<byte[]?> ProcessImageAsync(IFormFile imageFile)
        {
            return await ProcessImageAsync(imageFile, MaxProductImageSize, MaxProductImageSize);
        }

        /// <summary>
        /// Procesa una imagen de banner y la convierte a formato WebP (1920px ancho max)
        /// </summary>
        public async Task<byte[]?> ProcessBannerImageAsync(IFormFile imageFile)
        {
            return await ProcessImageAsync(imageFile, MaxBannerWidth, MaxBannerWidth);
        }

        /// <summary>
        /// Procesa una imagen y la convierte a formato WebP, retornando los bytes
        /// </summary>
        private async Task<byte[]?> ProcessImageAsync(IFormFile imageFile, int maxWidth, int maxHeight)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                throw new InvalidOperationException("No image file provided");
            }

            // Validar que sea una imagen
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Invalid image format. Only JPG, PNG, GIF, BMP, and WebP are allowed.");
            }

            using (var image = await Image.LoadAsync(imageFile.OpenReadStream()))
            {
                // Redimensionar la imagen para ahorrar espacio
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(maxWidth, maxHeight),
                    Mode = ResizeMode.Max
                }));

                // Convertir a WebP y guardar en memoria
                using (var ms = new MemoryStream())
                {
                    var encoder = new WebpEncoder
                    {
                        Quality = 85, // Calidad del WebP (0-100)
                        FileFormat = WebpFileFormatType.Lossy
                    };
                    await image.SaveAsync(ms, encoder);
                    ms.Position = 0; // Resetear posición antes de leer
                    return ms.ToArray();
                }
            }
        }

        [Obsolete("Use ProcessImageAsync instead")]
        public async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return null;
            }

            var uploadsFolder = Path.Combine(_hostEnvironment.WebRootPath, "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid().ToString()}_{Path.GetFileNameWithoutExtension(imageFile.FileName)}.webp";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var image = await Image.LoadAsync(imageFile.OpenReadStream()))
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(800, 800),
                    Mode = ResizeMode.Max
                }));

                await image.SaveAsync(filePath, new WebpEncoder());
            }

            return $"/images/{uniqueFileName}";
        }
    }
}
