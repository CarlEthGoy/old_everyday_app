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
	[Route("api/projects")]
	[ApiController]
	public class ProjectsController
	{
		private Context _context;
		public ProjectsController(Context context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<object> GetAll()
		{
			return await this._context.Projects.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<object> GetAll(long id)
		{
			return await this._context.Projects.FirstOrDefaultAsync(f => f.id == id);
		}

		[HttpPost]
		public async Task<object> Post(Project project)
		{
			try
			{
				_context.Projects.Add(project);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, project);
			}
			catch (Exception e)
			{
				_context.Entry(project).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, project);

			}

		}

		[HttpPut("{id}")]
		public async Task<object> Put(int id, Project project)
		{
			if (id != project.id)
			{
				return "Error ids do not match";
			}

			try
			{
				_context.Projects.Update(project);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, project);
			}
			catch
			{
				_context.Entry(project).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, project);
			}
		}

		[HttpDelete("{id}")]
		public async Task<object> Delete(int id)
		{
			Project projectToDelete = await _context.Projects.AsNoTracking().FirstOrDefaultAsync(p => p.id == id);

			try
			{
				_context.Projects.Remove(projectToDelete);
				await _context.SaveChangesAsync();
				return new CustomMessage("Success", false, id);
			}
			catch
			{
				_context.Entry(projectToDelete).State = EntityState.Unchanged;
				return new CustomMessage("Error", true, id);
			}
		}
	}
}
