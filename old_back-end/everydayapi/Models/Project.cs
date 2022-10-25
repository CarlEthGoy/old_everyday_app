using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	[Table("projects")]
	public class Project
	{
		[Key]
		public long id {get; set;}
		public string title { get; set; }
		public string json { get; set; }
	}
}
