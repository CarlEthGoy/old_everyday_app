using everydayapi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Controllers
{
	[Authorize]
	[Route("api/files-content")]
	[ApiController]
	public class FileContentsContentContentController
	{
		private Context _context;
		public FileContentsContentContentController(Context context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<object> GetAll()
		{
			return await this._context.FilesContent.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<object> GetAll(long id)
		{
			return await this._context.FilesContent.FirstOrDefaultAsync(f => f.id == id);
		}

		[HttpPost]
		public async Task<object> Post(FileContent fileContent)
		{
			try
			{
				_context.FilesContent.Add(fileContent);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, fileContent.id);
			}
			catch
			{
				_context.Entry(fileContent).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, fileContent);
			}

		}

		[HttpPut("{id}")]
		public async Task<object> Put(int id, FileContent fileContent)
		{
			if (id != fileContent.id)
			{
				return "Error ids do not match";
			}

			try
			{
				_context.FilesContent.Update(fileContent);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, fileContent);
			}
			catch
			{
				_context.Entry(fileContent).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, fileContent);
			}
		}

		[HttpDelete("{id}")]
		public async Task<object> Delete(int id)
		{
			FileContent fileContentToDelete = await _context.FilesContent.AsNoTracking().FirstOrDefaultAsync(f => f.id == id);

			try
			{
				_context.FilesContent.Remove(fileContentToDelete);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, id);
			}
			catch
			{
				_context.Entry(fileContentToDelete).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, id);
			}
		}
	}
}
