import React, { useState, useEffect, useRef } from 'react';
import * as signalR from "@microsoft/signalr";
import SideBar from './SideBar';
import MessageBox from './MessageBox';
import HeaderChat from './HeaderChat';
import './ChatApp.scss';
const ChatApp = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState({ user: '', group: '', message: '' });
  const [joinedGroup, setJoinedGroup] = useState('');
  const group = useRef('');
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7113/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.error('Connection failed: ', err));

    // Listener này nên có điều kiện để chỉ lưu các tin nhắn của nhóm đã tham gia
    conn.on('SendMess', (groupName, user, message) => {
      console.log(groupName + "&" + group.current);
      if (groupName === group.current) {
        setMessages(messages => [...messages, { user, message }]);
      }
    });

    setConnection(conn);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [joinedGroup]); // Thêm vào mảng dependencies để useEffect re-run khi joinedGroup thay đổi

  const sendMessage = async () => {
    if (connection && input.message && joinedGroup) {
      try {
        await connection.invoke('SendMessageToGroup', joinedGroup, input.user, input.message);
        setInput({ ...input, message: '' });
        setJoinedGroup(joinedGroup);
      } catch (err) {
        console.error(err);
      }
    }
  };



  const handleJoinGroup = async () => {
    if (connection && input.group) {
      try {
        await connection.invoke('AddToGroup', input.group);
        setJoinedGroup(input.group); // Cập nhật state khi đã join nhóm
        console.log(`Joined group ${input.group}`);
        group.current = input.group;
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ... Các hàm handleUserChange, handleMessageChange, handleGroupChange giữ nguyên ...
  const handleMessageChange = (event) => {
    setInput({ ...input, message: event.target.value });
  };

  const handleUserChange = (event) => {
    setInput({ ...input, user: event.target.value });
  };

  const handleGroupChange = (event) => {
    setInput({ ...input, group: event.target.value });
  };
  // return (
  //   <div>
  //     <input
  //       type="text"
  //       placeholder="User Name"
  //       value={input.user}
  //       onChange={handleUserChange}
  //     />
  //     <input
  //       type="text"
  //       placeholder="Group Name"
  //       value={input.group}
  //       onChange={handleGroupChange}
  //       onKeyPress={(e) => {
  //         if (e.key === 'Enter') handleJoinGroup();
  //       }}
  //     />
  //     <button onClick={handleJoinGroup}>Join Group</button>
  //     {joinedGroup !== '' && ( // Chỉ hiển thị nếu đã join vào nhóm
  //       <>
  //         <input
  //           type="text"
  //           placeholder="Type a message..."
  //           value={input.message}
  //           onChange={handleMessageChange}
  //           onKeyPress={(e) => {
  //             if (e.key === 'Enter') sendMessage();
  //           }}
  //         />
  //         <button onClick={sendMessage}>Send</button>
  //       </>
  //     )}
  //     <div>
  //       {messages.map((m, index) => (
  //         <p key={index}><b>{m.user}:</b> {m.message}</p>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    <>
      <div className='flex-collum'>
        <div><HeaderChat /></div>
        <div className='flex-wrap'>
          <div><SideBar /></div>
          <div className='MessageBox'><MessageBox /></div>
        </div>
      </div>
    </>);
};

export default ChatApp;