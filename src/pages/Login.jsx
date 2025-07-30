import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';
import useUserStore from '../store/userStore';
import socket from '../socket';

const Login = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !role) return;
    const { data } = await createUser({ name, role });
    setUser(data);
    socket.emit('join', data._id); // join socket room
    navigate('/chat');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" gutterBottom>Enter Details</Typography>
      <TextField fullWidth margin="normal" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField
        fullWidth
        select
        margin="normal"
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <Button fullWidth variant="contained" onClick={handleSubmit}>Enter Chat</Button>
    </Box>
  );
};

export default Login;
