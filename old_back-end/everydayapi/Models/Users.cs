using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	[Table("users")]
	public class Users
	{
		[Key]
		public long id { get; set; }
		public string username { get; set; }
		public string email { get; set; }
		public string password { get; set; }
		public string firstName { get; set; }
		public string lastName { get; set; }
	}
}
