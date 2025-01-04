using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tikamp.Database.Migrations
{
    /// <inheritdoc />
    public partial class DateToJustDay : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "UserActivities");

            migrationBuilder.AddColumn<int>(
                name: "Day",
                table: "UserActivities",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Day",
                table: "UserActivities");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Date",
                table: "UserActivities",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }
    }
}
