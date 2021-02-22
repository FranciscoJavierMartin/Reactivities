using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Persistence;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Security
{
  public class IHostRequirement : IAuthorizationRequirement { }

  public class IHostRequirementHandler : AuthorizationHandler<IHostRequirement>
  {
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public IHostRequirementHandler(DataContext dbContext,
        IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
      _dbContext = dbContext;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IHostRequirement requirement)
    {
      var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

      if (userId == null)
      {
        return Task.CompletedTask;
      }

      var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
        .SingleOrDefault(x => x.Key == "id").Value?.ToString());

      var attendee = _dbContext.ActivityAttendees
        .AsNoTracking()
        .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
        .Result;

      if (attendee == null)
      {
        return Task.CompletedTask;
      }

      if (attendee.IsHost)
      {
        context.Succeed(requirement);
      }

      return Task.CompletedTask;
    }
  }
}