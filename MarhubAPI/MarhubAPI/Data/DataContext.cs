using Microsoft.EntityFrameworkCore;
using MarhubAPI.Models;

namespace MarhubAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options) { }
        public DbSet<Note> Notes => Set<Note>();
    }
}
