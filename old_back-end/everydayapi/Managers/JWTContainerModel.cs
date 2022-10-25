using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace everydayapi.Models
{
	public class JWTContainerModel : IAuthContainerModel
	{
		public int ExpireMinutes { get; set; } = 10080; //7days
		public string SecretKey { get; set; } = "TW9zaGVFcmV6UHJpdmF0ZUtleQ==";
		public string SecurityAlgorithm { get; set; } = SecurityAlgorithms.HmacSha256Signature;

		public Claim[] Claims { get; set; }
	}
}
