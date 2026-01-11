import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Package, Image, Video, Lock, Unlock, EyeOff, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductCategory } from '@/types';
import { cn } from '@/lib/utils';
import { UnlockProductDialog } from './UnlockProductDialog';
import { useUnlockedProducts } from '@/hooks/useUnlockedProducts';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  photo: <Image className="h-3 w-3" />,
  video: <Video className="h-3 w-3" />,
  bundle: <Package className="h-3 w-3" />,
  subscription: <Lock className="h-3 w-3" />,
  custom: <Heart className="h-3 w-3" />,
  polaroid: <Image className="h-3 w-3" />,
  merchandise: <Package className="h-3 w-3" />,
  collectible: <Package className="h-3 w-3" />,
};

const categoryLabels: Record<ProductCategory, string> = {
  photo: 'Foto',
  video: 'Vídeo',
  bundle: 'Pacote',
  subscription: 'Assinatura',
  custom: 'Personalizado',
  polaroid: 'Polaroid',
  merchandise: 'Produto',
  collectible: 'Colecionável',
};

const VIEW_DURATION = 30; // seconds

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewTimer, setViewTimer] = useState(VIEW_DURATION);
  const { isUnlocked, unlockProduct } = useUnlockedProducts();

  const productIsUnlocked = isUnlocked(product.id);
  
  // Show blur if: product has blur AND (not unlocked OR unlocked but not currently viewing)
  const showBlur = product.isBlurred && (!productIsUnlocked || (productIsUnlocked && !isViewing));

  // Timer countdown when viewing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isViewing && productIsUnlocked) {
      interval = setInterval(() => {
        setViewTimer(prev => {
          if (prev <= 1) {
            setIsViewing(false);
            return VIEW_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isViewing, productIsUnlocked]);

  // Reset timer when starting to view
  const startViewing = useCallback(() => {
    setViewTimer(VIEW_DURATION);
    setIsViewing(true);
  }, []);

  const stopViewing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewing(false);
    setViewTimer(VIEW_DURATION);
  }, []);

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If already unlocked, just toggle viewing
    if (productIsUnlocked && product.isBlurred) {
      if (isViewing) {
        stopViewing(e);
      } else {
        startViewing();
      }
      return;
    }
    
    // If needs unlock, show dialog
    if (product.isBlurred && !productIsUnlocked) {
      setShowUnlockDialog(true);
      return;
    }
    
    toast({
      title: 'Produto adicionado!',
      description: `${product.title} foi adicionado ao carrinho.`,
    });
  };

  const handleUnlock = (productId: string) => {
    unlockProduct(productId);
    startViewing(); // Start viewing immediately after unlock
    toast({
      title: 'Conteúdo desbloqueado!',
      description: `Você tem ${VIEW_DURATION} segundos para visualizar. Clique novamente quando quiser ver.`,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewProduct}>
        <div className="flex">
          <div className="relative w-28 h-28 flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                showBlur && "blur-xl scale-110"
              )}
            />
            {showBlur && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            )}
            {product.type === 'digital' && !showBlur && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryIcons[product.category]}
                  <span className="ml-1">{categoryLabels[product.category]}</span>
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleLike}>
                  <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                </Button>
                <Button size="sm" className="h-8" onClick={handleBuy}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow" onClick={handleViewProduct}>
      <div className="relative aspect-square">
        <img
          src={product.imageUrl}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            showBlur && "blur-xl scale-110"
          )}
        />
        
        {/* Blur overlay for locked content (not paid) */}
        {product.isBlurred && !productIsUnlocked && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <Lock className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm font-medium">Conteúdo bloqueado</p>
              <p className="text-xs opacity-80">R$ {product.blurPrice?.toFixed(2)} para desbloquear</p>
            </div>
          </div>
        )}

        {/* Blur overlay for unlocked but hidden content (paid, auto-hidden) */}
        {product.isBlurred && productIsUnlocked && !isViewing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Conteúdo oculto</p>
              <Button 
                size="sm" 
                variant="secondary"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  startViewing();
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            </div>
          </div>
        )}

        {/* Timer and hide button when viewing unlocked content */}
        {product.isBlurred && productIsUnlocked && isViewing && (
          <>
            {/* Timer badge */}
            <div className="absolute top-2 left-2 z-20">
              <Badge className="bg-black/70 text-white text-xs gap-1">
                <Timer className="h-3 w-3" />
                {viewTimer}s
              </Badge>
            </div>
            
            {/* Hide button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 z-20 h-8 w-8 bg-black/70 hover:bg-black/90 text-white"
              onClick={stopViewing}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Unlocked indicator (when not viewing) */}
        {product.isBlurred && productIsUnlocked && !isViewing && (
          <div className="absolute bottom-2 left-2 z-20">
            <Badge className="bg-green-500/90 text-white text-xs">
              <Unlock className="h-3 w-3 mr-1" />
              Comprado
            </Badge>
          </div>
        )}
        
        {/* Overlay */}
        {!showBlur && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        
        {/* Category Badge */}
        {!showBlur && !isViewing && (
          <div className="absolute top-2 left-2 z-20">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm">
              {categoryIcons[product.category]}
              <span className="ml-1">{categoryLabels[product.category]}</span>
            </Badge>
          </div>
        )}

        {/* Type Badge */}
        {!product.isBlurred && (
          <div className="absolute top-2 right-2 z-20">
            <Badge 
              variant={product.type === 'digital' ? 'default' : 'outline'} 
              className="text-xs"
            >
              {product.type === 'digital' ? 'Digital' : 'Físico'}
            </Badge>
          </div>
        )}

        {/* Blur Price Badge */}
        {product.isBlurred && !productIsUnlocked && (
          <div className="absolute bottom-2 left-2 z-20">
            <Badge className="bg-primary text-primary-foreground text-xs">
              <Lock className="h-3 w-3 mr-1" />
              R$ {product.blurPrice?.toFixed(2)}
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && !showBlur && !product.isBlurred && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-yellow-500 text-black text-xs">
              ⭐ Destaque
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        {!showBlur && !product.isBlurred && (
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleLike}>
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Stock indicator */}
        {product.type === 'physical' && product.stock !== undefined && product.stock <= 5 && !showBlur && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="destructive" className="text-xs">
              {product.stock === 0 ? 'Esgotado' : `Últimas ${product.stock}!`}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          {product.isBlurred ? (
            productIsUnlocked ? (
              <Button 
                size="sm" 
                className="h-8" 
                variant={isViewing ? "outline" : "default"}
                onClick={handleBuy}
              >
                {isViewing ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </>
                )}
              </Button>
            ) : (
              <Button size="sm" className="h-8" onClick={handleBuy}>
                <Lock className="h-4 w-4 mr-1" />
                Desbloquear
              </Button>
            )
          ) : (
            <Button size="sm" className="h-8" onClick={handleBuy}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Comprar
            </Button>
          )}
        </div>
      </CardContent>

      <UnlockProductDialog
        product={product}
        open={showUnlockDialog}
        onOpenChange={setShowUnlockDialog}
        onUnlock={handleUnlock}
      />
    </Card>
  );
}
