using AutoMapper;
using Microsoft.Identity.Client;
using QrCode_Chat_App.Data;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.Models;

namespace QrCode_Chat_App.Services
{
    public class UserService
    {
        public DataContext dataContext { get; set; }
        public IMapper mapper { get; set; }
        public UserService(DataContext _dataContext, IMapper _mapper)
        {
            dataContext = _dataContext;
            mapper = _mapper;
        }
        public object GetAllUser()
        {
            var List_user = dataContext.Users.ToList();
            return List_user;
        }
        public string CreateUser(UserInputDto userInputDto)
        {
            using (var transaction = dataContext.Database.BeginTransaction())
            {
                try
                {
                    User User = mapper.Map<UserInputDto, User>(userInputDto);
                    if (User == null)
                    {
                        return "Có lỗi xảy ra";
                    }
                    User.Pass = BCrypt.Net.BCrypt.HashPassword(userInputDto.Pass);
                    dataContext.Users.Add(User);
                    int check = dataContext.SaveChanges();
                    if (check > 0)
                    {
                        transaction.Commit();
                        return "Thêm thành công";
                    }
                    return "Thêm thất bại";
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public string DeleteUser(int Id)
        {
            using (var transaction = dataContext.Database.BeginTransaction())
            {
                try
                {
                    var getById = dataContext.Users.FirstOrDefault(x => x.Id == Id);
                    if (getById == null)
                    {
                        return "Không tìm thấy user";
                    }
                    dataContext.Users.Remove(getById);
                    int check = dataContext.SaveChanges();
                    if (check > 0)
                    {
                        transaction.Commit();

                        return "Xóa thành công";
                    }
                    return "Xóa thất bại";
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
            public string UpdateUser(int Id, UpdateUserDto updateUserDto)
            {
                using (var transaction = dataContext.Database.BeginTransaction())
                {
                    try
                    {
                        var getById = dataContext.Users.FirstOrDefault(x => x.Id == Id);
                        if (getById == null)
                        {
                            return "Không tìm thấy user";
                        }
                        getById.Pass = updateUserDto.Pass;
                        dataContext.Users.Update(getById);
                        int check = dataContext.SaveChanges();
                        if (check > 0)
                        {
                        transaction.Commit();

                        return "Chỉnh sửa thành công";
                        }
                        return "Chỉnh sửa thất bại";
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }     
    }
}
