import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import mammoth from 'mammoth';
import { useNavigate } from 'react-router-dom';  

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const isAdvancedUpload = (() => {
      const div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    })();

    if (isAdvancedUpload) {
      const draggableFileArea = document.querySelector(".drag-file-area");
      const events = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];
      events.forEach(evt =>
        draggableFileArea.addEventListener(evt, e => {
          e.preventDefault();
          e.stopPropagation();
        })
      );

      

      draggableFileArea.addEventListener("drop", e => {
        document.querySelector(".upload-icon").innerHTML = 'check_circle';
        handleFileChange({ target: { files: e.dataTransfer.files } });
      });
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    await extractText(file);
  };

  const extractText = async (file) => {
    const fileType = file.type;
    if (fileType === 'application/pdf') {
      await extractTextFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      await extractTextFromImage(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      await extractTextFromDocx(file);
    }
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let textBlocks = [];
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        content.items.forEach(item => {
          const lineText = item.str.trim();
          if (lineText) textBlocks.push(lineText);
        });
      }
      setExtractedText(textBlocks);
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromImage = async (file) => {
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => setExtractedText([text]))
      .catch((err) => console.error('Error extracting text from image:', err));
  };

  const extractTextFromDocx = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      mammoth.extractRawText({ arrayBuffer: event.target.result })
        .then((result) => setExtractedText([result.value]))
        .catch((err) => console.error('Error extracting text from DOCX:', err));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExtractedText(response.data.paragraphs);
      setErrorMessage('');
      
      // Navigate to ChatBot component with file information
      navigate('/chatbot', { 
        state: { 
          uploadedFile: {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type
          },
          extractedText: response.data.paragraphs
        }
      });
      
    } catch (error) {
      setErrorMessage('Error uploading the file. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <img className='background-image' src='./Images/Vector 1 (1).png' alt="Background" />
      </div>
      <div className="container">
        <div className="file-upload-div">
          <h1>Upload Document</h1>
          <hr  className='hr-tag'/>
          <div className="upload-container">
            <h3>Attach document</h3>
            <div className="drag-file-area">
              <img src='./Images/upload.png' alt="Upload Icon" className="upload-icon" />
              <h3 className="dynamic-message">Drag & drop pdf, image & docs file here</h3>
              <label className="label">
                or <span className="browse-files"><br/>
                  <input type="file" onChange={handleFileChange} className="default-file-input" />
                  <span className="browse-files-text">Browse Files</span>
                </span>
              </label>
            </div>
            {selectedFile && (
              <div className="file-details">
                <h3>File Name & Size</h3>
                <div className="file-info">
                  <span className="material-icons-outlined file-icon"><img src='./Images/pdf_icon.png' style={{width:'30px'}} alt="PDF Icon" /></span>
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                  <img src='./Images/delete.png' style={{width:'20px'}} alt="Delete" className="delete-button" onClick={handleDelete}/>
                </div>
              </div>
            )}
            <button
              type="button"
              className="upload-button"
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? 'Processing...' : 'Upload'}
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;