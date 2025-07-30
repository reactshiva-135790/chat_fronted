import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, TextField, Button, Divider
} from '@mui/material';
import socket from '../socket';
import useUserStore from '../store/userStore';
import { getAllUsers, sendMessage, getMessages } from '../services/api';

const Chat = () => {
  const user = useUserStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const currentChatUser = useUserStore((state) => state.currentChatUser);
  const setCurrentChatUser = useUserStore((state) => state.setCurrentChatUser);
  const messages = useUserStore((state) => state.messages);
  const addMessage = useUserStore((state) => state.addMessage);

  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAllUsers().then((res) => {
      const others = res.data.filter((u) => u._id !== user._id);
      setUsers(others);
    });

    socket.on('receive_message', (data) => {
      addMessage(data);
    });

    socket.on('receive_notification', (notif) => {
      console.log('🔔 Notification:', notif);
    });

    return () => {
      socket.off('receive_message');
      socket.off('receive_notification');
    };
  }, [user]);

  const selectUser = async (u) => {
    setCurrentChatUser(u);
    const res = await getMessages(u._id);
    res.data.forEach(addMessage);
  };

  const handleSend = async () => {
    if (!msg.trim()) return;
    await sendMessage(currentChatUser._id, { message: msg });
    socket.emit('send_message', {
      senderId: user._id,
      receiverId: currentChatUser._id,
      message: msg,
    });
    addMessage({ senderId: user._id, message: msg, timestamp: new Date() });
    setMsg('');
  };

  return (
    <Box display="flex" height="100vh">
      <Box width="25%" borderRight="1px solid #ccc" p={2}>
        <Typography variant="h6">Users</Typography>
        <List>
          {users.map((u) => (
            <ListItem key={u._id} button onClick={() => selectUser(u)}>
              {u.name} ({u.role})
            </ListItem>
          ))}
        </List>
      </Box>

      <Box flex={1} p={2}>
        <Typography variant="h6">
          Chat with: {currentChatUser?.name || 'Select user'}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box height="70vh" overflow="auto" border="1px solid #ddd" p={1}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ mb: 1, textAlign: m.senderId === user._id ? 'right' : 'left' }}>
              <Typography variant="body2" sx={{ background: '#f5f5f5', p: 1, borderRadius: 1 }}>
                {m.message}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box mt={2} display="flex" gap={1}>
          <TextField fullWidth value={msg} onChange={(e) => setMsg(e.target.value)} />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
