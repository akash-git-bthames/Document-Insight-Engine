import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [parsingStatus, setParsingStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Upload successful!');

      // Simulate a status check for parsing
      setParsingStatus('Parsing in progress...');
      setTimeout(() => setParsingStatus('Parsing completed!'), 3000);
    } catch (error) {
      setUploadStatus('Upload failed');
    }
  };

  return (
    <div>
      <h1>Document Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
      {parsingStatus && <p>{parsingStatus}</p>}
    </div>
  );
};

export default DocumentUpload;


