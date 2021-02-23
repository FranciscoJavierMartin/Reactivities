using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class SetMain
  {
    public class Command : IRequest<Result<Unit>>
    {
      public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;
      private readonly DataContext _context;

      public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
        _photoAccessor = photoAccessor;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
        Result<Unit> res;

        if (user == null)
        {
          res = null;
        }
        else
        {
          var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

          if (photo == null)
          {
            res = null;
          }
          else
          {
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null)
            {
              currentMain.IsMain = false;
            }

            photo.IsMain = true;

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
            {
              res = Result<Unit>.Success(Unit.Value);
            }
            else
            {
              res = Result<Unit>.Failure("Problem setting main photo");
            }
          }
        }

        return res;
      }
    }
  }
}