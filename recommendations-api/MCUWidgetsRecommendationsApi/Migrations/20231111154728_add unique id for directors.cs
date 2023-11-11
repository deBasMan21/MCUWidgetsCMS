using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    /// <inheritdoc />
    public partial class adduniqueidfordirectors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "uniqueId",
                table: "Directors",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "uniqueId",
                table: "Directors");
        }
    }
}
