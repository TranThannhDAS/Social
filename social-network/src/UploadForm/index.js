import Button from '@mui/material/Button'
import './UploadForm.scss';
import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '../SnackBar';
import ShowQrCode from '../showQrCode';
import { post } from '../ultis/request';

const UploadForm = () => {   
  const [QrID, setQrID] = useState('');
  const [selectedFiles, setselectedFiles] = useState([]);
  const [name, setName] = useState('');
  const[desName, setdesName] = useState('');
  const[erorrmess, setErrorMess] = useState([]);
  const handleFile = (e) => {
    const files = [...selectedFiles, ...Array.from(e.target.files)];
    setselectedFiles(files);
  }
  const handleInputChange = (name, index) => {
   // Tạo một bản sao mới của mảng để không thay đổi trực tiếp mảng ban đầu
   const newFiles = [...selectedFiles];
  
   // Tạo một bản sao của đối tượng mà bạn muốn cập nhật
   const updatedItem = { ...newFiles[index] };
 
   // Cập nhật giá trị mới cho trường name của đối tượng đó
   updatedItem.name = name;
 
   // Gán đối tượng đã cập nhật trở lại vị trí tương ứng trong mảng
   newFiles[index] = updatedItem;
 
   // Sử dụng setState để cập nhật state
   setselectedFiles(newFiles);
  };
  const handleDelete = (index) => {
    const currentFiles = [...selectedFiles];
    const updatedItem = currentFiles[index];
    var newFiles = currentFiles.filter(check => check !== updatedItem);
    setselectedFiles(newFiles);

  }
  const viewFile = () => {
    const fileElements = selectedFiles.map((item, index) => (
      <div key={index} className="file-name__item">
        <input value={item.name} type='text' onChange={(e) => handleInputChange(e.target.value, index)}/> 
        <span className="delete-button" onClick={() => handleDelete(index)}>Xóa</span>
      </div>
    ));
    return fileElements;
    };
    const handleChangeName = (e) =>{
     setName(e.target.value);
    }
    const handleChangeDesName = (e) =>{
      setdesName(e.target.value);
     }
    //  useEffect(() => {
    //   console.log('Name:', name);
    //   console.log('Description:', desName);
    //   console.log('Selected files:', selectedFiles);
    // }, [name, desName, selectedFiles]);
   const handleSubmit = async(e) => {
    e.preventDefault();
    var formData = new FormData();
    if(selectedFiles.length > 0){ 
      for(let i = 0; i < selectedFiles.length; i ++){
        formData.append("files", selectedFiles[i]);
      }
    }
    //
    formData.append("Name", name);
    formData.append("Description", desName);
    formData.append("UserID", localStorage.getItem("ID"));
    //Test 401
      var response = await post('QrCode/UploadFile', formData);
      console.log(response.result + "12321");  
      if(response.result == "Chỉ chấp nhận file có định dạng Excel, PDF,PNG,GIF hoặc TXT"){
        showErrorToast(response.result);
      }
      else{
        showSuccessToast("Thành công");
        setQrID(response.result);
      }
    }
   return(
    <>
    <div className='all-warp'>
    <form className='warp' onSubmit={handleSubmit}>
      <h3 className='khoitaonhanh'>Khởi tạo nhanh</h3>
<div className='warp-input'>
<span className='name-span'>Tên dự án</span>
<input type='text' placeholder='Tên dự án' className='input-name' onChange={(e) => handleChangeName(e)} required/>
</div>
<div className='warp-input'>
<span className='name-span'>Mô tả dự án</span>
<input type='text' placeholder='Mô tả dự án' className='input-name' onChange={(e) => handleChangeDesName(e)} required/>
</div>
{/* nút nhấn file */}
<label htmlFor="btn-upload" className='button-label'>
  <input
    id="btn-upload"
    name="btn-upload"
    style={{ display: 'none' }}
    type="file"
    onChange={handleFile}
    multiple
    required
    />
  <Button
    className="btn-choose"
    variant="outlined"
    component="span" >
     Choose Files
  </Button>
</label>
<div className="file-name">
{selectedFiles && selectedFiles.length > 0 ? viewFile() : null}
</div>
<Button type='submit' variant="contained">Submit</Button>
</form>    
<div>
  { QrID && <ShowQrCode id={QrID}/>}
</div>
    </div>
  
    </>
   )
}
export default UploadForm;