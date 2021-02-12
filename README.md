# Reactivities

## Setup backend
```
mkdir Reactivities
cd Reactivities

dotnet new sln
dotnet new webapi -n API
dotnet new classlib -n Application
dotnet new classlib -n Persistence
dotnet new classlib -n Domain

dotnet sln add API
dotnet sln add Application
dotnet sln add Persistence
dotnet sln add Domain

cd API
dotnet add reference ../Application
cd ../Application
dotnet add reference ../Persistence
dotnet add reference ../Domain
cd ../Persistence
dotnet add reference ../Domain
```

## Setup Entity Framework Core
```
cd ../Persistence
nuget install Microsoft.EntityFrameworkCore.Sqlite
cd ../API
nuget install Microsoft.EntityFrameworkCore.Design

dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p Persistence -s API 
```