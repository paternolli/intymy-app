import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Image, 
  Star, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  DollarSign,
  Sparkles,
  ShoppingBag,
  MoreVertical,
  Upload,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockCreatorProducts } from '@/data/mockData';
import { Product, ProductCategory } from '@/types';
import { cn } from '@/lib/utils';

const categoryOptions: { value: ProductCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'photo', label: 'Foto', icon: <Image className="h-4 w-4" /> },
  { value: 'video', label: 'Vídeo', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'bundle', label: 'Pacote', icon: <Package className="h-4 w-4" /> },
  { value: 'subscription', label: 'Assinatura', icon: <Star className="h-4 w-4" /> },
  { value: 'custom', label: 'Personalizado', icon: <Sparkles className="h-4 w-4" /> },
  { value: 'polaroid', label: 'Polaroid', icon: <Image className="h-4 w-4" /> },
  { value: 'merchandise', label: 'Produto Físico', icon: <ShoppingBag className="h-4 w-4" /> },
  { value: 'collectible', label: 'Colecionável', icon: <Star className="h-4 w-4" /> },
];

interface CreatorStoreTabProps {
  isOwnProfile: boolean;
  userId: string;
}

export function CreatorStoreTab({ isOwnProfile, userId }: CreatorStoreTabProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(mockCreatorProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'all' | 'digital' | 'physical'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'digital' as 'digital' | 'physical',
    category: 'photo' as ProductCategory,
    imageUrl: '',
    stock: '',
    isFeatured: false,
    isBlurred: false,
    blurPrice: '',
  });

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const digitalCount = products.filter(p => p.type === 'digital').length;
  const physicalCount = products.filter(p => p.type === 'physical').length;
  const totalRevenue = products.reduce((acc, p) => acc + p.price, 0) * 12;
  const activeProducts = products.filter(p => p.isAvailable).length;

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'digital',
      category: 'photo',
      imageUrl: '',
      stock: '',
      isFeatured: false,
      isBlurred: false,
      blurPrice: '',
    });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (!formData.title || !formData.price) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      sellerId: userId,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      type: formData.type,
      category: formData.category,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
      isAvailable: true,
      isFeatured: formData.isFeatured,
      isBlurred: formData.isBlurred,
      blurPrice: formData.isBlurred ? parseFloat(formData.blurPrice) || 0 : undefined,
      stock: formData.type === 'physical' ? parseInt(formData.stock) || 0 : undefined,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
      toast({ title: 'Produto atualizado!', description: 'As alterações foram salvas.' });
    } else {
      setProducts([newProduct, ...products]);
      toast({ title: 'Produto adicionado!', description: 'Seu novo produto está disponível na loja.' });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      type: product.type,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock?.toString() || '',
      isFeatured: product.isFeatured || false,
      isBlurred: product.isBlurred || false,
      blurPrice: product.blurPrice?.toString() || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: 'Produto removido', description: 'O produto foi excluído da sua loja.' });
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  const handleToggleFeatured = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p
    ));
  };

  // Owner view - full management
  return (
    <div className="space-y-5">
      {/* Hero Stats Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Minha Loja</h3>
              <p className="text-xs text-muted-foreground">Gerencie seus produtos</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-xl font-bold">{products.length}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Produtos</p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-xl font-bold">{activeProducts}</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ativos</p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-xl font-bold">+24%</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vendas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Receita total estimada</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            Ver detalhes
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex-1 rounded-xl h-12 gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingProduct ? (
                  <>
                    <Edit2 className="h-5 w-5 text-primary" />
                    Editar Produto
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" />
                    Novo Produto
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Image Upload Preview */}
              <div className="relative aspect-video rounded-xl bg-muted overflow-hidden group cursor-pointer border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <p className="text-sm">Adicionar imagem</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  placeholder="Cole o link da imagem aqui..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Produto *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Pack de fotos exclusivas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o que está incluído..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="29.90"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'digital' | 'physical') => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">
                        <span className="flex items-center gap-2">
                          <Image className="h-4 w-4" /> Digital
                        </span>
                      </SelectItem>
                      <SelectItem value="physical">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4" /> Físico
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          {cat.icon} {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'physical' && (
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantidade em Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Ex: 50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Destacar produto</p>
                    <p className="text-xs text-muted-foreground">Aparece em primeiro na loja</p>
                  </div>
                </div>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Conteúdo com blur</p>
                    <p className="text-xs text-muted-foreground">Usuário paga para desbloquear</p>
                  </div>
                </div>
                <Switch
                  id="blurred"
                  checked={formData.isBlurred}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBlurred: checked })}
                />
              </div>

              {formData.isBlurred && (
                <div className="space-y-2">
                  <Label htmlFor="blurPrice">Preço para desbloquear (R$)</Label>
                  <Input
                    id="blurPrice"
                    type="number"
                    placeholder="Ex: 9.90"
                    value={formData.blurPrice}
                    onChange={(e) => setFormData({ ...formData, blurPrice: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              )}

              <Button className="w-full rounded-xl h-12" onClick={handleAddProduct}>
                {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full">
        <TabsList className="w-full h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger 
            value="all" 
            className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Todos ({products.length})
          </TabsTrigger>
          <TabsTrigger 
            value="digital" 
            className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Image className="h-4 w-4 mr-1.5" />
            Digital ({digitalCount})
          </TabsTrigger>
          <TabsTrigger 
            value="physical" 
            className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Package className="h-4 w-4 mr-1.5" />
            Físico ({physicalCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className={cn(
              "overflow-hidden border-0 shadow-sm transition-all duration-200 hover:shadow-md group",
              !product.isAvailable && "opacity-50"
            )}
          >
            <div className="relative aspect-square">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isFeatured && (
                  <Badge className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5">
                    <Star className="h-3 w-3 mr-0.5" fill="currentColor" />
                    Destaque
                  </Badge>
                )}
                {product.isBlurred && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                    <Lock className="h-3 w-3 mr-0.5" />
                    R$ {product.blurPrice?.toFixed(2)}
                  </Badge>
                )}
                {!product.isAvailable && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    <EyeOff className="h-3 w-3 mr-0.5" />
                    Oculto
                  </Badge>
                )}
              </div>

              {/* Blur overlay */}
              {product.isBlurred && (
                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs font-medium">Conteúdo bloqueado</p>
                  </div>
                </div>
              )}

              {/* Type badge */}
              <Badge 
                className={cn(
                  "absolute top-2 right-2 text-[10px] px-1.5 py-0.5",
                  product.type === 'digital' 
                    ? "bg-primary/90 text-primary-foreground" 
                    : "bg-accent/90 text-accent-foreground"
                )}
              >
                {product.type === 'digital' ? 'Digital' : 'Físico'}
              </Badge>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar produto
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleFeatured(product.id)}>
                      <Star className="h-4 w-4 mr-2" />
                      {product.isFeatured ? 'Remover destaque' : 'Destacar'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleAvailability(product.id)}>
                      {product.isAvailable ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Ocultar produto
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Mostrar produto
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir produto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardContent className="p-3">
              <p className="font-medium text-sm line-clamp-1 mb-1">{product.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.type === 'physical' && product.stock !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {product.stock} em estoque
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="py-16 text-center">
          <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold mb-1">Nenhum produto ainda</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione seu primeiro produto para começar a vender
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar primeiro produto
          </Button>
        </div>
      )}
    </div>
  );
}