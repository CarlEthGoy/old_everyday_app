using Microsoft.EntityFrameworkCore;


namespace everydayapi.Models
{
	public class Context : DbContext
	{
		public Context(DbContextOptions<Context> options) : base(options)
		{
		}

		public DbSet<File> Files  { get; set; }
		public DbSet<FileContent> FilesContent { get; set; }
		public DbSet<Project> Projects { get; set; }
		public DbSet<FilesChilds> FilesChilds { get; set; }
		public DbSet<FilesParents> FilesParents { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<File>().HasKey(f => new { f.id });
			modelBuilder.Entity<FileContent>().HasKey(h => new { h.id });
			modelBuilder.Entity<Project>().HasKey(t => new { t.id });
			modelBuilder.Entity<FilesChilds>().HasKey(t => new { t.id });
			modelBuilder.Entity<FilesParents>().HasKey(t => new { t.id });
			modelBuilder.Entity<User>().HasKey(t => new { t.id });
		}
	}
}
