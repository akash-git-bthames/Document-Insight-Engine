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
    <div className="w-[60vw] m-auto flex flex-col items-center h-[80vh] justify-evenly shadow-lg bg-slate-300 rounded-lg shadow-slate-800 mt-10">
      <h1 className='text-3xl font-bold text-[rgb(61,106,255)]'>Document Upload</h1>
      <input type="file" className='input' onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p className='text-red-700'>{uploadStatus}</p>
      {parsingStatus && <p className='text-red-700'>{parsingStatus}</p>}
    </div>
  );
};

export default DocumentUpload;