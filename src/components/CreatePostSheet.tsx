import { useState, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Image, Video, X, DollarSign, Play, MapPin, Users, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CreatePostData } from '@/hooks/usePosts';
import { ProfileAvatar } from './ProfileAvatar';
import { currentUser, mockUsers } from '@/data/mockData';
import { VideoRecorder } from './VideoRecorder';
import { LocationPicker } from './LocationPicker';
import { MentionTextarea } from './MentionTextarea';
import { TagPeopleSheet } from './TagPeopleSheet';
import { UserProfile } from '@/types';

interface CreatePostSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost?: (data: CreatePostData) => void;
}

export function CreatePostSheet({ open, onOpenChange, onCreatePost }: CreatePostSheetProps) {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTagPeople, setShowTagPeople] = useState(false);
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<UserProfile[]>([]);
  const { toast } = useToast();
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (type: 'image' | 'video') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  };

  const handleVideoRecorded = (videoBlob: Blob, previewUrl: string) => {
    setMediaFile(new File([videoBlob], 'recorded-video.webm', { type: 'video/webm' }));
    setMediaType('video');
    setMediaPreview(previewUrl);
    toast({ title: 'Vídeo gravado!', description: 'Seu vídeo está pronto para publicar.' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        toast({ title: 'Arquivo inválido', description: 'Selecione uma imagem válida.', variant: 'destructive' });
        return;
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        toast({ title: 'Arquivo inválido', description: 'Selecione um vídeo válido.', variant: 'destructive' });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({ title: 'Arquivo muito grande', description: 'O arquivo deve ter no máximo 50MB.', variant: 'destructive' });
        return;
      }

      setMediaFile(file);
      setMediaType(type);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
    }
  };

  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaType('none');
    setMediaPreview(null);
    setMediaFile(null);
    setTaggedUsers([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaPreview) {
      toast({ title: 'Adicione algo para publicar', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (onCreatePost) {
      onCreatePost({
        content: content.trim(),
        mediaUrl: mediaPreview || undefined,
        mediaType: mediaType === 'none' ? 'text' : mediaType,
        isPaid,
        price: isPaid && price ? parseFloat(price) : undefined,
        location: location || undefined,
        taggedUsers: taggedUsers.length > 0 ? taggedUsers.map(u => u.id) : undefined,
      });
    }

    toast({ title: 'Publicado!', description: 'Seu conteúdo foi compartilhado.' });
    
    setContent('');
    clearMedia();
    setIsPaid(false);
    setPrice('');
    setLocation('');
    setTaggedUsers([]);
    setIsUploading(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setContent('');
    clearMedia();
    setIsPaid(false);
    setPrice('');
    setLocation('');
    setTaggedUsers([]);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85dvh] max-h-[85dvh] rounded-t-3xl px-0 pb-0 flex flex-col"
      >
        {/* Handle bar */}
        <div className="w-12 h-1.5 rounded-full bg-muted mx-auto mt-3 mb-2 flex-shrink-0" />
        
        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'video')}
        />
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border flex-shrink-0">
          <button 
            onClick={handleClose} 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <h2 className="font-semibold text-lg">Nova publicação</h2>
          <Button 
            onClick={handlePost}
            size="sm"
            disabled={(!content.trim() && !mediaPreview) || isUploading}
            className="rounded-full px-5"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Postando</span>
              </div>
            ) : 'Publicar'}
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-safe">
          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-4">
            <ProfileAvatar
              profileType={currentUser.profileType}
              members={currentUser.members}
              size="md"
            />
            <div>
              <p className="font-semibold text-sm">{currentUser.username}</p>
              <p className="text-xs text-muted-foreground">Publicação pública</p>
            </div>
          </div>

          {/* Text area with mentions */}
          <div className="px-4">
            <MentionTextarea
              value={content}
              onChange={setContent}
              placeholder="O que você quer compartilhar hoje? ✨ Use @ para mencionar"
              users={mockUsers}
              className="min-h-[140px] resize-none border-none bg-transparent text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 p-0"
            />
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="px-4 mt-4">
              <div className="relative rounded-2xl overflow-hidden border border-border">
                {mediaType === 'video' ? (
                  <div className="relative">
                    <video 
                      src={mediaPreview} 
                      className="w-full max-h-64 object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="h-7 w-7 text-foreground fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={mediaPreview} alt="" className="w-full max-h-64 object-cover" />
                )}
                <button
                  onClick={clearMedia}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                
                {/* Tagged users on media */}
                {taggedUsers.length > 0 && (
                  <button
                    onClick={() => setShowTagPeople(true)}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 rounded-full text-xs text-white font-medium hover:bg-black/80 transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" />
                    {taggedUsers.length} {taggedUsers.length === 1 ? 'pessoa' : 'pessoas'}
                  </button>
                )}

                {mediaFile && !taggedUsers.length && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 rounded-full text-xs text-white font-medium">
                    {(mediaFile.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location badge */}
          {location && (
            <div className="px-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl border border-primary/20 w-fit">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{location}</span>
                <button
                  onClick={() => setLocation('')}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tagged users badge (when no media) */}
          {taggedUsers.length > 0 && !mediaPreview && (
            <div className="px-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-xl border border-primary/20 w-fit">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {taggedUsers.map(u => `@${u.username}`).join(', ')}
                </span>
                <button
                  onClick={() => setTaggedUsers([])}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Paid content toggle */}
          <div className="px-4 py-4 pb-6">
            <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Conteúdo exclusivo</p>
                    <p className="text-xs text-muted-foreground">Defina um valor para desbloquear</p>
                  </div>
                </div>
                <Switch checked={isPaid} onCheckedChange={setIsPaid} />
              </div>
              
              {isPaid && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary/20">
                  <div className="flex items-center gap-2 flex-1 bg-background rounded-xl px-4 py-2">
                    <span className="font-semibold text-primary">R$</span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="border-0 p-0 h-auto text-lg font-medium focus-visible:ring-0"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Você receberá<br/>
                    <span className="font-semibold text-foreground">
                      R$ {price ? (parseFloat(price) * 0.85).toFixed(2) : '0,00'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions bar - Fixed at bottom */}
        <div className="flex items-center gap-1 px-4 py-3 border-t border-border bg-background flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMediaSelect('image')}
            className={cn(
              "gap-2 rounded-full",
              mediaType === 'image' && "bg-primary/10 text-primary"
            )}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMediaSelect('video')}
            className={cn(
              "gap-2 rounded-full",
              mediaType === 'video' && "bg-primary/10 text-primary"
            )}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVideoRecorder(true)}
            className="gap-2 rounded-full"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLocationPicker(true)}
            className={cn(
              "gap-2 rounded-full",
              location && "bg-primary/10 text-primary"
            )}
          >
            <MapPin className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTagPeople(true)}
            className={cn(
              "gap-2 rounded-full",
              taggedUsers.length > 0 && "bg-primary/10 text-primary"
            )}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Recorder */}
        <VideoRecorder
          open={showVideoRecorder}
          onClose={() => setShowVideoRecorder(false)}
          onVideoRecorded={handleVideoRecorded}
        />

        {/* Location Picker */}
        <LocationPicker
          open={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onLocationSelect={setLocation}
          currentLocation={location}
        />

        {/* Tag People */}
        <TagPeopleSheet
          open={showTagPeople}
          onClose={() => setShowTagPeople(false)}
          users={mockUsers.filter(u => u.id !== currentUser.id)}
          taggedUsers={taggedUsers}
          onTagChange={setTaggedUsers}
        />
      </SheetContent>
    </Sheet>
  );
}
