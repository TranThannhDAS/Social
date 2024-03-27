using System.ComponentModel.DataAnnotations;

namespace QrCode_Chat_App.Dtos
{
    public class UserInputDto
    {
        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Pass { get; set; }
        public int RoleId { get; set; } = 1;
    }
}
