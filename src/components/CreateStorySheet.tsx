import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Camera, Image, Video, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CreateStorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateStory?: (mediaUrl: string, mediaType: 'image' | 'video') => void;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
];

export function CreateStorySheet({ open, onOpenChange, onCreateStory }: CreateStorySheetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSelectImage = (url: string) => {
    setSelectedImage(url);
  };

  const handlePublish = async () => {
    if (!selectedImage) return;
    
    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onCreateStory?.(selectedImage, 'image');
    
    toast({
      title: 'Story publicado!',
      description: 'Seu story ficará visível por 24 horas.',
    });
    
    setIsUploading(false);
    setSelectedImage(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedImage(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-center">Criar Story</SheetTitle>
        </SheetHeader>

        {!selectedImage ? (
          <div className="py-6 space-y-6">
            {/* Upload Options */}
            <div className="grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Câmera</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Image className="h-6 w-6 text-purple-500" />
                </div>
                <span className="text-sm font-medium">Galeria</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Video className="h-6 w-6 text-orange-500" />
                </div>
                <span className="text-sm font-medium">Vídeo</span>
              </button>
            </div>

            {/* Quick Select */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Selecionar imagem (demo)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectImage(url)}
                    className="aspect-[3/4] rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground text-center">
                📸 Stories ficam visíveis por <strong>24 horas</strong> e depois desaparecem automaticamente.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            {/* Preview */}
            <div className="relative aspect-[9/16] max-h-[60vh] mx-auto rounded-2xl overflow-hidden bg-black">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedImage(null)}
              >
                Escolher outra
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={handlePublish}
                disabled={isUploading}
              >
                {isUploading ? 'Publicando...' : 'Publicar Story'}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
