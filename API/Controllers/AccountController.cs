using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace API.Controllers
{
  [AllowAnonymous]
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AccountController(UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      TokenService tokenService,
      IConfiguration config)
    {
      _tokenService = tokenService;
      _signInManager = signInManager;
      _userManager = userManager;
      _config = config;
      _httpClient = new HttpClient
      {
        BaseAddress = new System.Uri("https://graph.facebook")
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      ActionResult<UserDto> res;
      var user = await _userManager.Users.Include(p => p.Photos)
        .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

      if (user == null)
      {
        res = Unauthorized();
      }
      else
      {
        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (result.Succeeded)
        {
          res = CreateUserObject(user);
        }
        else
        {
          res = Unauthorized();
        }
      }

      return res;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      ActionResult<UserDto> res;
      if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
      {
        ModelState.AddModelError("email", "Email taken");
        res = ValidationProblem();
      }
      else if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
      {
        ModelState.AddModelError("username", "Username taken");
        res = ValidationProblem();
      }
      else
      {
        var user = new AppUser
        {
          DisplayName = registerDto.DisplayName,
          Email = registerDto.Email,
          UserName = registerDto.Username,

        };
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
          res = CreateUserObject(user);
        }
        else
        {
          res = BadRequest("Problem registering user");
        }
      }
      return res;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManager.Users.Include(p => p.Photos)
        .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
      return CreateUserObject(user);
    }

    [HttpPost("fbLogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
      ActionResult<UserDto> res;
      var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];
      var verifyToken = await _httpClient
        .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

      if (!verifyToken.IsSuccessStatusCode)
      {
        res = Unauthorized();
      }
      else
      {
        var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
        var response = await _httpClient.GetAsync(fbUrl);

        if (!response.IsSuccessStatusCode)
        {
          res = Unauthorized();
        }
        else
        {
          var fbInfo = JsonConvert
            .DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
          var username = (string)fbInfo.id;
          var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == username);

          if (user != null)
          {
            res = CreateUserObject(user);
          }
          else
          {
            user = new AppUser
            {
              DisplayName = (string)fbInfo.name,
              Email = (string)fbInfo.email,
              UserName = (string)fbInfo.id,
              Photos = new List<Photo> {
                new Photo {
                  Id = "fb_" + (string)fbInfo.id,
                  Url = (string)fbInfo.picture.data.url,
                  IsMain = true,
                }
              }
            };

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded)
            {
              res = BadRequest("Problem creating user account");
            }
            else
            {
              res = CreateUserObject(user);
            }
          }
        }

      }
      return res;
    }


    private UserDto CreateUserObject(AppUser user)
    {
      return new UserDto
      {
        DisplayName = user.DisplayName,
        Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
        Token = _tokenService.CreateToken(user),
        Username = user.UserName,
      };
    }
  }
}