import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Check, Crown, Sparkles, Star, Gem, Zap, Gift, ArrowRight, ChevronRight } from 'lucide-react';
import { subscriptionPlans } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionTier } from '@/types';

interface SubscriptionUpgradeCardProps {
  currentTier: SubscriptionTier;
  children?: React.ReactNode;
}

const planConfig: Record<string, {
  icon: React.ElementType;
  gradient: string;
  buttonClass: string;
  borderClass: string;
  color: string;
}> = {
  plano_free: {
    icon: Star,
    gradient: 'from-slate-500 to-slate-600',
    buttonClass: 'bg-muted text-muted-foreground',
    borderClass: 'border-border',
    color: 'text-slate-500',
  },
  plano_basico: {
    icon: Zap,
    gradient: 'from-blue-500 to-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    borderClass: 'border-blue-500/30',
    color: 'text-blue-500',
  },
  plano_intermediario: {
    icon: Crown,
    gradient: 'from-purple-500 via-violet-500 to-purple-600',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white',
    borderClass: 'border-purple-500',
    color: 'text-purple-500',
  },
  plano_premium: {
    icon: Gem,
    gradient: 'from-amber-400 via-yellow-500 to-amber-500',
    buttonClass: 'bg-gradient-to-r from-slate-900 to-slate-800 text-amber-400 border border-amber-500/50',
    borderClass: 'border-amber-500/50',
    color: 'text-amber-500',
  },
};

const tierToId: Record<SubscriptionTier, string> = {
  free: 'plano_free',
  basic: 'plano_basico',
  intermediate: 'plano_intermediario',
  premium: 'plano_premium',
};

const tierOrder: SubscriptionTier[] = ['free', 'basic', 'intermediate', 'premium'];

export function SubscriptionUpgradeCard({ currentTier, children }: SubscriptionUpgradeCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);

  const currentPlanId = tierToId[currentTier];
  const currentPlan = subscriptionPlans.find(p => p.id === currentPlanId);
  const currentConfig = planConfig[currentPlanId];
  const CurrentIcon = currentConfig?.icon || Star;

  // Get upgrade options (plans higher than current)
  const currentTierIndex = tierOrder.indexOf(currentTier);
  const upgradeOptions = subscriptionPlans.filter(plan => {
    const planTierIndex = tierOrder.indexOf(plan.tier);
    return planTierIndex > currentTierIndex;
  });

  const handleUpgrade = async (planId: string, planName: string, price: number) => {
    setSelectedUpgrade(planId);
    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Upgrade simulado!',
      description: `Você fez upgrade para o plano ${planName}. Em produção, seria redirecionado para o pagamento.`,
    });

    setIsProcessing(false);
    setSelectedUpgrade(null);
    setIsOpen(false);
  };

  const handleOneTimePurchase = () => {
    setIsOpen(false);
    navigate('/store');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <button className="w-full p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  currentConfig?.gradient
                )}>
                  <CurrentIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{currentPlan?.name || 'Plano Atual'}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentTier === 'premium' ? 'Você tem o melhor plano!' : 'Toque para fazer upgrade'}
                  </p>
                </div>
              </div>
              {currentTier !== 'premium' && (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>
        )}
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Gerenciar Assinatura
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-60px)] pb-6">
          {/* Current Plan */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Seu plano atual</p>
            <div className={cn(
              "p-4 rounded-xl border-2",
              currentConfig?.borderClass
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                  currentConfig?.gradient
                )}>
                  <CurrentIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{currentPlan?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan?.price === 0 ? 'Grátis' : `R$ ${currentPlan?.price.toFixed(2).replace('.', ',')}/mês`}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  Ativo
                </span>
              </div>
            </div>
          </div>

          {/* Upgrade Options */}
          {upgradeOptions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Fazer upgrade</p>
              <div className="space-y-3">
                {upgradeOptions.map((plan) => {
                  const config = planConfig[plan.id];
                  const Icon = config?.icon || Star;
                  const isSelected = selectedUpgrade === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        config?.borderClass,
                        plan.isPopular && "ring-2 ring-purple-500/20"
                      )}
                    >
                      {plan.isPopular && (
                        <span className="inline-block text-xs font-medium text-purple-500 mb-2">
                          ⭐ Mais popular
                        </span>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                          config?.gradient
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-xs text-muted-foreground">/mês</span>
                          </div>
                        </div>
                      </div>

                      {plan.trialDays && (
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg mb-3">
                          <Gift className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {plan.trialDays} dias grátis para testar
                          </span>
                        </div>
                      )}

                      <ul className="space-y-1.5 mb-4">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={cn("w-full", config?.buttonClass)}
                        onClick={() => handleUpgrade(plan.id, plan.name, plan.price)}
                        disabled={isProcessing && isSelected}
                      >
                        {isProcessing && isSelected ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processando...
                          </div>
                        ) : plan.trialDays ? (
                          <>
                            Testar {plan.trialDays} dias grátis
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Fazer Upgrade
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* One-time Purchase Option */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-3">Ou compre conteúdo avulso</p>
            <button
              onClick={handleOneTimePurchase}
              className="w-full p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Compras Avulsas</p>
                  <p className="text-xs text-muted-foreground">
                    Compre fotos, vídeos e conteúdos individuais
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </div>

          {/* Manage Subscription */}
          {currentTier !== 'free' && (
            <div className="mt-6 pt-6 border-t">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Gerenciar forma de pagamento
              </button>
              <span className="mx-2 text-muted-foreground">•</span>
              <button className="text-sm text-red-500 hover:text-red-600 transition-colors">
                Cancelar assinatura
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
