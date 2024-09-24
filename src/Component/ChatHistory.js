import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatHistory = ({ fileName }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`https://upload-document-back-end.onrender.com/get-chat-history/${fileName}`, {
          headers: { 
            'Content-Type': 'application/json',
            'User-Email': userEmail // Add the email to the headers
          }
        });
        setChatHistory(response.data.chatHistory);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [fileName, userEmail]);

  return (
    <div>
      {loading ? (
        <p>Loading chat history...</p>
      ) : (
        <div>
          {chatHistory.map((chat, index) => (
            <div key={index} className='pdf-chat-history'>
              <div>
                <div className='chat-question'>{chat.question}</div>
              </div>
              <div>
                <div className='chat-answer'>{chat.answer}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;