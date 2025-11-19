# ============================================
# Dockerfile para Backend .NET 8 - Render
# ============================================

# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar dependencias
COPY ["Back/Back.csproj", "Back/"]
RUN dotnet restore "Back/Back.csproj"

# Copiar el resto del código y compilar
COPY Back/ Back/
WORKDIR "/src/Back"
RUN dotnet build "Back.csproj" -c Release -o /app/build

# Etapa 2: Publish
FROM build AS publish
RUN dotnet publish "Back.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copiar archivos compilados
COPY --from=publish /app/publish .

# Copiar archivos estáticos (banner)
COPY Back/wwwroot ./wwwroot

# Exponer puerto (Render usa la variable PORT)
EXPOSE 8080

# Configurar ASP.NET Core para escuchar en el puerto dinámico de Render
ENV ASPNETCORE_URLS=http://+:8080

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "Back.dll"]
