import React, { useEffect, useState } from 'react';
import { baseUrl } from '../Config';

const PromptUpdate = ({ onClose }) => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storedKey, setStoredKey] = useState(null);
  const [error, setError] = useState(null);

  const fetchStoredKey = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/update-prompts`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        const fetchedPrompt = data.prompt || '';
        setStoredKey(fetchedPrompt);
        setValue(fetchedPrompt); // Populate textarea with stored key
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch stored prompt');
        setStoredKey(null);
        setValue('');
      }
    } catch (error) {
      console.error('Error fetching stored key:', error);
      setError('Network error. Please check your connection.');
      setStoredKey(null);
      setValue('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/update-prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompts: value })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update prompt');
      }

      alert('Prompt Updated Successfully');
      await fetchStoredKey(); // Refresh stored key
      setError(null);
    } catch (error) {
      console.error('Error updating prompt:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePrompt = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/update-prompts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Prompt successfully removed!');
        setStoredKey(null);
        setValue(''); // Clear the textarea
        setError(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove Prompt');
      }
    } catch (error) {
      console.error('Error removing key:', error);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoredKey();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-full">
      <div>
        <img src="./Images/prompt_logo.svg" alt="" className='w-full' />
      </div>
      <div className="flex justify-end items-center absolute font-bold top-16 right-96">
        
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

     <div className='flex justify-center'>
     <div>
     <h2 className="text-xl font-bold mb-2">Update Prompt</h2>
     <textarea 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        className='border p-3 w-[700px] outline-none h-64 overflow-auto mb-4' 
        placeholder='Enter your prompt'
      />
     </div>
     </div>

      <div className="flex justify-center gap-3 mb-5">
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className='bg-white text-[#414651] font-bold p-3 rounded border disabled:opacity-50 px-10'
        >
          {isLoading ? 'Updating...' : 'Update Prompt'}
        </button>
        <button 
          onClick={handleRemovePrompt} 
          disabled={isLoading}
          className='bg-red-600 text-white p-3 rounded disabled:opacity-50 px-10'
        >
          {isLoading ? 'Removing...' : 'Delete Prompt'}
        </button>
      </div>
    </div>
  );
};

export default PromptUpdate;