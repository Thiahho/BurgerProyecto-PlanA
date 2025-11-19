using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Back.Models
{
    [Table("products")]
    public class Product
    {
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Column("name")]
        public string? Name { get; set; }

        [Required]
        [StringLength(500)]
        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("price", TypeName = "numeric(12,2)")]
        public decimal? Price { get; set; }

        // Imagen almacenada como BLOB (bytes) en formato WebP
        [Column("image_data")]
        public byte[]? ImageData { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
    }
}
