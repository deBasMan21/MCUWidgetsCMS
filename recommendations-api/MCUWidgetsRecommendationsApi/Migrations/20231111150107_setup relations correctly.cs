using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    /// <inheritdoc />
    public partial class setuprelationscorrectly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Projects_Projectid",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Projectid",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Projectid",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "pageTypee",
                table: "Projects",
                newName: "pageType");

            migrationBuilder.AddColumn<int>(
                name: "cmsId",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "cmsId",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "pageType",
                table: "Projects",
                newName: "pageTypee");

            migrationBuilder.AddColumn<int>(
                name: "Projectid",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Projectid",
                table: "Projects",
                column: "Projectid");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Projects_Projectid",
                table: "Projects",
                column: "Projectid",
                principalTable: "Projects",
                principalColumn: "id");
        }
    }
}
