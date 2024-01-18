#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["MCUWidgetsRecommendationsApi.csproj", "."]
RUN dotnet restore "./MCUWidgetsRecommendationsApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "MCUWidgetsRecommendationsApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MCUWidgetsRecommendationsApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

RUN dotnet dev-certs https --clean
RUN dotnet dev-certs https --trust

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MCUWidgetsRecommendationsApi.dll"]
