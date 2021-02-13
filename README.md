# Reactivities

## Setup backend
```bash
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
```bash
cd ../Persistence
nuget install Microsoft.EntityFrameworkCore.Sqlite
cd ../API
nuget install Microsoft.EntityFrameworkCore.Design

dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p Persistence -s API 
```

## Setup client app
```bash
yarn create react-app client-app --template typescript
cd client-app
yarn add axios
```

## Add MediatR
```bash
cd Application
nuget install MediatR.Extensions.Microsoft.DependencyInjection 
```

```csharp
// Startup.cs
// Inside ConfigureServices method
services.AddMediatR(typeof(List.Handler).Assembly);
```

```csharp
// ActivitiesController.cs
  [HttpGet]
  public async Task<ActionResult<List<Activity>>> GetActivities()
  {
    return await Mediator.Send(new List.Query());
  }
```

```csharp
// Application/Activities/List.cs
  public class Query : IRequest<List<Activity>>{}
  public class Handler : IRequestHandler<Query, List<Activity>>
  {
    private readonly DataContext _context;
    public Handler(DataContext context)
    {
      _context = context;
    }

    public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
    {
      // Do logic to retrieve data from database via DataContext
    }
  }
```