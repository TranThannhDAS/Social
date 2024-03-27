using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QrCode_Chat_App.Base;
using QrCode_Chat_App.Data;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace QrCode_Chat_App.Services
{
    public class AuthenticationService
    {
        public DataContext dataContext { get;set; }
        public IConfiguration Configuration { get; set; }
        public AuthenticationService(DataContext _datContext, IConfiguration _Configuration) 
        {
            dataContext = _datContext;
            Configuration = _Configuration;
        }
        public object Login(LoginDto loginDto)
        {
            var checkUsername =  dataContext.Users.Where(query => query.UserName.Equals(loginDto.Username)).FirstOrDefault();
            if (checkUsername != null)
            {
                var pass = BCrypt.Net.BCrypt.Verify(loginDto.Password, checkUsername.Pass);
                if (pass)
                {
                    var userRole = (from usr in dataContext.Users
                                    join role in dataContext.Roles on usr.RoleId equals role.Id
                                    where usr.Id == checkUsername.Id
                                    select new { RoleName = role.Role_Name, UserId = usr.Id }).FirstOrDefault();

                    if (userRole == null)
                    {
                        return new BaseResult(500, "Có lỗi xảy ra");
                       

                    }
                    string roleName = userRole.RoleName;
                    int userId = userRole.UserId;
                    var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, loginDto.Username),
                    new Claim(ClaimTypes.Sid, userId.ToString()),
                    new Claim(ClaimTypes.Role, roleName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                    var token = CreateToken(authClaims);
                    var refreshToken = GenerateRefreshToken();
                    _ = int.TryParse(Configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                    checkUsername.RefreshToken = refreshToken;
                    checkUsername.ExpireTime = DateTime.Now.AddDays(refreshTokenValidityInDays);
                    dataContext.Users.Update(checkUsername);
                    int check = dataContext.SaveChanges();
                    if (check > 0)
                    {
                        return new
                        {
                            Token = new JwtSecurityTokenHandler().WriteToken(token),
                            RefreshToken = refreshToken,
                            Expiration = token.ValidTo
                        };
                    }
                }
            }   
            return new
            {
                mess = "Login failed"
            }
                ;
        }
        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]));
            _ = int.TryParse(Configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: Configuration["JWT:ValidIssuer"],
                audience: Configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        public object RefreshToken(Token tokenModel)
        {
            try
            {
                if (tokenModel is null)
                {
                    return new BaseResult(500, "Invalid client request");
                }

                string? accessToken = tokenModel.AccessToken;
                string? refreshToken = tokenModel.RefreshToken;

                var principal = GetPrincipalFromExpiredToken(accessToken);
                if (principal == null)
                {
                    return new BaseResult(500, "Invalid client request");
                }

#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                string username = principal.Identity.Name;
#pragma warning restore CS8602 // Dereference of a possibly null reference.
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

                var user =  dataContext.Users.Where(query => query.UserName.Equals(username)).FirstOrDefault();


                if (user == null || user.RefreshToken != refreshToken || user.ExpireTime <= DateTime.Now)
                {
                    return new BaseResult(500, "Invalid client request");
                }

                var newAccessToken = CreateToken(principal.Claims.ToList());
                var newRefreshToken = GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                 dataContext.Users.Update(user);
                int check = dataContext.SaveChanges();

                return new
                {
                    accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                    refreshToken = newRefreshToken
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi");
            }
        }
        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }

    }
}
