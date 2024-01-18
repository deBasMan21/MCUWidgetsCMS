using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    /// <inheritdoc />
    public partial class addrelationstoswipeevents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "actorId",
                table: "TrackingSwipeEvents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "directorId",
                table: "TrackingSwipeEvents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "projectId",
                table: "TrackingSwipeEvents",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackingSwipeEvents_actorId",
                table: "TrackingSwipeEvents",
                column: "actorId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackingSwipeEvents_directorId",
                table: "TrackingSwipeEvents",
                column: "directorId");

            migrationBuilder.CreateIndex(
                name: "IX_TrackingSwipeEvents_projectId",
                table: "TrackingSwipeEvents",
                column: "projectId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingSwipeEvents_Actors_actorId",
                table: "TrackingSwipeEvents",
                column: "actorId",
                principalTable: "Actors",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingSwipeEvents_Directors_directorId",
                table: "TrackingSwipeEvents",
                column: "directorId",
                principalTable: "Directors",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingSwipeEvents_Projects_projectId",
                table: "TrackingSwipeEvents",
                column: "projectId",
                principalTable: "Projects",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackingSwipeEvents_Actors_actorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackingSwipeEvents_Directors_directorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackingSwipeEvents_Projects_projectId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingSwipeEvents_actorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingSwipeEvents_directorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropIndex(
                name: "IX_TrackingSwipeEvents_projectId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropColumn(
                name: "actorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropColumn(
                name: "directorId",
                table: "TrackingSwipeEvents");

            migrationBuilder.DropColumn(
                name: "projectId",
                table: "TrackingSwipeEvents");
        }
    }
}
