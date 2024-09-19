import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatHistory = ({ fileName }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`https://upload-document-back-end.onrender.com/get-chat-history/${fileName}`);
        setChatHistory(response.data.chatHistory);
        setLoading(false);
      } catch (err) {
      
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [fileName]);

  if (loading) return <div>Loading chat history...</div>;
  

  return (
    <div>
     
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
    </div>
  );
};

export default ChatHistory;
