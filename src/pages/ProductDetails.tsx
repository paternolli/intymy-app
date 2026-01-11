import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Truck,
  Shield,
  MessageCircle,
  Image,
  Video,
  Lock,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { mockCreatorProducts, mockUsers } from '@/data/mockData';
import { ProductCategory } from '@/types';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  photo: <Image className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  bundle: <Package className="h-4 w-4" />,
  subscription: <Lock className="h-4 w-4" />,
  custom: <Heart className="h-4 w-4" />,
  polaroid: <Image className="h-4 w-4" />,
  merchandise: <Package className="h-4 w-4" />,
  collectible: <Package className="h-4 w-4" />,
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

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userId: '2',
    userName: 'Luna Star',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 5,
    comment: 'Produto incrível! Qualidade excepcional e chegou super rápido. Recomendo muito!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    helpful: 12,
  },
  {
    id: '2',
    userId: '3',
    userName: 'Alex & Sam',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4,
    comment: 'Muito bom! Valeu cada centavo. Só demorou um pouco pra entregar.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    helpful: 8,
  },
  {
    id: '3',
    userId: '4',
    userName: 'Marina Costa',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    comment: 'Perfeito! Exatamente como nas fotos. A criadora é muito atenciosa.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    helpful: 15,
  },
];

const ratingDistribution = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  
  const product = mockCreatorProducts.find(p => p.id === id) || mockCreatorProducts[0];
  const seller = mockUsers.find(u => u.id === product?.sellerId) || mockUsers[0];
  
  // Create image gallery from product
  const images = product?.images?.length 
    ? product.images 
    : [product?.imageUrl, product?.imageUrl, product?.imageUrl];
  
  const averageRating = 4.7;
  const totalReviews = 127;

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleAddToCart = () => {
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${quantity}x ${product.title} foi adicionado.`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: 'Redirecionando para pagamento...',
      description: `Preparando compra de ${product.title}.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copiado!',
      description: 'O link do produto foi copiado para a área de transferência.',
    });
  };

  const handleSubmitReview = () => {
    if (!newReview.trim()) return;
    toast({
      title: 'Avaliação enviada!',
      description: 'Obrigado pelo seu feedback.',
    });
    setNewReview('');
  };

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Detalhes do Produto</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Image Gallery */}
        <div className="relative aspect-square bg-muted">
          <img
            src={images[currentImageIndex]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 hover:opacity-100"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentImageIndex 
                    ? "bg-primary w-6" 
                    : "bg-white/60 hover:bg-white/80"
                )}
              />
            ))}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="backdrop-blur-sm">
              {categoryIcons[product.category]}
              <span className="ml-1">{categoryLabels[product.category]}</span>
            </Badge>
            <Badge variant={product.type === 'digital' ? 'default' : 'outline'}>
              {product.type === 'digital' ? 'Digital' : 'Físico'}
            </Badge>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                index === currentImageIndex 
                  ? "border-primary" 
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Seller Info */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${seller.id}`)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={seller.members[0].avatar} />
              <AvatarFallback>{seller.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">@{seller.username}</p>
              <p className="text-xs text-muted-foreground">Vendido por</p>
            </div>
          </div>

          <Separator />

          {/* Title & Price */}
          <div>
            <h1 className="text-xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(averageRating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-muted-foreground"
                    )} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{averageRating}</span>
              <span className="text-sm text-muted-foreground">({totalReviews} avaliações)</span>
            </div>
            <p className="text-3xl font-bold text-primary mt-3">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity & Stock */}
          {product.type === 'physical' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm">Quantidade:</span>
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              {product.stock !== undefined && (
                <span className="text-sm text-muted-foreground">
                  {product.stock} disponíveis
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1" size="lg" onClick={handleBuyNow}>
              Comprar Agora
            </Button>
            <Button variant="outline" size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 p-3 bg-muted rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs text-center">Envio Rápido</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs text-center">Compra Segura</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-muted rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-xs text-center">Suporte 24h</span>
            </div>
          </div>

          <Separator />

          {/* Tabs: Description & Reviews */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Avaliações ({totalReviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.type === 'digital' && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Entrega Digital
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Você receberá o acesso imediatamente após a confirmação do pagamento.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-4">
              {/* Rating Summary */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{averageRating}</p>
                      <div className="flex items-center justify-center mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={cn(
                              "h-4 w-4",
                              star <= Math.round(averageRating) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-muted-foreground"
                            )} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalReviews} avaliações
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs w-3">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Progress 
                            value={ratingDistribution[rating as keyof typeof ratingDistribution]} 
                            className="h-2 flex-1" 
                          />
                          <span className="text-xs text-muted-foreground w-8">
                            {ratingDistribution[rating as keyof typeof ratingDistribution]}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Write Review */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Escreva uma avaliação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setNewRating(star)}>
                        <Star 
                          className={cn(
                            "h-6 w-6 transition-colors",
                            star <= newRating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-muted-foreground hover:text-yellow-400"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Compartilhe sua experiência..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <Button onClick={handleSubmitReview} className="w-full" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Avaliação
                  </Button>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-3">
                {mockReviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{review.userName}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center mt-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-muted-foreground"
                                )} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {review.comment}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                            👍 Útil ({review.helpful})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
