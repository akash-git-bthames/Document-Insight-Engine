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
    <div>
      <h1>NLP Query</h1>
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Ask a question..."
      />
      <button onClick={handleQuerySubmit}>Submit</button>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default NLPQuery;
