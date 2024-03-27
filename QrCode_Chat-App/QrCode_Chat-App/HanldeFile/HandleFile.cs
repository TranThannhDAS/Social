using QrCode_Chat_App.Dtos;
using System.Linq;

namespace QrCode_Chat_App.HanldeFile
{
    public class HandleFile : IFile
    {
        private readonly IWebHostEnvironment environment;
        private IHttpContextAccessor httpContextAccessor;
        public HandleFile(IWebHostEnvironment environment, IHttpContextAccessor _httpContextAccessor)
        {

            this.environment = environment;
            this.httpContextAccessor = _httpContextAccessor;
        }
        private string GetFilepath(Guid random)
        {
            var Filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", random.ToString());
            return Filepath;
        }
        public List<FilesOutputDto> GetUrlImage(Guid code_random)
        {
            HttpRequest httpRequest = httpContextAccessor.HttpContext.Request;
            var Imageurl = new List<FilesOutputDto>();
            string hosturl = $"{httpRequest.Scheme}://{httpRequest.Host}{httpRequest.PathBase}";
            var path_img = new List<string>();
            try
            {
                string Filepath = GetFilepath(code_random);

                if (System.IO.Directory.Exists(Filepath))
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(Filepath);
                    FileInfo[] fileInfos = directoryInfo.GetFiles();
                    foreach (FileInfo fileInfo in fileInfos)
                    {
                        string filename = fileInfo.Name;
                        string imagepath;       


                        imagepath = Path.Combine(Filepath, filename);
                        if (System.IO.File.Exists(imagepath))
                        {
                            string _Imageurl = hosturl +"/"+ code_random.ToString() + "/" + filename;
                            Imageurl.Add(new FilesOutputDto
                            {
                                File = _Imageurl,
                                Path = Path.Combine("wwwroot", code_random.ToString(), filename),
                                File_name = filename
                            });
                        }


                    }
                }
                return Imageurl;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string Delete_File(Guid code, string path)
        {
            if (!File.Exists(path))
            {
                return "Không tìm thấy đường dẫn";
            }
            File.Delete(path);
            return "Xóa Thành công";
        }
        public string Delete_All(Guid code)
        {
            var File_path = GetFilepath(code);
            if (!Directory.Exists(File_path))
            {
                return "Không tìm thấy đường dẫn";
            }
            Directory.Delete(File_path, recursive: true);
            return "Xóa Thành công";
        }
        public string Update_File(IFormFileCollection files, string[] paths, Guid code)
        {
            var File_path = GetFilepath(code);
            if (!Directory.Exists(File_path))
            {
                return "Không tìm thấy đường dẫn";
            }
            string[] files_in_directory = Directory.GetFiles(File_path);
            //Sử dụng linQ để tìm kiếm path giống nhau
             var commonElements = paths.Intersect(files_in_directory);

            foreach (var element in commonElements)
            {
                Console.WriteLine(element);
            }
            return "12321";
        }

        public string Upload_File(IFormFileCollection files, Guid code)
        {
            
            var path = GetFilepath(code);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            foreach (IFormFile file in files)
            {
                if (file != null)
                {
                    // Lấy tên file và phần mở rộng của file
                    var fileName = Path.GetFileName(file.FileName);
                    var fileExtension = Path.GetExtension(fileName).ToLower();

                    // Danh sách các định dạng file hợp lệ
                    var allowedExtensions = new[] { ".xls", ".xlsx", ".pdf", ".txt",".png",".jpg",".gif" };

                    // Kiểm tra định dạng file
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return  "Chỉ chấp nhận file có định dạng Excel, PDF,PNG,GIF hoặc TXT";
                    }
                }
            }
                foreach (IFormFile file2 in files)
                {
               
                        string filePath = Path.Combine(path, file2.FileName);

                        // Tạo ra một stream để ghi dữ liệu vào file
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                  // Sao chép nội dung của file vào stream
                         file2.CopyTo(stream);
                        }
                    }
            return "Thành công";

        }

    }
}
