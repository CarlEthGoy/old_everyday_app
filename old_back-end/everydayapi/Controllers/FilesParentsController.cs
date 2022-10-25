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
	[Route("api/files-parents")]
	[ApiController]
	public class FilesParentsController
	{
		private Context _context;
		public FilesParentsController(Context context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<object> GetAll()
		{
			return await this._context.FilesParents.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<object> GetAllByProjectId(long id)
		{
			return await this._context.FilesParents.Include(f => f.file).Where(f => f.file.project_id == id).ToListAsync();
		}

		[HttpPost]
		public async Task<object> Post(FilesParents filesParents)
		{
			try
			{
				_context.FilesParents.Add(filesParents);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, filesParents);
			}
			catch
			{
				_context.Entry(filesParents).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, filesParents);
			}

		}

		[HttpPut("{id}")]
		public async Task<object> Put(int id, FilesParents filesParents)
		{
			if (id != filesParents.id)
			{
				return new CustomMessage("Error ids do not match", true, filesParents);
			}

			try
			{
				_context.FilesParents.Update(filesParents);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, filesParents);
			}
			catch
			{
				_context.Entry(filesParents).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, filesParents);
			}
		}

		[HttpDelete("{id}")]
		public async Task<object> Delete(int id)
		{
			FilesParents fileToDelete = await _context.FilesParents.AsNoTracking().FirstOrDefaultAsync(f => f.id == id);

			try
			{
				_context.FilesParents.Remove(fileToDelete);
				await _context.SaveChangesAsync();
				return new CustomMessage("Succes", false, id);
			}
			catch
			{
				_context.Entry(fileToDelete).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, id);
			}
		}
	}
}
