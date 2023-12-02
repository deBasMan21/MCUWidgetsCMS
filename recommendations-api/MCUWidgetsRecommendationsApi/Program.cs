using System.Text.Json.Serialization;
using Infrastructure.Configuration;
using MCUWidgetsRecommendationsApi.EventHandlers;
using MCUWidgetsRecommendationsApi.Infrastructure.Context;
using MCUWidgetsRecommendationsApi.Infrastructure.Interfaces;
using MCUWidgetsRecommendationsApi.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Setup Database
builder.Services.AddDbContext<GeneralDbContext>(ServiceLifetime.Singleton);

// Allow Cors
var MyAllowSpecificOrigins = "";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                      });
});

// Add RabbitMQHandlers
builder.Services.UseRabbitMQMessageHandler(builder.Configuration);
builder.Services.AddHostedService<CMSEntityEventHandler>();

// Dependency injection
builder.Services.AddSingleton<IProjectRepository, ProjectRepository>();
builder.Services.AddSingleton<IActorRepository, ActorRepository>();
builder.Services.AddSingleton<IDirectorRepository, DirectorRepository>();
builder.Services.AddSingleton<ITrackingRepository, TrackingRepository>();
builder.Services.AddSingleton<IRecommendationsRepository, RecommendationsRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(MyAllowSpecificOrigins);

// Automatically execute migrations
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<GeneralDbContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
        Console.WriteLine("Migrated database");
    }
}

app.Run();

