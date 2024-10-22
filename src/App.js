import React, { useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [uploading, setUploading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // Use useRef to reference the hidden input element
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);

    try {
      const response = await axios.post('https://comply-assignment-backend.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponseData(response.data);
    } catch (error) {
      console.error('Upload failed', error);
      setResponseData({ error: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current.click();
  };

  return (
    <div className="container">
      <div className="upload-box">
        {/* Hidden input field for file selection */}
        <input
          type="file"
          id="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Single button to choose and upload the file */}
        <button
          onClick={handleClick}
          className="upload-button"
          disabled={uploading}
        >
          {uploading ? (
            <div className="spinner"></div> // Display spinner during upload
          ) : (
            'Choose and Upload File'
          )}
        </button>
      </div>

      {responseData && (
        <div className="evaluation-section">
          <h2>Ad Evaluation Report</h2>
          {responseData.map((item, index) => {
            // if (index === responseData.length - 1) {
            //   return <div className="evaluation-card">
            //     <h1> Brand Standards </h1>
            //     <div className="evaluation"> {item} </div>
            //   </div>
            // }
            return (<div key={index} className="evaluation-card">
              <div className="section-header">
                <h3>{item['MDL Section']}</h3>
              </div>
              <div className="ad-segment">
                <h4>Ad Segment</h4>
                <p>{item['Ad Segment']}</p>
              </div>
              <div className="evaluation">
                <h4>Evaluation</h4>
                <p>{item['Evaluation']}</p>
              </div>
            </div>)
          })}
        </div>
      )}
    </div>
  );
}

export default App;
