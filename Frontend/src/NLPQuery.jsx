// NLPQuery.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const NLPQuery = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [typingEffect, setTypingEffect] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async () => {
    if (!query) {
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/query", {
        params: { query },
      });
      setResponse(res.data.response);
      setTypingEffect(""); // Reset typing effect
      setIsTyping(true); // Start typing effect
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to retrieve response");
    }
  };

  useEffect(() => {
    if (isTyping && response) {
      let index = 0;
      const interval = setInterval(() => {
        setTypingEffect((prev) => prev + response[index]);
        index++;
        if (index === response.length) {
          clearInterval(interval);
          setIsTyping(false); // Stop typing once done
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTyping, response]);

  return (
    <div className="w-[60vw] m-auto flex flex-col items-center min-h-[60vh] justify-evenly shadow-xl bg-gradient-to-r from-pink-500 to-red-500 rounded-lg mt-10 p-8">
      <h1 className="text-2xl font-bold text-white">NLP Query</h1>
      <textarea
        className="input h-40 w-full p-4 rounded-lg border-2 border-white"
        value={query}
        onChange={handleQueryChange}
        placeholder="Ask a question..."
        rows="4"
        cols="50"
      />

      <button
        className="bg-white text-red-500 px-6 py-2 rounded-lg shadow-md hover:bg-red-500 hover:text-white transition-colors"
        onClick={handleQuerySubmit}
      >
        Submit
      </button>

      {typingEffect && (
        <p className="mt-4 text-white">
          Response: <span className="typing-effect">{typingEffect}</span>
        </p>
      )}
    </div>
  );
};

export default NLPQuery;
