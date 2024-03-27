using System.ComponentModel.DataAnnotations;

namespace QrCode_Chat_App.Dtos
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        public string? Username { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string? Password { get; set; }
    }
}
