namespace QrCode_Chat_App.Models
{
    public class QrCode
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public int UserID { get; set; }
        public User? User { get; set; }
    }
}
