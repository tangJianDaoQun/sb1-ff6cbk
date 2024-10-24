import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatState } from './types/chat';
import { Bot } from 'lucide-react';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // TODO: Replace with actual API call to Tongyi Qianwen
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            content: "This is a mock response. Replace this with actual API integration with Tongyi Qianwen.",
          });
        }, 1000);
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: (response as any).content,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error:', error);
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Bot className="w-6 h-6 text-green-500" />
          <h1 className="text-xl font-semibold">Tongyi Qianwen Chat</h1>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {chatState.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <Bot className="w-12 h-12 mb-4" />
              <p className="text-lg">Start a conversation with Tongyi Qianwen</p>
            </div>
          ) : (
            chatState.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {chatState.isLoading && (
            <div className="flex items-center gap-2 p-4 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} disabled={chatState.isLoading} />
    </div>
  );
}

export default App;