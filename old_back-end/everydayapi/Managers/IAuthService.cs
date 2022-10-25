
using everydayapi.Models;
using System.Collections.Generic;
using System.Security.Claims;

namespace everydayapi.Managers
{
	public interface IAuthService
	{
		string SecretKey { get; set; }
		bool IsTokenValid(string token);
		string GenerateToken(IAuthContainerModel model);
		IEnumerable<Claim> GetTokenClaims(string token);
	}
}
