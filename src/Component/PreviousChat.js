import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import mammoth from 'mammoth';
import ChatHistory from './ChatHistory';
import { v4 as uuidv4 } from 'uuid';

const PreviousChat = () => {

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedText, setExtractedText] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState({});
  const [activeFileIndex, setActiveFileIndex] = useState(null);
  const [activeFileName, setActiveFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState();
  const isButtonDisabled = extractedText.length === 0;

  const baseUrl = 'http://localhost:8080';
  const navigate = useNavigate();
  const getFileName = localStorage.getItem('activeFileName')
  const fileName = activeFileName ? activeFileName : getFileName;

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};
    const storedActiveFileName = localStorage.getItem('activeFileName');

    setUploadedFiles(storedFiles);
    setSearchHistory(storedSearchHistory);
    setActiveFileName(storedActiveFileName);
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    localStorage.setItem('activeFileName', activeFileName);
  }, [uploadedFiles, searchHistory, activeFileIndex, activeFileName]);

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  const handleShowPopup = () => {
    setShowPopup(true);
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsLoading(true);
    const uploadTime = new Date();
    const uniqueId = uuidv4();
  
    try {
  
      await extractText(file);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${baseUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newExtractedText = response.data.paragraphs;
      setExtractedText(newExtractedText);
      const newFile = { id: uniqueId, file, uploadTime, extractedText: newExtractedText };
      setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
      setActiveFileIndex(uploadedFiles.length);
      setActiveFileName(file.name);
      console.log(file.name);

      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        [file.name]: [],
      }));
  
      setErrorMessage('');
  
    } catch (error) {
      setErrorMessage('Error uploading the file. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const extractText = async (file) => {
    if (!file) {
      console.error('No file provided.');
      return;
    }

    const fileType = file.type;

    if (fileType === 'application/pdf') {
      await extractTextFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      await extractTextFromImage(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      await extractTextFromDocx(file);
    } else {
      console.error('Unsupported file type:', fileType);
    }
  };

  const extractTextFromPDF = async (file) => {
    if (!(file instanceof Blob)) {
      console.error('The provided argument is not a Blob:', file);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      try {
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
      } catch (error) {
        console.error('Error processing PDF:', error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
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

  const handleSearch = async () => {
    if (searchQuery.trim() === '' || extractedText.length === 0 || !activeFileName) return;
    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/search`, {
        query: searchQuery,
        paragraphs: extractedText,
      });

      if (response.data && response.data.question && response.data.answer) {
        setSearchHistory(prevHistory => ({
          ...prevHistory,
          [activeFileName]: [
            { question: response.data.question, answer: response.data.answer },
            ...(prevHistory[activeFileName] || [])
          ]
        }));

        await axios.post(`${baseUrl}/save-chat`, {
          fileName: activeFileName,
          question: response.data.question,
          answer: response.data.answer,
          extractText: extractedText
        });

        setSearchQuery('');
        setErrorMessage('');
      } else {
        setErrorMessage('Unexpected response structure.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during the search. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFileClick = async (index) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveFileIndex(index);
    const clickedFile = uploadedFiles[index];
    setActiveFileName(clickedFile.file.name);

    if (!clickedFile.extractedText) {
      await extractText(clickedFile.file);

      try {
        const response = await axios.post(`${baseUrl}/process-file`, {
          fileName: clickedFile.file.name,
          extractedText: extractedText,
        });

        const updatedFiles = [...uploadedFiles];
        updatedFiles[index] = { ...clickedFile, extractedText: extractedText };
        setUploadedFiles(updatedFiles);
      } catch (error) {
        console.error('Error sending data to backend:', error);
        setErrorMessage('Error processing file. Please try again.');
      }
    } else {
      setExtractedText(clickedFile.extractedText);
    }

    setIsProcessing(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

  };

  const handleSubmit = () => {
    navigate('/');
    window.location.reload(true);

  };

  const uniqueId = uuidv4(); 

  const navigateToChatbot = (fileId) => {
    navigate(`/chathistory/${uniqueId}`);  
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteFile = (index) => {
    const fileToDelete = uploadedFiles[index];
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    const updatedHistory = { ...searchHistory };
    delete updatedHistory[fileToDelete.file.name];
    setSearchHistory(updatedHistory);

    if (activeFileIndex === index) {
      setActiveFileIndex(null);
      setActiveFileName('');
      setExtractedText([]);
    }
  };

  const handleHistory = (() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-filename-history`);
  
        // Log the full response data structure to inspect it
        console.log('Full Response Data: ', response.data); 
  
        setFiles(response.data);  // Update state
      } catch (err) {
        console.error(err);
        setError('Error fetching chat history.');
      }
    };
  
    fetchChatHistory();
  });
  

  const handlFileName = (file) => {
    localStorage.setItem('activeFileName', file.name);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return './Images/pdf2.png';
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
        return './Images/jpeg_jpg_icon.png';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return './Images/word_file_icon.png';
      default:
        return './Images/default_file_icon.png';
    }
  };

  return (
    <div className="main-container">
      <div className='d-flex'>
        <div className='file_upload_container'>
          <div className='w-525'><p>UPLOAD DOCUMENT</p>
          </div>
          <div className='w-525-bg'></div>
          <div className='w-84'>
          <div className='chat-history-hover'>
           <img
              onClick={() => {
                handleHistory();
                handleShowPopup();
              }}
              src='../Images/chatHistory.png'
              alt='Frame'
            />
            <p className='chat-history-p'>Chat History</p>
           </div>
            <div className='hover-new'><img onClick={handleSubmit} src='../Images/new-chat.png' />
            <p className='new-chat-hover'>New Chat</p></div>
          </div>
          <div className='p-5' >
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="fileInput"
            />
       <div className='hover-upload-document'>  
           <img src='../Images/uploadfile.png' alt="Attachment" onClick={() => document.getElementById('fileInput').click()} />
           <p className='upload-document'>Upload Document</p>
           </div>

          </div>
        </div>
        <div className='d-flex-j-c'>
          <div>
            <div className='d-flex'>
              <img src='../Images/pdf (1).png' alt="PDF Icon" />
              <div>
                <p>{fileName}</p>
                <p className='chat-now'>Chat Now</p>
              </div>
            </div>
          </div>
          <div>
            <img src='../Images/message.png' alt="Message" className='message-icon chat-history' />
          </div>
        </div>
      </div>
      <div className='search_container'>
        <div className='d-flex-justify-space-b'>
          {showPopup && (
            <div className='file-name'>
              {error && <div>{error}</div>}
              <div className='close-popup-div'>
                <img
                  src='../Images/close-popup.png'
                  alt="Close Popup"
                  onClick={handleClosePopup}
                  className="close-popup-icon"
                />
              </div>

              {files && files.length > 0 ? (
              files.map((file) => (
                <div key={file._id} onClick={() => {
                  console.log(file); 
                  handleHistory();
                  handleClosePopup();
                  handlFileName(file);
                  navigateToChatbot(file._id);
                }}>
                  <div className='chat-history-file-name'>{file.name}</div>

                </div>
              ))
              
            ) : (
              <div>No files available</div>
            )}
            </div>
          )}

          <div>
          </div>
          <div className='file1'>
              <div className='blue-div'>
                <img className='pdf-image' src='../Images/pdf2.png' alt="File Icon" />
              </div>

              <div>
                {getFileName}
                <p>Hey it was nice talking to you..</p>
              </div>

            </div>
          <div>
            

            {uploadedFiles.map((uploadedFile, index) => {
              const file = uploadedFile.file;
              const uploadTime = new Date(uploadedFile.uploadTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div>
                  <div
                    key={index}
                    className={`file1 ${activeFileIndex === index ? 'active' : ''}`}
                  >
                    <div className='blue-div'>
                      <img className='pdf-image' src={getFileIcon(file.type)} alt="File Icon" />
                    </div>
                    <div onClick={() => handleFileClick(index)}>
                      <p>{file.name}  {`${(file.size / 1024).toFixed(2)} KB`} </p>
                      <p>Hey it was nice talking to you..</p>
                    </div>
                    <div className='d-flex-date-delt'>
                      <p>{uploadTime}</p>
                      <img
                        src='../Images/delete.png'
                        style={{ width: '20px', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(index);
                        }}
                      />
                    </div>
                  </div>


                </div>

              );
            })}
          </div>
          <div className='text-s-field'>
            <div className='input_Btn'>
              <div style={{ overflowY: 'scroll', height: '70vh' }}>
                <ChatHistory fileName={fileName} />
                {activeFileName && searchHistory[activeFileName] && searchHistory[activeFileName].length > 0 && (
                  <div>
                    {searchHistory[activeFileName]
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <div key={index} className='pdf-chat-history'>
                          <div>
                            <div className='chat-question'>{item.question}</div>
                          </div>
                          <div><div className='chat-answer'>{item.answer}</div></div>
                        </div>
                      ))}

                  </div>
                )}
              </div>
              <div>
                <div className='s-align'>
                  <div className='search-input'>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type Your Message"
                    />
                  <div style={{ color:'red', textAlign:'center' }}>
      {isLoading ? (
        <div className="loading-spinner">Processing...</div>
      ) : (
        <>
          {!isButtonDisabled ? (
            <img
              onClick={handleSearch}
              src="../Images/send-btn.png"
              alt="Send"
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div className="not-allowed-message" >
              Not Allowed
            </div>
          )}
        </>
      )}
    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousChat;