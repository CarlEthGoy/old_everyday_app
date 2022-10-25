using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using everydayapi.Managers;
using everydayapi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace everydayapi.Controllers
{
	[Route("api/auth")]
	[ApiController]
	public class UsersController
	{
		private Context _context;
		private IEnumerable<Claim> GetUserClaims(User user)
		{
			IEnumerable<Claim> claims = new Claim[]
			{
				new Claim(ClaimTypes.Name, user.firstName + " " + user.lastName),
				new Claim("USER_NAME", user.username),
				new Claim(ClaimTypes.Email, user.email)
			};
			return claims;
		}


		public UsersController(Context context)
		{
			_context = context;
		}

		//[HttpGet("GenerateHash/{password}")]
		//public string GenerateHash(string password) 
		//{
		//	return CryptographyService.Hash(password);
		//}

		[HttpPost]
		public async Task<object> Login(LoginInfos loginInfos)
		{
			User user = await _context.Users.FirstOrDefaultAsync(u => u.email == loginInfos.email);
			if (user == null)
			{
				return new CustomMessage("Error!", true, null);
			}

			if (CryptographyService.Verify(loginInfos.password, user.password))
			{
				var key = Encoding.ASCII.GetBytes("XCAP05H6LoKvbRRa/QkqLNMI7cOHguaRyHzyg7n5qEkGjQmtBhz4SzYh4Fqwtyi3KJHlSXKPwVu2+bXr6CtpgQ==");
				//Generate Token for user 
				var JWToken = new JwtSecurityToken(
					issuer: "http://localhost:44302/",
					audience: "http://localhost:44302/",
					claims: GetUserClaims(user),
					notBefore: new DateTimeOffset(DateTime.Now).DateTime,
					expires: new DateTimeOffset(DateTime.Now.AddDays(1)).DateTime,
					//Using HS256 Algorithm to encrypt Token
					signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key),
										SecurityAlgorithms.HmacSha256Signature)
				);
				var token = new JwtSecurityTokenHandler().WriteToken(JWToken);
				return new CustomMessage("Success!", false, token);
			}
			return new CustomMessage("Error!", true, null);
		}
	}
}