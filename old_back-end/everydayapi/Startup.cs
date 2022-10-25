using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using everydayapi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace everydayapi
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }
		readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy(MyAllowSpecificOrigins,
				builder =>
				{
					builder.WithOrigins("*")
						.AllowAnyHeader()
						.AllowAnyMethod();
				});
			});

			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
			services.AddDbContext<Context>(options => options.UseSqlServer(Configuration.GetConnectionString("Context")));

			//Provide a secret key to Encrypt and Decrypt the Token
			var SecretKey = Encoding.ASCII.GetBytes("XCAP05H6LoKvbRRa/QkqLNMI7cOHguaRyHzyg7n5qEkGjQmtBhz4SzYh4Fqwtyi3KJHlSXKPwVu2+bXr6CtpgQ==");
			//Configure JWT Token Authentication
			services.AddAuthentication(auth =>
			{
				auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(token =>
			{
				token.RequireHttpsMetadata = false;
				token.SaveToken = true;
				token.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					//Same Secret key will be used while creating the token
					IssuerSigningKey = new SymmetricSecurityKey(SecretKey),
					ValidateIssuer = true,
					//Usually, this is your application base URL
					ValidIssuer = "http://localhost:44302/",
					ValidateAudience = true,
					//Here, we are creating and using JWT within the same application.
					//In this case, base URL is fine.
					//If the JWT is created using a web service, then this would be the consumer URL.
					ValidAudience = "http://localhost:44302/",
					RequireExpirationTime = true,
					ValidateLifetime = true,
					ClockSkew = TimeSpan.Zero
				};
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseHsts();
			}
            app.UseAuthentication();
			app.UseCors(MyAllowSpecificOrigins);
			app.UseHttpsRedirection();
			app.UseMvc();
		}
	}
}
