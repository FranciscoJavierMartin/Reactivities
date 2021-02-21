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

Commands to drop database

```bash
dotnet ef database drop -s API -p Persistence
dotnet ef database update
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

## Add AutoMapper

```bash
cd Application
nuget install AutoMapper.Extensions.Microsoft.DependencyInjection
```

```csharp
// Startup.cs
// Inside ConfigureServices method
services.AddAutoMapper(typeof(MappingProfiles).Assembly);
```

```csharp
// MappingProfiles.cs
public class MappingProfiles : Profile
  {
    public MappingProfiles()
    {
        CreateMap<Activity, ActivityDto>();
    }
  }
```

```csharp
public class MyClass {
  public MyClass(IMapper mapper){
    _mapper = mapper;
  }

  // Inside method
  _mapper.Map(activity, activityDto);
}
```

## Setup MobX

```bash
yarn add mobx mobx-react-lite
```

## Setup Fluent Validation

```bash
cd Application
nuget install FluentValidation.AspNetCore
```

Create a validator for Models (on the same folder as the commands for Mediator)

```csharp
public class ActivityValidator : AbstractValidator<Activity>
{
  public ActivityValidator()
  {
    RuleFor(x => x.Title).NotEmpty();
    RuleFor(x => x.Description).NotEmpty();
  }
}
```

Create a class inside the Mediator Command and assign the Validator previously created. You can also add other validators.

```csharp
public class CommandValidator : AbstractValidator<Command>
{
  public CommandValidator()
  {
    RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
  }
}
```

Add validators to Startup class

```csharp
// Startup.cs
// Inside ConfigureServices
services.AddControllers().AddFluentValidation(config =>
  {
    config.RegisterValidatorsFromAssemblyContaining<Create>();
  });
```

## Add Identity

```bash
cd Domain
nuget install Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

Create a class that extends from IdentityUser and add the properties that you need like Bio or DisplayName

```csharp
public class AppUser : IdentityUser{}
```

Extends DataContext from _IdentityDbContext_ instead of _DbContext_

```csharp
// Inside the Persistence project
public class DataContext : IdentityDbContext<AppUser>{}
```

Make a migration at project root level

```bash
 dotnet ef migrations add IdentityAdded -p Persistence -s API
```

Install package to manage JWT

```bash
cd API
nuget install Microsoft.AspNetCore.Authentication.JwtBearer
```
