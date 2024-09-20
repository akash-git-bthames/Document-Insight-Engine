import React, { useState } from 'react';
import axios from 'axios';

const NLPQuery = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async () => {
    if (!query) {
      return;
    }

    try {
      const res = await axios.post('/api/nlp-query', { query });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Failed to retrieve response');
    }
  };

  return (
    <div className="w-[60vw] m-auto flex flex-col items-center min-h-[80vh] justify-evenly shadow-lg bg-slate-200 rounded-lg shadow-slate-800 mt-10">
      <h1 className='text-2xl font-bold text-[rgb(61,106,255)]'>NLP Query</h1>
      <textarea
  className="input h-40"
  value={query}
  onChange={handleQueryChange}
  placeholder="Ask a question..."
  rows="4"
  cols="50"
/>

      <button onClick={handleQuerySubmit}>Submit</button>
      {response && <p className='text-red-700'>Response: {response}</p>}
    </div>
  );
};

export default NLPQuery;