import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import './showQrCode.scss';
import { get } from '../ultis/request';
import { FaDownload } from "react-icons/fa";
import { useParams } from 'react-router-dom';

const mockFiles = [
  { filename: 'meeting-notes.txt', id: 1 },
  { filename: 'project-specifications-long-name-example-you-can-see.pdf', id: 2 },
  { filename: 'design-mockups.sketch', id: 3 },
  { filename: 'design-mockups.sketch', id: 3 }

];
const warp = {
}
const containerStyle = {
  border: '1px solid #17a2b8',
  borderRadius: '4px',
  padding: '10px',
  marginBottom: '10px',
  color: '#17a2b8', // Chủ đạo màu xanh
  width: '700px', // Đây là chiều rộng bạn muốn thêm
};

const fileLabelStyle = {
  display: 'block', // Sử dụng block để label chiếm toàn bộ chiều rộng
  padding: '5px 10px',
  margin: '5px 0',
  border: '1px solid #17a2b8', // Màu viền xanh
  borderRadius: '4px',
  color: '#17a2b8', // Màu chữ xanh
  fontSize: '1rem', // Size chữ tiêu chuẩn
  wordWrap: 'break-word', // Xuống dòng nếu text quá dài
};

const eyeIconStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  fontSize: '20px',
  color: '#17a2b8', // Màu xanh của icon
};

const textStyle = {
  display: 'block', // Sữ dụng block để đảm bảo text xuống dòng nếu quá dài
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap', // Ngăn không cho text xuống dòng tự động trong trường hợp text không quá dài
  padding: '0 30px 0 0', // Đủ không gian cho icon
};

const ShowQrCode = (props) => {
  const { id} = useParams();
  const [resultInfo,setResultInfo] = useState({});
  const [resultPath,setResultPath] = useState([]);
  let uuid;
  if(id){
    uuid = id;
  }else{
    uuid = props.id
  }
  var url = window.location.protocol + '//' + window.location.host;  
  const handleClick = fileId => {
    // lưu fileID vào session
    sessionStorage.setItem('fileId', fileId);
    const path = fileId.split("/");
    const url2 = url + "/" + path[path.length - 2] + "/" + path[path.length - 1];
    window.open(url2, '_blank');
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(`QrCode/GetQrCodeById/${uuid}`);
        setResultInfo(response.result);
        setResultPath(response.paths);
        // Xử lý dữ liệu response ở đây
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[uuid]);
  // useEffect(()=>{
  //        console.log(resultInfo);
  //        console.log(resultPath);
  // },[resultInfo,resultPath])
  console.log(`${url}/${uuid}`);
  return (
    <div className="container" style={containerStyle}>
      <h3>Thông tin khởi tạo</h3>
      {resultInfo && ( // Chỉ render khối này nếu resultInfo là truthy
      <>
        <p>Tên cuộc họp: {resultInfo.name}</p>
        <p>Mô tả: {resultInfo.description}</p>
      </>
    )}
      <div className='warp-qrcode'>
      <h2>Đường dẫn url:</h2>
      {/* Rest of your component */}
      <a href={`${url}/${uuid}`}>{`${url}/${uuid}`}</a>
      </div>   
      <div>
     
      {/* Component QRCode */}
      <QRCode value={url} />
      {/* Liên kết tải xuống */}
      
    </div>
      <div style={{ marginTop: '25px' }}>
      {resultPath && resultPath.map((item, index) => (
  <div key={index}>
    <label style={fileLabelStyle}>
      <div style={eyeIconStyle}>
        {/* Một số nội dung */}
      </div>
      <div className='warp-qrcode'>
        <span onClick={() => handleClick(item.file)} style={textStyle} target="_blank" rel="noopener noreferrer">{item.file_name}</span>   
        <a href={item.file} download>
          <FaDownload className='download'/> 
        </a>      
      </div>      
    </label>
    {/* Bọc ShowFile trong Provider */}
   
  </div>
))}

      </div>
     
    </div>
  );
};

export default ShowQrCode;
