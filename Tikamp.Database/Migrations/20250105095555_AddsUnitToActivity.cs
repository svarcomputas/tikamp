﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tikamp.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddsUnitToActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Unit",
                table: "Activities",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Unit",
                table: "Activities");
        }
    }
}
