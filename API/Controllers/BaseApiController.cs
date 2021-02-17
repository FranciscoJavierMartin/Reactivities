using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{

  [ApiController]
  [Route("api/[controller]")]
  public class BaseApiController : ControllerBase
  {
    private IMediator _mediator;

    protected IMediator Mediator =>
      _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

    protected ActionResult HandleResult<T>(Result<T> result)
    {
      ActionResult res;
      if (result == null)
      {
        res = NotFound();
      }
      else if (result.IsSuccess && result.Value != null)
      {
        res = Ok(result.Value);
      }
      else if (result.IsSuccess && result.Value == null)
      {
        res = NotFound();
      }
      else
      {
        res = BadRequest(result.Error);
      }

      return res;
    }
  }
}