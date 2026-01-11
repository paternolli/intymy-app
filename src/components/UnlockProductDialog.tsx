import { useState } from 'react';
import { Lock, Unlock, CreditCard, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface UnlockProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (productId: string) => void;
}

export function UnlockProductDialog({
  product,
  open,
  onOpenChange,
  onUnlock,
}: UnlockProductDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUnlock = async () => {
    if (!product) return;
    
    setIsProcessing(true);
    
    // Simula processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Aguarda animação de sucesso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUnlock(product.id);
    setIsSuccess(false);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Conteúdo Desbloqueado!
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 text-primary" />
                Desbloquear Conteúdo
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? 'Você agora tem acesso completo a este conteúdo.'
              : 'Este conteúdo está protegido. Faça o pagamento para ter acesso completo.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Preview */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className={`w-full h-48 object-cover ${isSuccess ? '' : 'blur-xl'}`}
            />
            {!isSuccess && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Lock className="h-12 w-12 text-white/80" />
              </div>
            )}
            {isSuccess && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <Unlock className="h-12 w-12 text-green-500" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{product.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
          </div>

          {/* Price */}
          {!isSuccess && (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Preço para desbloquear</p>
              <p className="text-3xl font-bold text-primary mt-1">
                R$ {product.blurPrice?.toFixed(2)}
              </p>
            </div>
          )}

          {/* Action Button */}
          {!isSuccess && (
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleUnlock}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagar e Desbloquear
                </>
              )}
            </Button>
          )}

          {isSuccess && (
            <Button 
              className="w-full" 
              size="lg" 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Acessar Conteúdo
            </Button>
          )}

          {/* Security Note */}
          {!isSuccess && (
            <p className="text-xs text-center text-muted-foreground">
              🔒 Pagamento simulado para demonstração
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
