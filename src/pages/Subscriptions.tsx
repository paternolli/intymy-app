import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Crown, Sparkles, Star, Gem, Zap, Gift } from 'lucide-react';
import { subscriptionPlans } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const planConfig: Record<string, {
  icon: React.ElementType;
  gradient: string;
  buttonClass: string;
  borderClass: string;
  iconColor: string;
  cta: string;
}> = {
  plano_free: {
    icon: Star,
    gradient: 'from-slate-500 to-slate-600',
    buttonClass: 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border',
    borderClass: 'border-border',
    iconColor: 'text-slate-500',
    cta: 'Junte-se de Graça',
  },
  plano_basico: {
    icon: Zap,
    gradient: 'from-blue-500 to-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderClass: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    cta: 'Comece a Experiência',
  },
  plano_intermediario: {
    icon: Crown,
    gradient: 'from-purple-500 via-violet-500 to-purple-600',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/25',
    borderClass: 'border-purple-500 ring-2 ring-purple-500/20',
    iconColor: 'text-purple-500',
    cta: 'Torne-se VIP',
  },
  plano_premium: {
    icon: Gem,
    gradient: 'from-amber-400 via-yellow-500 to-amber-500',
    buttonClass: 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-amber-400 border border-amber-500/50',
    borderClass: 'border-amber-500/50',
    iconColor: 'text-amber-500',
    cta: 'Experiência Máxima',
  },
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (planId: string, planName: string, price: number) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (planId === 'plano_free') {
      // Free plan - direct signup
      toast({
        title: 'Bem-vindo ao plano Curioso!',
        description: 'Você agora tem acesso ao conteúdo básico.',
      });
      navigate('/auth?mode=signup&plan=free');
    } else {
      // Paid plans - redirect to checkout (mock)
      toast({
        title: 'Redirecionando para pagamento...',
        description: `Plano ${planName} - R$ ${price.toFixed(2)}/mês`,
      });
      // In real implementation, this would redirect to Stripe/payment gateway
      // For now, show success and navigate
      setTimeout(() => {
        toast({
          title: 'Pagamento simulado com sucesso!',
          description: 'Em produção, você seria redirecionado para o gateway de pagamento.',
        });
        setIsProcessing(false);
        setSelectedPlan(null);
      }, 1000);
    }

    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 h-14">
          <button onClick={() => navigate(-1)} className="hover:bg-muted rounded-full p-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Escolha seu Plano</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            Desbloqueie Experiências Exclusivas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Escolha o plano ideal para você e tenha acesso a conteúdos únicos
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {subscriptionPlans.map((plan, index) => {
            const config = planConfig[plan.id] || planConfig.plano_free;
            const Icon = config.icon;
            const isPopular = plan.isPopular;
            const isSelected = selectedPlan === plan.id;

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
                      {plan.tier === 'free' ? 'Grátis' : 'Premium'}
                    </p>
                  </div>
                </div>

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
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <span className="text-3xl font-bold">{plan.price.toFixed(2).replace('.', ',')}</span>
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </div>
                      {plan.trialDays && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Após o período de teste
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">
                  {plan.id === 'plano_free' && 'Acesso básico a fotos e vídeos iniciais.'}
                  {plan.id === 'plano_basico' && 'Acesso ilimitado + conteúdo exclusivo semanal.'}
                  {plan.id === 'plano_intermediario' && 'Conteúdo HD + prioridade no chat + surpresas mensais.'}
                  {plan.id === 'plano_premium' && 'Tudo + conteúdo personalizado + acesso antecipado.'}
                </p>

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
                  onClick={() => handleSubscribe(plan.id, plan.name, plan.price)}
                  disabled={isProcessing && isSelected}
                >
                  {isProcessing && isSelected ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : plan.trialDays ? (
                    `Testar ${plan.trialDays} dias grátis`
                  ) : (
                    config.cta
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

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

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <button className="text-sm text-primary hover:underline">
            Dúvidas frequentes sobre os planos
          </button>
        </div>
      </main>

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
