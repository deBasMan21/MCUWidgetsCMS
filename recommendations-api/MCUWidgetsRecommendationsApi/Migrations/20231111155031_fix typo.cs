using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    /// <inheritdoc />
    public partial class fixtypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "pageTypee",
                table: "Actors",
                newName: "pageType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "pageType",
                table: "Actors",
                newName: "pageTypee");
        }
    }
}
