using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QrCode_Chat_App.Dtos;
using QrCode_Chat_App.Models;
using QrCode_Chat_App.Services;

namespace QrCode_Chat_App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QrCodeController : ControllerBase
    {
        public QrCodeService qrCodeService { get; set; }
        public QrCodeController(QrCodeService _qrCodeService)
        {
            qrCodeService = _qrCodeService;
        }
        [HttpGet("{Userid}")]
        public ActionResult<object> Get(int Userid)
        {
            var result = qrCodeService.GetAllDataQrCode(Userid);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public ActionResult<object> GetQrCodeById(Guid id)
        {
            var result = qrCodeService.GetDataQrCodeByID(id);
            return Ok(result);
        }
        [Authorize]
        [HttpPost]
        public ActionResult<string> UploadFile([FromForm] CreateQrCodeDto QrcodeDto)
        {
            var result = qrCodeService.Upload_File(QrcodeDto);
            return Ok(new
            {
                result
            });
        }
        [HttpDelete]
        public ActionResult Delete_File(DeleteFileInputDto deleteFileInputDto)
        {
            string result = qrCodeService.Delete_File(deleteFileInputDto);
            return Ok(new
            {
                result
            });
        }
        [HttpDelete]
        public ActionResult Delete_All(Guid code)
        {
            string result = qrCodeService.Delete_All(code);
            return Ok(new
            {
                result
            });
        }
        [HttpPut("{code}")]
        public ActionResult Update([FromForm]Guid code, UpdateQrCodeDto updateQrCodeDto)
        {
            string result = qrCodeService.Update(code, updateQrCodeDto);

            return Ok(new
            {
                result
            });
        }
    }
}
