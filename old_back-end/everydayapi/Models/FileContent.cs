using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	[Table("files_content")]
	public class FileContent
	{
		[Key]
		public long id { get; set; }
		public string title { get; set; }
		public string content { get; set; }
		public string json { get; set; }
	}
}
