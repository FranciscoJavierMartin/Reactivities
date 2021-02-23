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

By convention use _Query_ as class name when retrieve data and _Command_ when return nothing

```csharp
// Application/Activities/List.cs
  public class Query : IRequest<List<Activity>>{
    // Add your params here if you need it
  }

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

## Add many to many relationships (with EntityFramework Core)

Create an intermediate class under Domain project

```csharp
 public class ActivityAttendee
  {
    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }
    public Guid ActivityId { get; set; }
    public Activity Activity { get; set; }
   // You can add also other attributes that you may need it
  }
```

Add an attribute on both classes

```csharp
class Activity {
  public ICollection<ActivityAttendee> Attendees { get; set; }
  //Other attributes
}

class AppUser {
  public ICollection<ActivityAttendee> Activities { get; set; }
   //Other attributes
}
```

Add a new DbSet on DataContext and override OnModelCreating method

```csharp
public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    // Create the Primary Key's Intermediate table
    builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));
    // Target the AppUserId to the AppUser's Id
    builder.Entity<ActivityAttendee>()
      .HasOne(u => u.AppUser)
      .WithMany(a => a.Activities)
      .HasForeignKey(aa => aa.AppUserId);
    // Target the ActivityId to the Activity's Id
    builder.Entity<ActivityAttendee>()
      .HasOne(u => u.Activity)
      .WithMany(a => a.Attendees)
      .HasForeignKey(aa => aa.ActivityId);
  }
```

Add a migration

```bash
dotnet ef migrations add ActivityAttendee -p Persistence -s API
```

## Create the Infrastructure project

At project root level

```bash
dotnet new classlib -n Infrastructure
dotnet sln add Infrastructure
cd Infrastructure
dotnet add reference ../Application
cd ../API
dotnet add reference ../Infrastructure
cd ..
dotnet restore
```

## Loading related data

In order to avoid circular references between many to many relationships, create a DTO class and add a collection. On this example Profile refers to users

```csharp
public class ActivityDto
  {
    public ICollection<Profile> Attendees { get; set; }
    // Others attributes here
  }
```

Instead of use _Include_ that eager load data, use _ProjectTo_ to lazy load

```csharp
var activities = await _context.Activities
  .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
  .ToListAsync(cancellationToken);
```

Setup AutoMapper to populate fields

```csharp
CreateMap<ActivityAttendee, Profiles.Profile>()
  .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
```

## Add custom policy

To add a custom policy to restrict the access to certains actions. Create two classes under Security folder at Infrastructure project and override the method HandleRequirementAsync.

```csharp
public class IHostRequirement : IAuthorizationRequirement { }

public class IHostRequirementHandler : AuthorizationHandler<IHostRequirement>
{
  protected override Task HandleRequirementAsync(
    AuthorizationHandlerContext context,
    IHostRequirement requirement){
      // Handle logic to determinate if user can do the action

      // Use this to indicate success
      context.Succeed(requirement);

      // Use this to indicate failure
      context.Fail();

      // Finally return this
      return Task.CompletedTask;
    }
}
```

Add the policy on the service configuration

```csharp
services.AddAuthorization(opt =>
  {
    opt.AddPolicy("IsActivityHost", policy =>
    {
      policy.Requirements.Add(new IHostRequirement());
    });
  });
```

Finally on the endpoint use _Authorize_ to enable the policy

```csharp
[Authorize(Policy = "IsActivityHost")]
```

## Upload images to Cloudinary

Install Cloudinary package from NuGet

```bash
cd Infrastructure
nuget install CloudinaryDotNet
```

On your API/appsettings.json add this and fill with your values provided on the Cloudinary dashboard

```json
"Cloudinary":{
  "CloudName": "",
  "ApiKey": "",
  "ApiSecret": ""
}
```

Create a class under Infrastrucure/Photos

```csharp
public class CloudinarySettings {
  public string CloudName { get; set; }
  public string ApiKey { get; set; }
  public string ApiSecret { get; set; }
}
```

Add to service configuration

```csharp
services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
```

Add a new DbSet on DataContext

```csharp
public DbSet<Photo> Photos { get; set; }
```

Do not forget add a new migration when add the new DbSet

```bash
dotnet ef migrations add PhotoEntityAdded -p Persistence -s API
```
