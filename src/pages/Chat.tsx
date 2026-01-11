import { useState, useCallback } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { ChatList } from '@/components/chat/ChatList';
import { ChatView } from '@/components/chat/ChatView';
import { useChat, ReactionType, Message } from '@/hooks/useChat';
import { Conversation } from '@/types';

export default function Chat() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  
  const { 
    conversations, 
    getMessages, 
    sendMessage, 
    markAsRead, 
    isTyping: checkIsTyping,
    searchConversations,
    addReaction,
    deleteMessage,
    editMessage
  } = useChat();

  const handleSelectChat = useCallback((conversation: Conversation) => {
    setSelectedChat(conversation);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedChat(null);
  }, []);

  const handleSendMessage = useCallback((text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio', replyTo?: Message) => {
    if (selectedChat) {
      sendMessage(selectedChat.id, text, mediaUrl, mediaType, replyTo);
    }
  }, [selectedChat, sendMessage]);

  const handleMarkAsRead = useCallback(() => {
    if (selectedChat) {
      markAsRead(selectedChat.id);
    }
  }, [selectedChat, markAsRead]);

  const handleAddReaction = useCallback((messageId: string, emoji: ReactionType) => {
    if (selectedChat) {
      addReaction(selectedChat.id, messageId, emoji);
    }
  }, [selectedChat, addReaction]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    if (selectedChat) {
      deleteMessage(selectedChat.id, messageId);
    }
  }, [selectedChat, deleteMessage]);

  const handleEditMessage = useCallback((messageId: string, newText: string) => {
    if (selectedChat) {
      editMessage(selectedChat.id, messageId, newText);
    }
  }, [selectedChat, editMessage]);

  if (selectedChat) {
    return (
      <ChatView
        conversation={selectedChat}
        messages={getMessages(selectedChat.id)}
        isTyping={checkIsTyping(selectedChat.id)}
        onBack={handleBack}
        onSendMessage={handleSendMessage}
        onMarkAsRead={handleMarkAsRead}
        onAddReaction={handleAddReaction}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <ChatList
        conversations={conversations}
        onSelectChat={handleSelectChat}
        onSearch={searchConversations}
      />

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
