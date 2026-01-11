import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Package, Image, Video, Gift, ShoppingBag, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { ProductCard } from '@/components/ProductCard';
import { mockCreatorProducts, mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ProductCategory } from '@/types';

const categoryLabels: Record<ProductCategory, { label: string; icon: React.ReactNode }> = {
  photo: { label: 'Fotos', icon: <Image className="h-4 w-4" /> },
  video: { label: 'Vídeos', icon: <Video className="h-4 w-4" /> },
  bundle: { label: 'Pacotes', icon: <Package className="h-4 w-4" /> },
  subscription: { label: 'Assinaturas', icon: <Star className="h-4 w-4" /> },
  custom: { label: 'Personalizados', icon: <Gift className="h-4 w-4" /> },
  polaroid: { label: 'Polaroids', icon: <Image className="h-4 w-4" /> },
  merchandise: { label: 'Produtos', icon: <ShoppingBag className="h-4 w-4" /> },
  collectible: { label: 'Colecionáveis', icon: <Gift className="h-4 w-4" /> },
};

export default function CreatorStore() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Get creator info (mock)
  const creator = mockUsers.find(u => u.id === id) || mockUsers[0];
  
  // Filter products
  const digitalProducts = mockCreatorProducts.filter(p => p.type === 'digital');
  const physicalProducts = mockCreatorProducts.filter(p => p.type === 'physical');

  const filterProducts = (products: typeof mockCreatorProducts) => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Loja de {creator.members[0].name}</h1>
              <p className="text-xs text-muted-foreground">
                {mockCreatorProducts.length} produtos disponíveis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Store Banner */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/5">
        <img
          src={creator.coverPhoto}
          alt="Store cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <img
              src={creator.members[0].avatar}
              alt={creator.members[0].name}
              className="w-16 h-16 rounded-full border-4 border-background object-cover"
            />
            <div>
              <h2 className="font-bold text-lg">{creator.members[0].name}</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>4.9</span>
                <span>•</span>
                <span>+500 vendas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory('all')}
          >
            <Filter className="h-3 w-3 mr-1" />
            Todos
          </Badge>
          {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
            <Badge
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(key as ProductCategory)}
            >
              {icon}
              <span className="ml-1">{label}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Products Tabs */}
      <Tabs defaultValue="digital" className="px-4">
        <TabsList className="w-full">
          <TabsTrigger value="digital" className="flex-1">
            <Image className="h-4 w-4 mr-2" />
            Digitais ({digitalProducts.length})
          </TabsTrigger>
          <TabsTrigger value="physical" className="flex-1">
            <Package className="h-4 w-4 mr-2" />
            Físicos ({physicalProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="digital" className="mt-4">
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-3'
                : 'flex flex-col gap-3'
            )}
          >
            {filterProducts(digitalProducts).map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
          {filterProducts(digitalProducts).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum produto nesta categoria
            </p>
          )}
        </TabsContent>

        <TabsContent value="physical" className="mt-4">
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-3'
                : 'flex flex-col gap-3'
            )}
          >
            {filterProducts(physicalProducts).map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
          {filterProducts(physicalProducts).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum produto nesta categoria
            </p>
          )}
        </TabsContent>
      </Tabs>

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
