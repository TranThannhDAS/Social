using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QrCode_Chat_App.Data;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.Models;
using QrCode_Chat_App.Services;
using System.Data;

namespace QrCode_Chat_App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public AuthenticationService authenticationService {  get; set; }
        public UserService userService { get; set; }

        public DataContext dataContext { get; set; }
        public UserController(DataContext _dataContext, AuthenticationService _authenticationService, UserService _userService) 
        {
            dataContext = _dataContext;
            userService = _userService;
            authenticationService = _authenticationService;
        }
        [HttpPost]
        public  ActionResult Create(UserInputDto userInputDto)
        {
           var result = userService.CreateUser(userInputDto);
           return Ok( new { result });
        }
        [HttpPost]
        public ActionResult Login(LoginDto loginDto)
        {
            var result = authenticationService.Login(loginDto);
            return Ok(result);
        }
        [HttpPost]
        public ActionResult RefreshToken(Token token)
        {
           var result = authenticationService.RefreshToken(token);
            return Ok(result);
        }
    }
}
