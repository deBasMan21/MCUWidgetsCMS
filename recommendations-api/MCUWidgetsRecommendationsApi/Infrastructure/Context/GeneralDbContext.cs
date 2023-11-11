using System;
using MCUWidgetsRecommendationsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MCUWidgetsRecommendationsApi.Infrastructure.Context
{
	public class GeneralDbContext: DbContext
	{
		public DbSet<Project> Projects { get; set; }
		public DbSet<Actor> Actors { get; set; }
		public DbSet<Director> Directors { get; set; }

		public GeneralDbContext(DbContextOptions<GeneralDbContext> options): base(options)
		{
		}

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            string? pwd = Environment.GetEnvironmentVariable("RECOMMENDATIONS_DATABASE_PASSWORD");
			string? dbName = Environment.GetEnvironmentVariable("RECOMMENDATIONS_DATABASE_NAME");
			string connectionString = $"server=mcu-widgets-recommendations-db;database={dbName};user=root;password={pwd}";

			optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(10, 1, 40)));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Project>().HasMany(p => p.actors).WithMany(a => a.projects);
			modelBuilder.Entity<Project>().HasMany(p => p.directors).WithMany(d => d.projects);
        }
    }
}

