using everydayapi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace everydayapi.Controllers
{
	[Authorize]
	[Route("api/files")]
	[ApiController]
	public class FilesController
	{
		private Context _context;
		public FilesController(Context context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<object> GetAll()
		{
			return await this._context.Files.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<object> GetAllByProjectId(long id)
		{
			return await this._context.Files.Where(f => f.project_id == id).ToListAsync();
		}

		[HttpPost]
		public async Task<object> Post(File file)
		{
			try
			{
				_context.Files.Add(file);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, file);
			}
			catch
			{
				_context.Entry(file).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, file);
			}

		}

		[HttpPut("{id}")]
		public async Task<object> Put(int id, File file)
		{
			if (id != file.id)
			{
				return "Error ids do not match";
			}

			try
			{
				_context.Files.Update(file);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, file);
			}
			catch
			{
				_context.Entry(file).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, file);
			}
		}

		[HttpDelete("{id}")]
		public async Task<object> Delete(int id)
		{
			File fileToDelete = await _context.Files.AsNoTracking().FirstOrDefaultAsync(f => f.id == id);

			try
			{
				_context.Files.Remove(fileToDelete);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, id);
			}
			catch
			{
				_context.Entry(fileToDelete).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, id);
			}
		}
	}
}
