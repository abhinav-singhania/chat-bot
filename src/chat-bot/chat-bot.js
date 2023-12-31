import React, { useState, useRef } from "react";
import axios from "axios";
import "./chat-bot.css";
import ChatBotMessage from "./chat-bot-message/chat-bot-message";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am Jarvis. How can I assist you today?",
      sender: "bot"
    },
  ]);
  const [inputText, setInputText] = useState("");
  const allMessages = useRef({userMessages: [], botMessages: []});

  const apiUrl = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";


  const handleUserInput = () => {
    if (inputText.trim() === "") return;
    setMessages(messages => [...messages, { text: inputText, sender: "user" }]);
    allMessages.current.userMessages.push(inputText);
    handleGPTInput(inputText);    
    setInputText("");
  };

  const handleGPTInput = async (inputText) => {
    try {
      // let userMessages = messages.filter((message) => message.sender === "user");
      const response = await axios.post(apiUrl, {
        inputs: {
          past_user_inputs: allMessages.current.userMessages,
          generated_responses: allMessages.current.botMessages,
          text: inputText
        } 
      });
      allMessages.current.botMessages.push(response.data.generated_text);
      const botResponse = response.data.generated_text;
      setMessages(messages => [...messages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response from the model:", error);
      setMessages([
        ...messages,
        {
          text: "Sorry, there was an error. Please try again later.",
          sender: "bot",
        },
      ]);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <SmartToyIcon className="robot"/>
        <h3>Hi, I am Jarvis 🤘🏻</h3>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <ChatBotMessage 
            key={index}
            message={message}
            index={index}
          />
        ))}
      </div>

      <div className="user-container">
        <TextField id="outlined-basic" variant="outlined" 
          type="text"
          className="user-input"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleUserInput();
          }}
        />
        
        <Button onClick={handleUserInput} variant="contained"><SendIcon/></Button>
      </div>
    </div>
  );
};

export default Chatbot;
