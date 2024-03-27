import React, { useEffect, useState } from 'react';
import { Box,Stack, Paper, InputBase, IconButton, List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function MessageBox() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Xin chào! 👋', sender: 'friend' },
        { id: 2, text: 'Chào bạn, chúng ta có thể trò chuyện!', sender: 'me' },
        // Các tin nhắn khác...
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = { id: messages.length + 1, text: inputMessage, sender: 'me' };
            setMessages([...messages, newMessage]);
            setInputMessage('');
        }
    };

    const handleInputKeypress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        // Scroll to the bottom of the message list every time messages update
        const messageList = document.getElementById('messageList');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
             <Box sx={{ width: '100%', height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <List id="messageList" sx={{ flexGrow: 1, overflowY: 'scroll', maxHeight: 'calc(100vh - 56px)', bgcolor: 'background.paper' }}>
            {messages.map((message) => (
                    <React.Fragment key={message.id}>
                        <ListItem alignItems="flex-start" sx={{ justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                            {message.sender === 'friend' && (
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                            )}
                            <ListItemText primary={message.text} sx={{ backgroundColor: message.sender === 'me' ? '#e9fdd5' : '#f0f0f0', borderRadius: '10px', padding: '5px 10px', maxWidth: '70%', wordWrap: 'break-word', mb: 1 }} />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            <Paper component="form" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" sx={{ width: '100%', padding: '0 8px' }}>
                    <InputBase
                        sx={{ flex: 1 }}
                        placeholder="Soạn tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleInputKeypress}
                    />
                    <IconButton type="button" onClick={handleSendMessage} edge="end" color="primary">
                        <SendIcon />
                    </IconButton>
                </Stack>
                <Divider orientation="vertical" flexItem />
            </Paper>
        </Box>
        </div>
  
    );
}

export default MessageBox;