using QrCode_Chat_App.Dtos;

namespace QrCode_Chat_App.HanldeFile
{
    public interface IFile
    {
        string Upload_File(IFormFileCollection files, Guid code);
        // files sẽ thêm mới, path sẽ giữ nguyên(sẽ xóa những file mà không có trong path)
        string Update_File(IFormFileCollection files, string[] paths, Guid code);
        string Delete_File(Guid code, string path);
        List<FilesOutputDto> GetUrlImage(Guid code_random);
        string Delete_All(Guid code);
    }
}
