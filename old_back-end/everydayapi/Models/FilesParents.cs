using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Models
{
	[Table("files_parent")]
	public class FilesParents
	{
		[Key]
		public long id { get; set; }
		[ForeignKey("file")]
		public long file_id { get; set; }
		[ForeignKey("parent")]
		public long parent_id { get; set; }

		public File file { get; set; }
		public File parent { get; set; }
	}
}
