// @ts-nocheck
// Home.tsx
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

// Define the Message interface
interface Message {
  id: string;
  text: string;
  language: string;
  sender: 'user' | 'system';
  timestamp?: string;
}

// Define the LanguageOption interface
interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const Home: React.FC = (): JSX.Element => {
  // State Variables with Types
  const [language, setLanguage] = useState<string>("es");
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Input Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  // Handle Language Selection
  const handleLanguageSelect = (code: string): void => {
    setLanguage(code);
  };

  // Handle Form Submission
  const handleSubmit = async (): Promise<void> => {
    if (!text.trim() || !language) return;

    // Add user message to messages array
    const userMessage: Message = {
      id: uuidv4(),
      text: text.trim(),
      language: "en_XX", // Assuming user messages are in English
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setText(""); // Clear input field

    setIsLoading(true);
    setError(null);

    try {
      const url = import.meta.env.VITE_API_URL

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify({
          input: text,
          language,
        })
      })
      
      console.log('Response:',response);
      const {translation_text} = await response.json()
      // console.log(translation_text)
      if (translation_text) {
        // Add translated message to messages array
        const translatedMessage: Message = {
          id: uuidv4(),
          text: translation_text,
          language: language,
          sender: "system",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, translatedMessage]);
      } else {
        throw new Error("API Limit Hit.")
      }

    } catch (err) {
      console.error("Translation Error:", err);
      setError("Failed to translate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter Key Press in Input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !isLoading && text.trim()) {
      handleSubmit();
    }
  };

  // Define available languages
  const languages: LanguageOption[] = [
    { code: "es", name: "Spanish", flag: "/es-flag.png" },
    { code: "fr", name: "French", flag: "/fr-flag.png" },
    { code: "ja_XX", name: "Japanese", flag: "/jpn-flag.png" },
    // Add more languages as needed
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      {/* Image Section */}
      <div className="w-full px-4 md:max-w-lg mx-auto">
        <img
          className="w-full h-auto object-cover rounded-t-3xl"
          src="/Polly.png"
          alt="Title"
          loading="lazy" // Optimize image loading
        />
      </div>


      {/* Chatbox Section */}
      <div className="w-full max-w-md mx-4 mt-[-40px]"> {/* Adjust margin-top as needed */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col">
          {/* Messages Display */}
          <div className="flex-1 min-h-[300px] max-h-[300px] overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 p-4 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-50 self-end"
                      : "bg-gray-50 self-start"
                  }`}
                >
                  <p className="text-gray-700">{message.text}</p>
                  {/* Optional: Display timestamp */}
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
              ))
            )}
            {/* Dummy div to scroll into view */}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Input and Send Button */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your text..."
              value={text}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSubmit}
              className={`ml-2 p-3 bg-blue-500 hover:bg-blue-700 text-white rounded-full focus:outline-none flex items-center justify-center ${
                text.trim() === "" || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={text.trim() === "" || isLoading}
              aria-label="Send Message"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-6 w-6" />
              ) : (
                <FaPaperPlane className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex justify-center space-x-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`p-2 border-2 rounded-full focus:outline-none transition-colors ${
                  language === lang.code
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                aria-label={`Select ${lang.name}`}
              >
                <img
                  src={lang.flag}
                  alt={lang.name}
                  className="w-8 h-6 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
