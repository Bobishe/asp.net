using System.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

// Add services to the container.
services.AddTransient<IDbConnection>(b =>
{
    var configuration = b.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DBConnection");
    return new MySqlConnection(connectionString);
});

services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

services.AddControllers();


services.AddEndpointsApiExplorer();
services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API v1");
    });
}

// Посредник ограничивающий работу магазина по времени
app.Use(async (context, next) =>
{
    var currentTime = DateTime.Now.TimeOfDay;
    if (currentTime < new TimeSpan(8, 0, 0) || currentTime > new TimeSpan(20, 0, 0))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"status\": 403, \"message\": \"API доступен только с 8:00 до 20:00.\"}");
    }
    else
    {
        await next();
    }
});



app.UseRouting();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
