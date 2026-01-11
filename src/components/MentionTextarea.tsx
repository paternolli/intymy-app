import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ProfileAvatar } from './ProfileAvatar';
import { UserProfile } from '@/types';
import { cn } from '@/lib/utils';

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  users: UserProfile[];
  className?: string;
}

export function MentionTextarea({ 
  value, 
  onChange, 
  placeholder, 
  users,
  className 
}: MentionTextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);

    // Check for @ mention
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Only show suggestions if there's no space after @
      if (!textAfterAt.includes(' ')) {
        const query = textAfterAt.toLowerCase();
        setMentionQuery(query);
        setMentionStartIndex(lastAtIndex);
        
        const filtered = users.filter(user => 
          user.username.toLowerCase().includes(query) ||
          user.members[0]?.name.toLowerCase().includes(query)
        ).slice(0, 5);
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        if (suggestions[selectedIndex]) {
          e.preventDefault();
          selectMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const selectMention = (user: UserProfile) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textarea.selectionStart);
    const newValue = `${beforeMention}@${user.username} ${afterMention}`;
    
    onChange(newValue);
    setShowSuggestions(false);

    // Set cursor position after mention
    setTimeout(() => {
      const newCursorPos = mentionStartIndex + user.username.length + 2;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden"
        >
          {suggestions.map((user, index) => (
            <button
              key={user.id}
              onClick={() => selectMention(user)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
              )}
            >
              <ProfileAvatar
                profileType={user.profileType}
                members={user.members}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium">@{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.members[0]?.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
