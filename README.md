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

Create an join class under Domain project

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
    // Create the Primary Key's join table
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

## Add SignalR

To use real time communication between use SignalR

```csharp
// Startup.cs
app.UseEndpoints(endpoints =>
{
  endpoints.MapControllers();
  endpoints.MapHub<ChatHub>("/chat");
});
```

Add to configure services

```csharp

services.AddCors(opt =>
{
  opt.AddPolicy("CorsPolicy", policy =>
  {
    policy.AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials() // Add this line to enable CORS for SignalR
      .WithOrigins(new string[3] { "http://localhost:3000", "http://localhost:3001", "http://localhost:4200" });
  });
});

services.AddSignalR();
```

Add for authencicate on the hub

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(opt =>
{
  // Add this lines to enable authentication on the chat hub
  opt.Events = new JwtBearerEvents
  {
    OnMessageReceived = context =>
    {
      var accessToken = context.Request.Query["access_token"];
      var path = context.HttpContext.Request.Path;
      if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
      {
        context.Token = accessToken;
      }
      return Task.CompletedTask;
    }
  };
});
```

This is the equivalent to a ApiController

```csharp
public class ChatHub : Hub
{
  private readonly IMediator _mediator;
  public ChatHub(IMediator mediator)
  {
    _mediator = mediator;
  }
  public async Task SendComment(Create.Command command)
  {
    var comment = await _mediator.Send(command);
    await Clients.Group(command.ActivityId.ToString())
      .SendAsync("ReceiveComments", comment.Value);
  }
  public override async Task OnConnectedAsync()
  {
    var httpContext = Context.GetHttpContext();
    var activityId = httpContext.Request.Query["activityId"];
    await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
    var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });
    await Clients.Caller.SendAsync("LoadComments", result.Value);
  }
}
```

On the client side install SignalR

```bash
yarn add @microsoft/signalr
```

```ts
// Declare variable
hubConnection: HubConnection;

// Create the connection
this.hubConnection = new HubConnectionBuilder()
  .withUrl(`${process.env.REACT_APP_BASE_URL_CHAT}?activityId=${activityId}`, {
    accessTokenFactory: () => store.userStore.user?.token!,
  })
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Information)
  .build();

// Start the connection
this.hubConnection
  .start()
  .catch((error) => console.log('Error establishing the connection: ', error));

// Subscribe to 'LoadComments' events
this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {});

// Subscribe to 'ReceiveComments' events
this.hubConnection.on('ReceiveComments', (comment: ChatComment) => {});

// Invoke a public method inside the class configure on the server
// In our example ChatHub
await this.hubConnection?.invoke('SendComment', values);

// To stop connection. Do not forget when it is not need it.
this.hubConnection
  .stop()
  .catch((error) => console.log('Error stopping connection: ', error));
```

## Many to many self relationship

Entity framework Core is not particularity good managing many to many relationships, so instead it is a better approach use a join table. A tipical example is an user following system.

```csharp
public class UserFollowing
{
  public string ObserverId { get; set; }
  public AppUser Observer { get; set; }
  public string TargetId { get; set; }
  public AppUser Target { get; set; }
  // You can add more attributes if you need them
}
```

## Add pagination

Add these headers with values

```csharp
// Create an extension method to add pagination header
public static void AddPaginationHeader(thisHttpResponse response,
      int currentPage, int itemsPerPage, inttotalItems, int totalPages)
  {
    var paginationHeader = new
    {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages
    };
    response.Headers.Add("Pagination",
        JsonSerializer.Serializ(paginationHeader));
    response.Headers.Ad("Access-Control-Expose-Headers","Pagination");
  }

// BaseApiController
Response.AddPaginationHeader(result.Value.CurrentPage,
  result.Value.PageSize, result.Value.TotalCount,
  result.Value.TotalPages);
```

Example paginated controller

```csharp
[HttpGet]
public async Task<ActionResult> GetActivitie[FromQuery] PagingParams param)
{
  return HandlePagedResult(await Mediator.Se(new List.Query { Params = param }));
}
```

Example of List handler

```csharp
public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
{
  var query = _context.Activities
    .OrderBy(d => d.Date)
    .ProjectTo<ActivityDto>(_mappConfigurationProvider,
      new { currentUsername = _userAccessGetUsername() })
    .AsQueryable()
  return Result<PagedList<ActivityDtoSuccess(
    await PagedList<ActivityDto>.CreateAs(query,
      request.Params.PageNumber, requeParams.PageSize)
  );
}
```

## Add security to your site

I deploy to Heroku that serve sites over HTTPS, so that point is cover.

```bash
cd API
nuget install NWebsec.AspNetCore.Middleware
```

```csharp
// Startup.cs Configure method
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
  .BlockAllMixedContent()
  .StyleSources(s => s.Self()
    .CustomSources("https://fonts.googleapis.com"))
  .FontSources(s => s.Self()
    .CustomSources("https://fonts.gstatic.com", "data:"))
  .FormActions(s => s.Self())
  .FrameAncestors(s => s.Self())
  .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))
  .ScriptSources(s => s.Self()
    .CustomSources("sha256-ma5XxS1EBgt17N22Qq31rOxxRWRfzUTQS1KOtfYwuNo="))
);

if (env.IsDevelopment())
{
  // Development configs like Swagger
}
else
{
  app.Use(async (context, next) =>
  {
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
    await next.Invoke();
  });
}
```

With a minimun effort, I got an A rating at https://securityheaders.com/

![rating on security](./Security-header-rating.png)

## Auto refresh token

Add a new endpoint to refresh token

```csharp
// AccountController.cs
[HttpPost("refreshToken")]
public async Task<ActionResult<UserDto>> RefreshToken()
{
  ActionResult<UserDto> res;
  var refreshToken = Request.Cookies["refreshToken"];
  var user = await _userManager.Users
    .Include(r => r.RefreshTokens)
    .Include(p => p.Photos)
    .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

  if (user == null)
  {
    res = Unauthorized();
  } else {
    var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

    if (oldToken != null && !oldToken.IsActive)
    {
      res = Unauthorized();
    } else {
      res = CreateUserObject(user);
    }
  }

  return res;
}

private async Task SetRefreshToken(AppUser user)
{
  var refreshToken = _tokenService.GenerateRefreshToken();
  user.RefreshTokens.Add(refreshToken);
  await _userManager.UpdateAsync(user);
  var cookieOptions = new CookieOptions
  {
    HttpOnly = true,
    Expires = DateTime.UtcNow.AddDays(7),
  };

  Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
}
```

Add this line to allow new headers

```csharp
opt.AddPolicy("CorsPolicy", policy =>
{
  policy.AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .WithExposedHeaders("WWW-Authenticate", "Pagination") // Add this line to allow both headers
    .WithOrigins(new string[3] { "http://localhost:3000", "http://localhost:3001", "http://localhost:4200" });
});
```

Validate lifetime token

```csharp
// IdentityServiceExtensions.cs
opt.TokenValidationParameters = new TokenValidationParameters
{
  // Other parameters
  // Add these new lines to validate token lifetime
  ValidateLifetime = true,
  ClockSkew = TimeSpan.Zero
};
```

Added method to refresh token

```csharp
// TokenService.cs
public RefreshToken GenerateRefreshToken()
{
  var randomNumber = new byte[32];
  using var rng = RandomNumberGenerator.Create();
  rng.GetBytes(randomNumber);
  return new RefreshToken { Token = Convert.ToBase64String(randomNumber) };
}

// Add this new param when create SecurityTokenDescriptor
Expires = DateTime.Now.AddMinutes(10),
```

Add this attribute to AppUser entity

```csharp
// AppUser.cs
public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
```

Add a new entity

```csharp
public class RefreshToken
{
  public int Id { get; set; }
  public AppUser AppUser { get; set; }
  public string Token { get; set; }
  public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
  public bool IsExpired => DateTime.UtcNow >= Expires;
  public DateTime? Revoked { get; set; }
  public bool IsActive => Revoked == null && !IsExpired;
}
```

Add a new migration

```bash
dotnet ef migrations add RefreshTokens -p Persistence -s API
```