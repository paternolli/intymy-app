import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Video, 
  Image, 
  Smile, 
  Mic, 
  MoreVertical,
  Check,
  CheckCheck,
  X,
  Reply,
  CornerUpLeft,
  Pencil,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProfileAvatar, ProfileNames } from '@/components/ProfileAvatar';
import { formatTimeAgo } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Conversation } from '@/types';
import { Message, ReactionType } from '@/hooks/useChat';

interface ChatViewProps {
  conversation: Conversation;
  messages: Message[];
  isTyping: boolean;
  onBack: () => void;
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio', replyTo?: Message) => void;
  onMarkAsRead: () => void;
  onAddReaction: (messageId: string, emoji: ReactionType) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
}

const EMOJI_LIST = ['❤️', '😍', '🔥', '😂', '😘', '💕', '🥰', '✨', '💜', '😊', '🙈', '💋'];
const REACTION_EMOJIS: ReactionType[] = ['❤️', '😂', '😮', '😢', '😡', '👍'];

export function ChatView({ 
  conversation, 
  messages, 
  isTyping, 
  onBack, 
  onSendMessage,
  onMarkAsRead,
  onAddReaction,
  onDeleteMessage,
  onEditMessage
}: ChatViewProps) {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mark as read when opening
  useEffect(() => {
    onMarkAsRead();
  }, [onMarkAsRead]);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (selectedMessageId) {
        setSelectedMessageId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedMessageId]);

  // Focus input when replying or editing
  useEffect(() => {
    if (replyingTo || editingMessage) {
      inputRef.current?.focus();
    }
  }, [replyingTo, editingMessage]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    if (editingMessage) {
      onEditMessage(editingMessage.id, message.trim());
      setEditingMessage(null);
    } else {
      onSendMessage(message.trim(), undefined, undefined, replyingTo || undefined);
      setReplyingTo(null);
    }
    
    setMessage('');
    setShowEmojis(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      if (replyingTo) setReplyingTo(null);
      if (editingMessage) {
        setEditingMessage(null);
        setMessage('');
      }
    }
  };

  const handleLongPressStart = useCallback((messageId: string) => {
    const timer = setTimeout(() => {
      setSelectedMessageId(messageId);
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    setLongPressTimer(timer);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleReactionSelect = useCallback((messageId: string, emoji: ReactionType) => {
    onAddReaction(messageId, emoji);
    setSelectedMessageId(null);
  }, [onAddReaction]);

  const handleReply = useCallback((msg: Message) => {
    setReplyingTo(msg);
    setEditingMessage(null);
    setMessage('');
    setSelectedMessageId(null);
  }, []);

  const handleEdit = useCallback((msg: Message) => {
    if (!msg.isMine || msg.isDeleted) return;
    setEditingMessage(msg);
    setMessage(msg.text);
    setReplyingTo(null);
    setSelectedMessageId(null);
  }, []);

  const handleDelete = useCallback((msg: Message) => {
    if (!msg.isMine || msg.isDeleted) return;
    onDeleteMessage(msg.id);
    setSelectedMessageId(null);
  }, [onDeleteMessage]);

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="h-3 w-3 rounded-full border-2 border-primary-foreground/50 border-t-transparent animate-spin" />;
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const renderReactions = (msg: Message) => {
    if (!msg.reactions || msg.reactions.length === 0) return null;

    // Group reactions by emoji
    const grouped = msg.reactions.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className={cn(
        "flex gap-1 mt-1",
        msg.isMine ? "justify-end" : "justify-start"
      )}>
        {Object.entries(grouped).map(([emoji, count]) => (
          <motion.span
            key={emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-0.5 bg-muted/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs border border-border/50 shadow-sm"
          >
            <span>{emoji}</span>
            {count > 1 && <span className="text-muted-foreground">{count}</span>}
          </motion.span>
        ))}
      </div>
    );
  };

  const renderReplyPreview = (replyTo: Message) => {
    const senderName = replyTo.isMine ? 'Você' : conversation.participant.members[0]?.name || 'Usuário';
    
    return (
      <div className={cn(
        "flex items-start gap-2 px-3 py-2 rounded-lg mb-1 text-xs",
        replyTo.isMine 
          ? "bg-primary/20 border-l-2 border-primary" 
          : "bg-muted/80 border-l-2 border-muted-foreground"
      )}>
        <CornerUpLeft className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{senderName}</p>
          <p className="text-muted-foreground line-clamp-1">{replyTo.text || '📷 Mídia'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-2 h-14">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <ProfileAvatar
              profileType={conversation.participant.profileType}
              members={conversation.participant.members}
              size="sm"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm leading-tight">
                <ProfileNames members={conversation.participant.members} />
              </span>
              <span className="text-xs text-green-500">Online agora</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Phone className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Video className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <MoreVertical className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Date separator */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Hoje
          </span>
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex flex-col", msg.isMine ? "items-end" : "items-start")}
            >
              <div className="relative max-w-[80%]">
                {/* Reaction Picker with Reply Option */}
                <AnimatePresence>
                  {selectedMessageId === msg.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className={cn(
                        "absolute z-50 bottom-full mb-2 flex items-center gap-1 bg-background border border-border rounded-full px-2 py-1.5 shadow-lg",
                        msg.isMine ? "right-0" : "left-0"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!msg.isDeleted && REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReactionSelect(msg.id, emoji)}
                          className="text-xl hover:scale-125 transition-transform p-1 hover:bg-muted rounded-full"
                        >
                          {emoji}
                        </button>
                      ))}
                      {!msg.isDeleted && <div className="w-px h-6 bg-border mx-1" />}
                      <button
                        onClick={() => handleReply(msg)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        title="Responder"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      {msg.isMine && !msg.isDeleted && (
                        <>
                          <button
                            onClick={() => handleEdit(msg)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg)}
                            className="p-2 hover:bg-destructive/20 rounded-full transition-colors text-destructive"
                            title="Apagar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reply Quote (if replying to a message) */}
                {msg.replyTo && renderReplyPreview(msg.replyTo)}

                {/* Message Bubble */}
                <div
                  onMouseDown={() => handleLongPressStart(msg.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(msg.id)}
                  onTouchEnd={handleLongPressEnd}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedMessageId(msg.id);
                  }}
                  className={cn(
                    "rounded-2xl px-4 py-2 cursor-pointer select-none transition-transform active:scale-[0.98]",
                    msg.isMine 
                      ? msg.isDeleted 
                        ? "bg-muted/50 text-muted-foreground rounded-br-sm"
                        : "bg-primary text-primary-foreground rounded-br-sm" 
                      : "bg-muted rounded-bl-sm",
                    msg.isDeleted && "italic",
                    selectedMessageId === msg.id && "ring-2 ring-primary/50"
                  )}
                >
                  {msg.mediaUrl && !msg.isDeleted && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img 
                        src={msg.mediaUrl} 
                        alt="Mídia" 
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {msg.text && (
                    <p className={cn(
                      "text-sm whitespace-pre-wrap",
                      msg.isDeleted && "text-muted-foreground italic"
                    )}>
                      {msg.text}
                    </p>
                  )}
                  
                  <div className={cn(
                    "flex items-center gap-1 mt-1",
                    msg.isMine ? "justify-end" : "justify-start"
                  )}>
                    {msg.isEdited && !msg.isDeleted && (
                      <span className={cn(
                        "text-[10px]",
                        msg.isMine ? "text-primary-foreground/50" : "text-muted-foreground/70"
                      )}>
                        editada
                      </span>
                    )}
                    <span className={cn(
                      "text-[10px]",
                      msg.isMine 
                        ? msg.isDeleted ? "text-muted-foreground" : "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    )}>
                      {formatTimeAgo(msg.time)}
                    </span>
                    {msg.isMine && !msg.isDeleted && (
                      <span className="text-primary-foreground/70">
                        {getStatusIcon(msg.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reactions Display */}
              {renderReactions(msg)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      {/* Reply Preview Bar */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted/50 border-t border-border px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 flex items-start gap-2 px-3 py-2 bg-background rounded-lg border-l-4 border-primary">
                <Reply className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary">
                    Respondendo a {replyingTo.isMine ? 'você mesmo' : conversation.participant.members[0]?.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {replyingTo.text || '📷 Mídia'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Preview Bar */}
      <AnimatePresence>
        {editingMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border-t border-amber-500/30 px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 flex items-start gap-2 px-3 py-2 bg-background rounded-lg border-l-4 border-amber-500">
                <Pencil className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-500">
                    Editando mensagem
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {editingMessage.text}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingMessage(null);
                  setMessage('');
                }}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted border-t border-border px-4 py-3"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background border-t border-border p-3 safe-area-bottom">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors text-primary">
            <Image className="h-6 w-6" strokeWidth={1.5} />
          </button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={editingMessage ? "Editar mensagem..." : replyingTo ? "Escreva sua resposta..." : "Mensagem..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "pr-10 rounded-full bg-muted border-none",
                editingMessage && "ring-2 ring-amber-500/50"
              )}
            />
            <button 
              onClick={() => setShowEmojis(!showEmojis)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                showEmojis ? "text-primary" : "text-muted-foreground"
              )}
            >
              {showEmojis ? (
                <X className="h-5 w-5" />
              ) : (
                <Smile className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {message.trim() ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleSend}
              className={cn(
                "p-2 rounded-full hover:opacity-90 transition-opacity",
                editingMessage 
                  ? "bg-amber-500 text-white" 
                  : "bg-primary text-primary-foreground"
              )}
            >
              {editingMessage ? (
                <Check className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Send className="h-5 w-5" strokeWidth={1.5} />
              )}
            </motion.button>
          ) : (
            <button 
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isRecording ? "bg-red-500 text-white" : "text-primary hover:bg-muted"
              )}
            >
              <Mic className="h-6 w-6" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
