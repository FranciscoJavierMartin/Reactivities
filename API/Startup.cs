using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using API.Extensions;
using FluentValidation.AspNetCore;
using Application.Activities;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

namespace API
{
  public class Startup
  {
    private readonly IConfiguration _config;
    public Startup(IConfiguration config)
    {
      _config = config;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers(opt =>
      {
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      }).AddFluentValidation(config =>
      {
        config.RegisterValidatorsFromAssemblyContaining<Create>();
      });
      services.AddApplicationService(_config);
      services.AddIdentityService(_config);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseMiddleware<ExceptionMiddleware>();
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
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
      }
      else
      {
        app.Use(async (context, next) =>
        {
          context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
          await next.Invoke();
        });
      }

      // app.UseHttpsRedirection();

      app.UseRouting();

      app.UseDefaultFiles();
      app.UseStaticFiles();

      app.UseCors("CorsPolicy");

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<ChatHub>("/chat");
        endpoints.MapFallbackToController("Index", "Fallback");
      });
    }
  }
}
