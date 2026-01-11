import { useState } from 'react';
import { 
  Rocket, 
  Zap, 
  Crown, 
  Check, 
  Clock, 
  Users, 
  TrendingUp,
  Sparkles,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BoostPlan {
  id: string;
  name: string;
  duration: string;
  durationHours: number;
  price: number;
  multiplier: string;
  reach: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  features: string[];
}

const boostPlans: BoostPlan[] = [
  {
    id: 'quick',
    name: 'Boost Rápido',
    duration: '30 minutos',
    durationHours: 0.5,
    price: 4.90,
    multiplier: '3x',
    reach: '~500 pessoas',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Apareça no topo do Explorar',
      'Badge de destaque temporário',
      'Estatísticas de visualizações'
    ]
  },
  {
    id: 'standard',
    name: 'Boost 24h',
    duration: '24 horas',
    durationHours: 24,
    price: 14.90,
    multiplier: '5x',
    reach: '~3.000 pessoas',
    icon: <Rocket className="h-5 w-5" />,
    color: 'from-primary to-accent',
    popular: true,
    features: [
      'Apareça no topo do Explorar',
      'Seção "Perfis em Destaque"',
      'Badge especial no perfil',
      'Notificação para seguidores',
      'Estatísticas detalhadas'
    ]
  },
  {
    id: 'premium',
    name: 'Super Boost',
    duration: '7 dias',
    durationHours: 168,
    price: 49.90,
    multiplier: '10x',
    reach: '~15.000 pessoas',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Máxima visibilidade',
      'Destaque permanente no Explorar',
      'Badge premium exclusivo',
      'Prioridade em buscas',
      'Relatório completo de alcance',
      'Suporte prioritário'
    ]
  }
];

interface ProfileBoostSheetProps {
  isActive?: boolean;
  remainingTime?: string;
  children: React.ReactNode;
}

export function ProfileBoostSheet({ isActive, remainingTime, children }: ProfileBoostSheetProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBoost = async () => {
    setIsProcessing(true);
    
    // Simulate processing - this would integrate with Stripe
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plan = boostPlans.find(p => p.id === selectedPlan);
    
    toast({
      title: '🚀 Boost Ativado!',
      description: `Seu perfil está em destaque por ${plan?.duration}. Aproveite a visibilidade extra!`,
    });
    
    setIsProcessing(false);
    setIsOpen(false);
  };

  const selectedPlanData = boostPlans.find(p => p.id === selectedPlan);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-xl">Destacar Perfil</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Aumente sua visibilidade e alcance mais pessoas
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Active Boost Status */}
        {isActive && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Boost Ativo!</p>
                  <p className="text-xs text-muted-foreground">
                    Tempo restante: {remainingTime}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Eye className="h-3 w-3 mr-1" />
                5x mais visível
              </Badge>
            </div>
          </div>
        )}

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold">{selectedPlanData?.multiplier}</p>
            <p className="text-[10px] text-muted-foreground">Mais visível</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{selectedPlanData?.reach}</p>
            <p className="text-[10px] text-muted-foreground">Alcance estimado</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <Clock className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p className="text-lg font-bold">{selectedPlanData?.duration}</p>
            <p className="text-[10px] text-muted-foreground">Duração</p>
          </div>
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {boostPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left relative overflow-hidden",
                selectedPlan === plan.id 
                  ? "border-primary bg-primary/5 shadow-lg" 
                  : "border-muted bg-background hover:border-muted-foreground/30"
              )}
            >
              {plan.popular && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white text-[10px]">
                  <Sparkles className="h-3 w-3 mr-0.5" />
                  Popular
                </Badge>
              )}
              
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br",
                  plan.color
                )}>
                  {plan.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <span className="text-xs text-muted-foreground">• {plan.duration}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.multiplier} mais visível • Alcance: {plan.reach}
                  </p>
                </div>
                <div className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedPlan === plan.id 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/30"
                )}>
                  {selectedPlan === plan.id && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Features of selected plan */}
        <div className="p-4 rounded-2xl bg-muted/30 mb-6">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            O que está incluído
          </h4>
          <div className="space-y-2">
            {selectedPlanData?.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
          onClick={handleBoost}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Ativar {selectedPlanData?.name} por R$ {selectedPlanData?.price.toFixed(2)}
              <ChevronRight className="h-5 w-5 ml-auto" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Pagamento seguro • Ativa instantaneamente • Sem renovação automática
        </p>
      </SheetContent>
    </Sheet>
  );
}