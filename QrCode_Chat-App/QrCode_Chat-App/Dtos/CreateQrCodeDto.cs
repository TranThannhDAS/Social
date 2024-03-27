namespace QrCode_Chat_App.Dtos
{
    public class CreateQrCodeDto
    {
        public string Name { get; set; }    
        public string Description { get; set; }
        public int UserID { get; set; } 
        public IFormFileCollection files { get; set; }
    }
}
