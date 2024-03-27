namespace QrCode_Chat_App.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Pass { get; set; }
        public int RoleId { get; set; } 
        public Role? Role { get; set; }  
        public string? RefreshToken { get; set; }
        public DateTime? ExpireTime { get; set; }
        public ICollection<QrCode> QrCodes{ get; set; }
    }
}
