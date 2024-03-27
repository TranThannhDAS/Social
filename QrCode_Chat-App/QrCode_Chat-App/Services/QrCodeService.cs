using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using QrCode_Chat_App.Data;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.HanldeFile;
using QrCode_Chat_App.Models;
using System;
using System.IO;

namespace QrCode_Chat_App.Services
{
    public class QrCodeService
    {
        public DataContext dataContext;
        public IFile file { get; set; }
        public IMapper mapper { get; set; }
        public QrCodeService(IFile _file, DataContext _dataContext, IMapper _mapper)
        {
            file = _file;
            dataContext = _dataContext;
            mapper = _mapper;
        }
        public object GetDataQrCodeByID(Guid code)
        {
            var result = dataContext.Qrcode.Where(p=> p.Id == code).FirstOrDefault();
            List<FilesOutputDto> paths = new List<FilesOutputDto>();
            if (result != null)
            {
               paths =  file.GetUrlImage(code);
            }
            return 
             new { 
                 result,
                 paths
            };
        }
        public object GetAllDataQrCode(int Userid)
        {
            var result = dataContext.Qrcode.Where(p => p.UserID == Userid).ToList();
            return result;
        }
        public object Upload_File(CreateQrCodeDto qrCodeDto)
        {
         
            using (var transaction = dataContext.Database.BeginTransaction())
            {
                try
                {
                    QrCode qrCode = new QrCode();
                    qrCode = mapper.Map<CreateQrCodeDto, QrCode>(qrCodeDto);
                    dataContext.Qrcode.Add(qrCode);
                    var check = dataContext.SaveChanges();
                    //Upload File vào thư mục dự án
                    var upload_File = file.Upload_File(qrCodeDto.files, qrCode.Id);
                    if (check > 0 && upload_File == "Thành công")
                    {
                        transaction.Commit();
                        return qrCode.Id;
                    }
                    else
                    {
                        // Nếu có lỗi xảy ra trong quá trình thêm QrCode hoặc upload file, rollback transaction và trả về thông báo lỗi.
                        transaction.Rollback();
                        return upload_File;
                    }
                }
                catch (Exception ex)
                {
                    // Nếu có lỗi xảy ra trong quá trình thực hiện transaction, rollback transaction và trả về thông báo lỗi.
                    transaction.Rollback();
                    return "Lỗi: " + ex.Message;
                }
            }
        }
        public string Delete_File(DeleteFileInputDto deleteFileInputDto)
        {
           var result =  file.Delete_File(deleteFileInputDto.Id, deleteFileInputDto.Path);
            return result;
        }
        public string Delete_All(Guid code)
        {
            using(var transaction = dataContext.Database.BeginTransaction())
            {
                try
                {
                    var getById = dataContext.Qrcode.Where(p => p.Id == code).FirstOrDefault();
                    if (getById == null)
                    {
                        return "Không tìm thấy";
                    }
                    dataContext.Qrcode.Remove(getById);
                    int check = dataContext.SaveChanges();
                    string result_delete_file = file.Delete_All(code);
                    if (check > 0 && result_delete_file == "Xóa Thành công")
                    {
                        transaction.Commit();
                        return "Thành công";
                    }
                    else
                    {
                        // Nếu có lỗi xảy ra trong quá trình thêm QrCode hoặc upload file, rollback transaction và trả về thông báo lỗi.
                        transaction.Rollback();
                        return "Không thể thêm QrCode hoặc upload file";
                    }
                }catch(Exception ex) { transaction.Rollback(); return "Lỗi: " + ex.Message; }
            }
           
        }
        public string Update(Guid id, UpdateQrCodeDto updateQrCodeDto )
        {
            var check_ID = dataContext.Qrcode.Where(p => p.Id == id).FirstOrDefault();
            if(check_ID == null)
            {
                return "Không tìm thấy QRCODE";
            }
            check_ID.Name = updateQrCodeDto.Name;
            check_ID.Description = updateQrCodeDto.Description;
            dataContext.Qrcode.Update(check_ID);
            int check = dataContext.SaveChanges();
            if(updateQrCodeDto.files != null)
            {
                string mess_file = file.Upload_File(updateQrCodeDto.files, id);
            }
            if(check > 0)
            {
                return "Thành công";
            }
            return "Thất bại";
        }
    }
}
