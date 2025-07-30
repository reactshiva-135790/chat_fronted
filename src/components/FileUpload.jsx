import React from 'react';
import socket from '../socket';
import useUserStore from '../store/userStore';

const FileUpload = ({ receiverId }) => {
  const { user } = useUserStore();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/messages/upload', {
      method: 'POST',
      body: formData,
    });

    const { fileName } = await res.json();

    socket.emit('send_file', {
      senderId: user.id,
      receiverId,
      fileName,
    });
  };

  return <input type="file" onChange={handleFileChange} />;
};

export default FileUpload;
