using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tikamp.Database.Migrations
{
    /// <inheritdoc />
    public partial class LeggerTilActivityType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Activities",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Activities");
        }
    }
}
