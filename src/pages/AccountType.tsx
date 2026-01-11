import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Eye, 
  Sparkles, 
  Crown,
  Heart,
  Camera,
  DollarSign,
  Users,
  Play,
  Star,
  Infinity,
  Check,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

type AccountType = 'consumer' | 'creator' | 'both';

interface AccountOption {
  type: AccountType;
  title: string;
  subtitle: string;
  emoji: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  borderColor: string;
  benefits: string[];
  cta: string;
}

const accountOptions: AccountOption[] = [
  {
    type: 'consumer',
    title: 'Quero Curtir',
    subtitle: 'Consumidor de conteúdo',
    emoji: '👀',
    icon: Play,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
    benefits: [
      'Acesse conteúdos exclusivos',
      'Assine seus criadores favoritos',
      'Interaja via chat e comentários',
      'Receba notificações de novidades',
    ],
    cta: 'Quero consumir conteúdo',
  },
  {
    type: 'creator',
    title: 'Quero Criar',
    subtitle: 'Criador de conteúdo',
    emoji: '⭐',
    icon: Camera,
    color: 'text-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30 hover:border-amber-500',
    benefits: [
      'Monetize seu conteúdo',
      'Crie sua base de fãs',
      'Receba pagamentos mensais',
      'Dashboard de analytics',
    ],
    cta: 'Quero criar conteúdo',
  },
  {
    type: 'both',
    title: 'Quero os Dois',
    subtitle: 'Consumidor + Criador',
    emoji: '💎',
    icon: Infinity,
    color: 'text-purple-500',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    borderColor: 'border-purple-500/30 hover:border-purple-500 ring-2 ring-purple-500/20',
    benefits: [
      'Todos os benefícios de consumidor',
      'Todos os benefícios de criador',
      'Assine outros e seja assinado',
      'Maximize sua experiência',
    ],
    cta: 'Quero a experiência completa',
  },
];

export default function AccountType() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [isHovering, setIsHovering] = useState<AccountType | null>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    
    // Navigate to plans with account type
    navigate(`/plans?type=${selectedType}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-4 px-4 h-14">
          <button 
            onClick={() => navigate('/auth')} 
            className="hover:bg-muted rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">Tipo de Conta</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-4"
          >
            <img src={logo} alt="íNtymy" className="h-16 w-16 object-contain" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Como você quer usar o íNtymy?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Escolha seu perfil ideal. Você pode mudar isso depois nas configurações.
          </motion.p>
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {accountOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedType === option.type;
            const isHovered = isHovering === option.type;
            const isBoth = option.type === 'both';

            return (
              <motion.button
                key={option.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedType(option.type)}
                onMouseEnter={() => setIsHovering(option.type)}
                onMouseLeave={() => setIsHovering(null)}
                className={cn(
                  "relative text-left rounded-2xl border-2 p-5 md:p-6 bg-card transition-all duration-300",
                  option.borderColor,
                  isSelected && "ring-2 ring-offset-2 ring-offset-background",
                  isSelected && option.type === 'consumer' && "ring-blue-500 border-blue-500",
                  isSelected && option.type === 'creator' && "ring-amber-500 border-amber-500",
                  isSelected && option.type === 'both' && "ring-purple-500 border-purple-500",
                  isBoth && "md:scale-105 shadow-xl shadow-purple-500/10"
                )}
              >
                {/* Recommended Badge */}
                {isBoth && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      RECOMENDADO
                    </span>
                  </div>
                )}

                {/* Selection Indicator */}
                <div className={cn(
                  "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected 
                    ? `bg-gradient-to-r ${option.gradient} border-transparent` 
                    : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>

                {/* Icon & Title */}
                <div className={cn("flex items-center gap-3 mb-4", isBoth && "mt-2")}>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                    option.gradient
                  )}>
                    <span className="text-2xl">{option.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{option.title}</h3>
                    <p className={cn("text-sm", option.color)}>{option.subtitle}</p>
                  </div>
                </div>

                {/* Benefits */}
                <ul className="space-y-2.5 mb-4">
                  {option.benefits.map((benefit, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-gradient-to-br",
                        option.gradient
                      )}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Visual indicator on hover/select */}
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: isSelected || isHovered ? 1 : 0,
                    y: isSelected || isHovered ? 0 : 10 
                  }}
                  className={cn(
                    "text-sm font-medium text-center py-2 rounded-lg bg-gradient-to-r",
                    option.gradient,
                    "text-white"
                  )}
                >
                  {isSelected ? '✓ Selecionado' : option.cta}
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Info Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Consumer Info */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold text-blue-500">Consumidor</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Assine criadores e acesse conteúdos exclusivos. Escolha entre planos gratuitos ou premium com benefícios extras.
            </p>
          </div>

          {/* Creator Info */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-amber-500" />
              <h4 className="font-semibold text-amber-500">Criador</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Monetize seu conteúdo e construa sua comunidade. Receba até 90% das suas vendas dependendo do seu plano.
            </p>
          </div>
        </motion.div>

        {/* Earnings Preview for Creators */}
        {(selectedType === 'creator' || selectedType === 'both') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Potencial de Ganhos</h4>
                <p className="text-sm text-muted-foreground">Como criador no íNtymy</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">10 assinantes</p>
                <p className="font-bold text-amber-500">R$ 200+/mês</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">50 assinantes</p>
                <p className="font-bold text-amber-500">R$ 1.000+/mês</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">100 assinantes</p>
                <p className="font-bold text-amber-500">R$ 2.000+/mês</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">500 assinantes</p>
                <p className="font-bold text-amber-500">R$ 10.000+/mês</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              *Valores estimados baseados em assinatura média de R$ 25/mês
            </p>
          </motion.div>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          <Button
            size="lg"
            className={cn(
              "w-full h-14 text-lg font-semibold transition-all",
              selectedType === 'consumer' && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
              selectedType === 'creator' && "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
              selectedType === 'both' && "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600",
              !selectedType && "bg-muted text-muted-foreground"
            )}
            disabled={!selectedType}
            onClick={handleContinue}
          >
            {selectedType ? (
              <>
                Continuar
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Selecione uma opção acima'
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            Você pode adicionar ou mudar seu tipo de conta depois nas configurações
          </p>
        </div>
      </div>
    </div>
  );
}
