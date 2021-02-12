# Reactivities

## Setup backend
```
mkdir Reactivities
cd Reactivities

dotnet new sln
dotnet new webapi -n API
dotnet new classlib -n Application
dotnet new classlib -n Persistance
dotnet new classlib -n Domain

dotnet sln add API
dotnet sln add Application
dotnet sln add Persistance
dotnet sln add Domain

cd API
dotnet add reference ../Application
cd ../Application
dotnet add reference ../Persistance
dotnet add reference ../Domain
cd ../Persistance
dotnet add reference ../Domain
```

## Setup Entity Framework Core
```
cd ../Persistance
nuget install Microsoft.EntityFrameworkCore.Sqlite
cd ../API
nuget install Microsoft.EntityFrameworkCore.Design

dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p Persistance -s API 
```