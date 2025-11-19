using System.ComponentModel.DataAnnotations;

namespace Back.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public bool HasImage { get; set; } // Indica si el producto tiene imagen
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal? Price { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        public IFormFile? Image { get; set; }
    }

    public class UpdateProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal? Price { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
