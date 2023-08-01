import React from 'react';
import './chat-bot-message.css';

function ChatBotMessage({index ,message}) {
 
  return (
      <div key={index} className={`message ${message.sender}`}>
        {message.text}
      </div>
  );
}

export default ChatBotMessage;
