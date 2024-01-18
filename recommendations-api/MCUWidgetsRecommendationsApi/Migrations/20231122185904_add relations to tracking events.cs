using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    /// <inheritdoc />
    public partial class addrelationstotrackingevents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "actorId",
                table: "TrackingPageOpenEvents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "directorId",
                table: "TrackingPageOpenEvents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "projectId",
                table: "TrackingPageOpenEvents",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackingPageOpenEvents_actorId",
                table: "TrackingPageOpenEvents",
                column: "actorId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackingPageOpenEvents_directorId",
                table: "TrackingPageOpenEvents",
                column: "directorId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackingPageOpenEvents_projectId",
                table: "TrackingPageOpenEvents",
                column: "projectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingPageOpenEvents_Actors_actorId",
                table: "TrackingPageOpenEvents",
                column: "actorId",
                principalTable: "Actors",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingPageOpenEvents_Directors_directorId",
                table: "TrackingPageOpenEvents",
                column: "directorId",
                principalTable: "Directors",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingPageOpenEvents_Projects_projectId",
                table: "TrackingPageOpenEvents",
                column: "projectId",
                principalTable: "Projects",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackingPageOpenEvents_Actors_actorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackingPageOpenEvents_Directors_directorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackingPageOpenEvents_Projects_projectId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingPageOpenEvents_actorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingPageOpenEvents_directorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingPageOpenEvents_projectId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropColumn(
                name: "actorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropColumn(
                name: "directorId",
                table: "TrackingPageOpenEvents");

            migrationBuilder.DropColumn(
                name: "projectId",
                table: "TrackingPageOpenEvents");
        }
    }
}
