import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { baseUrl } from '../Config';
import { Navbar2 } from '../Navbar2/Navbar2';
import { Trash2 } from 'lucide-react';


const MyDocument = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/documents`);
      setDocuments(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDocumentClick = async (docId, docName) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/documents/${docId}`);
      navigate('/', {
        state: {
          documentContent: response.data.content,
          documentName: docName,
          documentId: docId,
          documentDate: response.data.updatedAt
        }
      });
    } catch (error) {
      console.error('Error fetching document content:', error);
      alert('Error loading document: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`${baseUrl}/api/documents/${docId}`);
        setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== docId));
        alert('Document deleted successfully.');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document: ' + error.message);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="documents-container">
      <div className="my_document_navbar_Container">
            <div className='mt-8'>
            <Navbar2/>
            </div>
          <div className='flex justify-center w-full mb-3 mt-3 bg-[#E2E8F0]'>
          <hr />
          </div>
          
            <div className='absolute bottom-0 left-0 bg-[#F8FAFC] p-3'>
            <div className='flex  w-52 mb-3 mt-3 bg-[#E2E8F0] '>
          <hr />
          </div>
            <div className='flex gap-2 items-center '>
              <img src="./Images/Avatar.png" alt="" />
             <div>
             <p className='font-bold'>Vikash Kumar</p>
             <p>Member</p>
             </div>
            </div>
            </div>
          </div>
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <ul className="documents-list">
            {documents.map(doc => (
              <li key={doc._id} className="document-item">
                <button
                  onClick={() => handleDocumentClick(doc._id, doc.name)}
                  className="document-button"
                >
                  {doc.name || 'Untitled Document'}
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="document-button delete-button bg-[#D92D20] flex gap-2 rounded-lg"
                >
                  <Trash2 className='text-white'/>
                 <p className='text-white'> Delete</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyDocument;
