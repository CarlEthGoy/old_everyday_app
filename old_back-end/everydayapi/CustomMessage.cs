using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi
{
	public class CustomMessage
	{
		public string Message { get; set; }
		public bool Error { get; set; }
		public object Data { get; set; }

		public CustomMessage(string message, bool error, object data)
		{
			this.Message = message;
			this.Error = error;
			this.Data = data;
		}
	}
}
