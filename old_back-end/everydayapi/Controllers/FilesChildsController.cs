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
	[Route("api/files-chilsd")]
	[ApiController]
	public class FilesChildsController
	{
		private Context _context;
		public FilesChildsController(Context context)
		{
			_context = context;
		}


		[HttpGet]
		public async Task<object> GetAll()
		{
			return await this._context.FilesChilds.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<object> GetAll(long id)
		{
			return await this._context.FilesChilds.FirstOrDefaultAsync(f => f.id == id);
		}

		[HttpPost]
		public async Task<object> Post(FilesChilds fileChild)
		{
			try
			{
				_context.FilesChilds.Add(fileChild);
				await _context.SaveChangesAsync();
				return "Success";
			}
			catch
			{
				_context.Entry(fileChild).State = EntityState.Unchanged;
				return "Error";
			}

		}

		[HttpPut("{id}")]
		public async Task<object> Put(int id, FilesChilds fileChild)
		{
			if (id != fileChild.id)
			{
				return "Error ids do not match";
			}

			try
			{
				_context.FilesChilds.Update(fileChild);
				await _context.SaveChangesAsync();
				return Microsoft.AspNetCore.Http.StatusCodes.Status200OK;
			}
			catch
			{
				_context.Entry(fileChild).State = EntityState.Unchanged;
				return "Error";
			}
		}

		[HttpDelete("{id}")]
		public async Task<object> Delete(int id)
		{
			FilesChilds fileChildToDelete = _context.FilesChilds.Find(id);

			try
			{
				_context.FilesChilds.Remove(fileChildToDelete);
				await _context.SaveChangesAsync();
				return "Succes";
			}
			catch
			{
				_context.Entry(fileChildToDelete).State = EntityState.Unchanged;
				return "Error";
			}
		}
	}
}