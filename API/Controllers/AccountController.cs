using System;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    private readonly EmailSender _emailSender;

    public AccountController(UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      TokenService tokenService,
      EmailSender emailSender)
    {
      _emailSender = emailSender;
      _tokenService = tokenService;
      _signInManager = signInManager;
      _userManager = userManager;
    }


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      ActionResult<UserDto> res;
      var user = await _userManager.Users.Include(p => p.Photos)
        .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

      if (user == null)
      {
        res = Unauthorized("Invalid email");
      }
      else if (!user.EmailConfirmed)
      {
        res = Unauthorized("Email not confirmed");
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
          res = Unauthorized("Invalid password");
        }
      }

      return res;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
      {
        ModelState.AddModelError("email", "Email taken");
        return ValidationProblem();
      }
      if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
      {
        ModelState.AddModelError("username", "Username taken");
        return ValidationProblem();
      }

      var user = new AppUser
      {
        DisplayName = registerDto.DisplayName,
        Email = registerDto.Email,
        UserName = registerDto.Username
      };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded) return BadRequest("Problem registering user");

      var origin = Request.Headers["origin"];
      var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
      token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

      var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
      var message = $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

      await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

      return Ok("Registration success - please verify email");
    }

    [AllowAnonymous]
    [HttpPost("verifyEmail")]
    public async Task<IActionResult> VerifyEmail(string token, string email)
    {
      IActionResult res;
      var user = await _userManager.FindByEmailAsync(email);

      if (user == null)
      {
        res = Unauthorized();
      }
      else
      {
        var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if (result.Succeeded)
        {
          res = Ok("Email confirmed - you can now login");
        }
        else
        {
          res = BadRequest("Could not verify email address");
        }
      }

      return res;
    }

    [AllowAnonymous]
    [HttpGet("resendEmailConfirmationLink")]
    public async Task<IActionResult> ResendEmailConfigurationLink(string email)
    {
      IActionResult res;
      var user = await _userManager.FindByEmailAsync(email);
      if (user == null)
      {
        res = Unauthorized();
      }
      else
      {
        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message = $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

        res = Ok("Email verification link resent");
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

    [AllowAnonymous]
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
      }
      else
      {
        var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

        if (oldToken != null && !oldToken.IsActive)
        {
          res = Unauthorized();
        }
        else
        {
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