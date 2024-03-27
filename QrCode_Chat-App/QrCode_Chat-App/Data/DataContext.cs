using Microsoft.EntityFrameworkCore;
using QrCode_Chat_App.Models;

namespace QrCode_Chat_App.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<QrCode> Qrcode { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }  
    }
}
