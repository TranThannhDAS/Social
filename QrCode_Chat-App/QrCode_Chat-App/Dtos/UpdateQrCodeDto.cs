namespace QrCode_Chat_App.Dtos
{
    public class UpdateQrCodeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFileCollection files { get; set; }
    }
}
