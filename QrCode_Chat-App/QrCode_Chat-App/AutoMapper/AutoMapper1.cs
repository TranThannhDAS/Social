using AutoMapper;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.Models;

namespace QrCode_Chat_App.AutoMapper
{
    public class AutoMapper1 : Profile
    {
        public AutoMapper1() 
        {
            CreateMap<CreateQrCodeDto, QrCode>().ReverseMap();
            CreateMap<UserInputDto, User>().ReverseMap();
        }
    }
}
