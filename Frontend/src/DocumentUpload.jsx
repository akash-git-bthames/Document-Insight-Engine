// DocumentUpload.jsx
import React, { useState } from "react";
import axios from "axios";
import NLPQuery from "./NLPQuery";

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [parsingStatus, setParsingStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Upload successful!");

      // Simulate a status check for parsing
      setParsingStatus("Parsing in progress...");
      setTimeout(() => setParsingStatus("Parsing completed!"), 3000);
    } catch (error) {
      setUploadStatus("Upload failed");
    }
  };

  return (
    <div className="w-[60vw] m-auto flex flex-col items-center h-[60vh] justify-evenly shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mt-10 p-8">
      <h1 className="text-3xl font-bold text-white">Document Upload</h1>
      <div className="flex space-x-4">
        <input type="file" className="input" onChange={handleFileChange} />
        <button
          className="bg-white text-purple-500 px-6 py-2 rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition-colors"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      <p className="text-white">{uploadStatus}</p>
      {parsingStatus && <p className="text-white">{parsingStatus}</p>}

      <NLPQuery />
    </div>
  );
};

export default DocumentUpload;
