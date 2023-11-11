﻿// <auto-generated />
using System;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MCUWidgetsRecommendationsApi.Migrations
{
    [DbContext(typeof(GeneralDbContext))]
    [Migration("20231111151342_add unique id")]
    partial class adduniqueid
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ActorProject", b =>
                {
                    b.Property<int>("actorsid")
                        .HasColumnType("int");

                    b.Property<int>("projectsid")
                        .HasColumnType("int");

                    b.HasKey("actorsid", "projectsid");

                    b.HasIndex("projectsid");

                    b.ToTable("ActorProject");
                });

            modelBuilder.Entity("DirectorProject", b =>
                {
                    b.Property<int>("directorsid")
                        .HasColumnType("int");

                    b.Property<int>("projectsid")
                        .HasColumnType("int");

                    b.HasKey("directorsid", "projectsid");

                    b.HasIndex("projectsid");

                    b.ToTable("DirectorProject");
                });

            modelBuilder.Entity("MCUWidgetsRecommendationsApi.Models.Actor", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("character")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("dateOfBirth")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("firstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("imageUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("lastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("pageTypee")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.ToTable("Actors");
                });

            modelBuilder.Entity("MCUWidgetsRecommendationsApi.Models.Director", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("dateOfBirth")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("firstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("imageUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("lastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("pageType")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.ToTable("Directors");
                });

            modelBuilder.Entity("MCUWidgetsRecommendationsApi.Models.Project", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("categories")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("imdb_id")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("overview")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("pageType")
                        .HasColumnType("int");

                    b.Property<string>("posterUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("releaseDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("source")
                        .HasColumnType("int");

                    b.Property<string>("title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("type")
                        .HasColumnType("int");

                    b.Property<string>("uniqueId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ActorProject", b =>
                {
                    b.HasOne("MCUWidgetsRecommendationsApi.Models.Actor", null)
                        .WithMany()
                        .HasForeignKey("actorsid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MCUWidgetsRecommendationsApi.Models.Project", null)
                        .WithMany()
                        .HasForeignKey("projectsid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DirectorProject", b =>
                {
                    b.HasOne("MCUWidgetsRecommendationsApi.Models.Director", null)
                        .WithMany()
                        .HasForeignKey("directorsid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MCUWidgetsRecommendationsApi.Models.Project", null)
                        .WithMany()
                        .HasForeignKey("projectsid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
