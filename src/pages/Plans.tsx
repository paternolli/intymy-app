import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Check, Crown, Sparkles, Star, Gem, Zap, Gift, Eye, Camera, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

type AccountType = 'consumer' | 'creator' | 'both';

interface PlanData {
  id: string;
  name: string;
  tier: string;
  price: number;
  commission?: number; // For creators
  period: string;
  trialDays?: number;
  features: string[];
  isPopular?: boolean;
}

// Consumer plans - for subscribing to creators
const consumerPlans: PlanData[] = [
  {
    id: 'consumer_free',
    name: '👀 O Curioso',
    tier: 'free',
    price: 0,
    period: 'monthly',
    features: [
      'Acesso ao feed básico',
      'Ver previews de conteúdo',
      'Seguir criadores',
      'Comentar em posts públicos',
    ],
  },
  {
    id: 'consumer_basic',
    name: '💖 O Admirador',
    tier: 'basic',
    price: 24.90,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano Curioso',
      'Acesso ilimitado ao conteúdo',
      'Conteúdo exclusivo semanal',
      'Mensagens ilimitadas',
      'Sem anúncios',
    ],
  },
  {
    id: 'consumer_intermediate',
    name: '🌟 O VIP',
    tier: 'intermediate',
    price: 59.90,
    period: 'monthly',
    trialDays: 7,
    isPopular: true,
    features: [
      'Tudo do plano Admirador',
      'Conteúdo em HD',
      'Prioridade no chat',
      'Surpresas mensais exclusivas',
      'Badge VIP no perfil',
    ],
  },
  {
    id: 'consumer_premium',
    name: '💎 O Diamante',
    tier: 'premium',
    price: 119.90,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano VIP',
      'Conteúdo personalizado',
      'Acesso antecipado a novidades',
      '1 conteúdo pago grátis/mês',
      'Suporte prioritário 24/7',
    ],
  },
];

// Creator plans - for selling content
const creatorPlans: PlanData[] = [
  {
    id: 'creator_free',
    name: '👀 O Curioso',
    tier: 'free',
    price: 0,
    commission: 30,
    period: 'monthly',
    features: [
      'Até 10 posts por mês',
      'Vídeos até 1 minuto',
      'Dashboard básico',
      'Receba pagamentos via Pix',
    ],
  },
  {
    id: 'creator_basic',
    name: '💖 O Admirador',
    tier: 'basic',
    price: 29.90,
    commission: 20,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Até 50 posts por mês',
      'Vídeos até 10 minutos',
      'Analytics detalhado',
      'Agendamento de posts',
      'Chat prioritário com fãs',
    ],
  },
  {
    id: 'creator_intermediate',
    name: '🌟 O VIP',
    tier: 'intermediate',
    price: 59.90,
    commission: 15,
    period: 'monthly',
    trialDays: 7,
    isPopular: true,
    features: [
      'Posts ilimitados',
      'Vídeos ilimitados em HD',
      'Lives com fãs',
      'Loja de produtos',
      'Destaque na busca',
      'Badge verificado',
    ],
  },
  {
    id: 'creator_premium',
    name: '💎 O Diamante',
    tier: 'premium',
    price: 119.90,
    commission: 10,
    period: 'monthly',
    trialDays: 7,
    features: [
      'Tudo do plano VIP',
      'Vídeos em 4K',
      'Manager dedicado',
      'Promoção na home',
      'API para integrações',
      'Relatórios avançados',
    ],
  },
];

const planConfig: Record<string, {
  icon: React.ElementType;
  gradient: string;
  buttonClass: string;
  borderClass: string;
  iconColor: string;
}> = {
  free: {
    icon: Star,
    gradient: 'from-slate-500 to-slate-600',
    buttonClass: 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border',
    borderClass: 'border-border',
    iconColor: 'text-slate-500',
  },
  basic: {
    icon: Zap,
    gradient: 'from-blue-500 to-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderClass: 'border-blue-500/30',
    iconColor: 'text-blue-500',
  },
  intermediate: {
    icon: Crown,
    gradient: 'from-purple-500 via-violet-500 to-purple-600',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/25',
    borderClass: 'border-purple-500 ring-2 ring-purple-500/20',
    iconColor: 'text-purple-500',
  },
  premium: {
    icon: Gem,
    gradient: 'from-amber-400 via-yellow-500 to-amber-500',
    buttonClass: 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-amber-400 border border-amber-500/50',
    borderClass: 'border-amber-500/50',
    iconColor: 'text-amber-500',
  },
};

export default function Plans() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountType = (searchParams.get('type') as AccountType) || 'consumer';
  
  const [activeTab, setActiveTab] = useState<'consumer' | 'creator'>(
    accountType === 'creator' ? 'creator' : 'consumer'
  );

  const handleSelectPlan = (planId: string, planType: 'consumer' | 'creator') => {
    // Navigate to auth with selected plan and type
    navigate(`/auth?plan=${planId}&type=${planType}`);
  };

  const renderPlanCard = (plan: PlanData, planType: 'consumer' | 'creator', index: number) => {
    const config = planConfig[plan.tier] || planConfig.free;
    const Icon = config.icon;
    const isPopular = plan.isPopular;
    const isCreator = planType === 'creator';

    return (
      <motion.div
        key={plan.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "relative rounded-2xl border-2 p-5 md:p-6 bg-card transition-all duration-300",
          config.borderClass,
          isPopular && "scale-[1.02] md:scale-105 shadow-xl shadow-purple-500/10",
          !isPopular && "hover:scale-[1.01] hover:shadow-lg"
        )}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              MAIS POPULAR
            </span>
          </div>
        )}

        {/* Icon & Name */}
        <div className={cn("flex items-center gap-3 mb-4", isPopular && "mt-2")}>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
            config.gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">
              {isCreator ? 'Criador' : 'Consumidor'}
            </p>
          </div>
        </div>

        {/* Commission Badge for Creators */}
        {isCreator && plan.commission !== undefined && (
          <div className="mb-4 flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-lg">
            <Percent className="w-4 h-4" />
            <span className="text-xs font-medium">
              Você fica com {100 - plan.commission}% das vendas
            </span>
          </div>
        )}

        {/* Trial Badge */}
        {plan.trialDays && (
          <div className="mb-4 flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg">
            <Gift className="w-4 h-4" />
            <span className="text-xs font-medium">
              {plan.trialDays} dias grátis para testar
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-5">
          {plan.price === 0 ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">Grátis</span>
              {isCreator && plan.commission && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({plan.commission}% comissão)
                </span>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="text-3xl font-bold">{plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              {isCreator && plan.commission && (
                <p className="text-xs text-amber-500 mt-1">
                  + {plan.commission}% de comissão sobre vendas
                </p>
              )}
              {plan.trialDays && (
                <p className="text-xs text-muted-foreground mt-1">
                  Após o período de teste
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {plan.features.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                isPopular ? "bg-purple-500/20" : "bg-primary/10"
              )}>
                <Check className={cn(
                  "w-3 h-3",
                  isPopular ? "text-purple-500" : "text-primary"
                )} />
              </div>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
          {plan.features.length > 5 && (
            <li className="text-xs text-muted-foreground pl-7">
              + {plan.features.length - 5} benefícios adicionais
            </li>
          )}
        </ul>

        {/* CTA Button */}
        <Button
          className={cn(
            "w-full h-12 font-semibold text-sm transition-all",
            config.buttonClass,
            isPopular && "text-base"
          )}
          onClick={() => handleSelectPlan(plan.id, planType)}
        >
          {plan.trialDays ? (
            `Testar ${plan.trialDays} dias grátis`
          ) : plan.price === 0 ? (
            'Começar grátis'
          ) : (
            'Escolher plano'
          )}
        </Button>
      </motion.div>
    );
  };

  const renderPlansGrid = (plans: PlanData[], planType: 'consumer' | 'creator') => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {plans.map((plan, index) => renderPlanCard(plan, planType, index))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 h-14">
          <button onClick={() => navigate('/account-type')} className="hover:bg-muted rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Escolha seu Plano</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-8">
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
            {accountType === 'both' 
              ? 'Escolha seus Planos' 
              : accountType === 'creator' 
                ? 'Planos para Criadores' 
                : 'Planos para Consumidores'
            }
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            {accountType === 'both'
              ? 'Selecione um plano de cada tipo para ter a experiência completa'
              : accountType === 'creator'
                ? 'Monetize seu conteúdo e construa sua comunidade'
                : 'Acesse conteúdos exclusivos dos seus criadores favoritos'
            }
          </motion.p>
        </div>

        {/* Tabs for Both Account Type */}
        {accountType === 'both' ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'consumer' | 'creator')} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="consumer" className="gap-2">
                <Eye className="h-4 w-4" />
                Consumidor
              </TabsTrigger>
              <TabsTrigger value="creator" className="gap-2">
                <Camera className="h-4 w-4" />
                Criador
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="consumer">
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-blue-500">Plano de Consumidor</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Escolha um plano para acessar conteúdos exclusivos e assinar seus criadores favoritos.
                </p>
              </div>
              {renderPlansGrid(consumerPlans, 'consumer')}
            </TabsContent>
            
            <TabsContent value="creator">
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-amber-500">Plano de Criador</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Escolha um plano para vender seu conteúdo. Quanto maior o plano, menor a comissão da plataforma.
                </p>
              </div>
              {renderPlansGrid(creatorPlans, 'creator')}
            </TabsContent>
          </Tabs>
        ) : accountType === 'creator' ? (
          <>
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-amber-500">Como funciona para Criadores</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Você paga uma mensalidade fixa + uma porcentagem sobre suas vendas. Quanto maior o plano, menor a comissão!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Curioso</p>
                  <p className="font-bold text-red-500">30%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Admirador</p>
                  <p className="font-bold text-orange-500">20%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">VIP</p>
                  <p className="font-bold text-amber-500">15%</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Diamante</p>
                  <p className="font-bold text-green-500">10%</p>
                </div>
              </div>
            </div>
            {renderPlansGrid(creatorPlans, 'creator')}
          </>
        ) : (
          renderPlansGrid(consumerPlans, 'consumer')
        )}

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </motion.div>

        {/* Login link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <button 
              onClick={() => navigate('/auth')} 
              className="text-primary font-medium hover:underline"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
