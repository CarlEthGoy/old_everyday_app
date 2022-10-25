using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	[Table("files_childs")]
	public class FilesChilds
	{
		public long id { get; set; }
		[ForeignKey("file")]
		public long file_id { get; set; }
		[ForeignKey("child")]
		public long child_id { get; set; }
		[NotMapped]
		public File file { get; set; }
		[NotMapped]
		public File child { get; set; }
	}
}
