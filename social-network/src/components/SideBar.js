import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function SideBar() {
    return (
        <div  className="sidebarContainer">
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <div>
                {[...Array(50)].map((_, index) => ( // Duyệt từ 0 đến 49
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </Typography>
                                        {" — I'll be in your neighborhood doing errands this…"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {index < 49 && <Divider variant="inset" component="li" />} {/* Thêm Divider nếu index < 49 */}
                    </React.Fragment>
                ))}
            </div>
        </List>
        </div>
    );
}

export default SideBar;