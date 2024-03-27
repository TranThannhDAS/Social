import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { del, get } from '../ultis/request';
import { Link } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../SnackBar';

function ShowAllQR() {
    const [result, setResult] = useState([]);
    const [render, setRender] = useState(false);
    var url = window.location.protocol + '//' + window.location.host;
    useEffect(() => {
        const fetchData = async () => {
            var response = await get('QrCode/Get/' + localStorage.getItem('ID'));
            setResult(response);
        };

        fetchData();

        // Since you're not performing any cleanup here, you can simply omit the return statement.
    }, [render]);
   
      const handleDelete = async(id) => {
        // Gọi hàm deleteItem từ sự kiện onClick        
         var response = await del(`QrCode/Delete_All?code=${id}`);
         if(response.result == "Thành công"){
            setRender(true);
            showSuccessToast("Xóa thành công")
         }else{
            showErrorToast("Xóa thất bại")
         }
      };
    return (<table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>QRCODE</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>TÊN DỰ ÁN</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>MÔ TẢ</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>HÀNH ĐỘNG</th>
            </tr>
        </thead>
        <tbody>
            {result && result.map((item, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', width: '100px' }}> <QRCode value={`${url}/${item.id}`} /></td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', width: '200px' }}>{item.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.description}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        <Link to={`/${item.id}`}>
                            <button
                                style={{
                                    padding: '10px 15px',
                                    fontSize: '16px',
                                    color: 'white',
                                    backgroundColor: '#4CAF50',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    margin: '5px'
                                }}
                            >
                                Xem
                            </button>
                        </Link>

                        <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                                padding: '10px 15px',
                                fontSize: '16px',
                                color: 'white',
                                backgroundColor: '#f44336',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                margin: '5px'
                            }}
                        >
                            Xóa
                        </button>

                        <button
                            onClick={() => console.log('Chỉnh Sửa')}
                            style={{
                                padding: '10px 15px',
                                fontSize: '16px',
                                color: 'white',
                                backgroundColor: '#008CBA',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                margin: '5px'
                            }}
                        >
                            Chỉnh Sửa
                        </button>
                    </td>
                </tr>
            ))}

            {/*... thêm các hàng khác nếu cần */}
        </tbody>
    </table>);
}

export default ShowAllQR;