import { Grid, Paper, Avatar, TextField, Typography } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { loginService } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { showSuccessToast } from '../SnackBar';

const Signin = () => {
    const navigate = useNavigate();
    const paperStyle = { padding: 20, height: '70vh', margin: '20px auto', width: '300px' }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const check = { marginTop: '50px' };
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const btnstyle={margin:'8px 0'}
    const [username, setUsername] = useState('');
    const [password,setPassword] = useState('');
    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }
    const handleChangePass = (e) => {
        setPassword(e.target.value);
    }
    // useEffect(()=>{ 
    //       console.log(username);
    //       console.log(password);
    // }, [username,password])
    const handleSubmit = async (e) => {
     e.preventDefault();
    var response = await loginService("User/Login",{
            username,
            password,
        });
        if(response.status == 200 && response.data.token){
            var token = response.data.token;
            // Giả định bạn có một token JWT
const token2 = token;

// Tách token bằng dấu chấm và lấy phần thứ hai (payload)
const base64Url = token2.split('.')[1];

// Thay thế các ký tự không an toàn trong URL bằng ký tự tương ứng và decode nó từ Base64
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const payload = JSON.parse(atob(base64));

const sid = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];

// { "userId": "1234567890", "name": "Juno_okyo", "iat": 1516239022 }
            var refreshToken = response.data.refreshToken;
            // Lưu trữ vào localStorage
            localStorage.setItem('token',token);
            localStorage.setItem('refreshToken',refreshToken);
            localStorage.setItem('ID',sid);
            showSuccessToast("Login thành công");
            navigate('/upload', { replace: true }); 
        }
    }
    return (
        <Grid container>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <Avatar sx={{ bgcolor: deepPurple[500] }} style={avatarStyle}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <form onSubmit={handleSubmit}>
                <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth margin="normal" onChange={handleChangeUsername} required/>
                    <TextField id="outlined-basic" label="PassWord" variant="outlined" fullWidth type='password'margin="normal" onChange={handleChangePass} required/>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth >Login</Button>
                </form>
                   
                <Typography >
                     <Link href="#" >
                        Forgot password ?
                </Link>
                </Typography>
                <Typography > Do you have an account ?
                     <Link href="/signUp" >
                        Sign Up 
                </Link>
                </Typography>
            </Paper>
        </Grid>
    );
}
export default Signin;