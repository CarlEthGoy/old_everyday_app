using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	public interface IAuthContainerModel
	{
		string SecretKey { get; set; }
		string SecurityAlgorithm { get; set; }
		int ExpireMinutes { get; set; }
		Claim[] Claims { get; set; }
	}
}
