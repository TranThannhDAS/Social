import { Grid, Paper, Avatar, TextField, Typography } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import './SignUp.scss'; // Import SCSS file
const SignUp = () => {
    const paperStyle = { padding: 20, height: '70vh', margin: '20px auto', width: '300px' }
    const avatarStyle = { backgroundColor: 'rgb(189 63 27)' }
    const check = { marginTop: '50px' };
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const btnstyle = { margin: '8px 0' }

    return (
        <>
         <Grid container>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                    <Avatar sx={{ bgcolor: deepPurple[500] }} style={avatarStyle}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h2>Sign Up</h2>
                </Grid>
                <div>
                    <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth margin="normal" />
                    <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth type='password'margin="normal" />
                    <TextField id="outlined-basic" label="Re-Password" variant="outlined" fullWidth type='password'margin="normal" />
                </div>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Login</Button>
                <Typography > Do you have an account ?
                    <Link href="/signIn" >
                        Sign In
                    </Link>
                </Typography>
            </Paper>
        </Grid>
        </>
       
    );
}
export default SignUp;