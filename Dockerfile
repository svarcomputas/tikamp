# Use the official .NET SDK image as the build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . ./
RUN dotnet restore
# Build the application in Release mode
RUN dotnet publish -c Release -o out

# Use a smaller runtime image for deployment
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Set the working directory inside the runtime container
WORKDIR /app

# Copy the published application from the build container
COPY --from=build-env /app/out .

# Expose the port your application runs on
EXPOSE 80

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "Tikamp.dll"]