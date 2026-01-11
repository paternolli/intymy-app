import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Check, Share, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Icon */}
        <div className="text-center">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-pink-600 mx-auto flex items-center justify-center shadow-2xl shadow-primary/30">
            <Smartphone className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-6 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
            íNtymy
          </h1>
          <p className="text-muted-foreground mt-2">
            Instale o app para uma experiência completa
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <h2 className="font-semibold text-lg">Benefícios do app</h2>
          
          <div className="space-y-3">
            {[
              'Acesso rápido pela tela inicial',
              'Funciona offline',
              'Notificações em tempo real',
              'Experiência em tela cheia',
              'Carregamento mais rápido'
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Install Instructions/Button */}
        {isInstalled ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-green-500">App instalado!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              O app já está na sua tela inicial
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4 rounded-full"
            >
              Abrir o app
            </Button>
          </div>
        ) : isIOS ? (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-semibold text-center mb-4">Como instalar no iPhone</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm">Toque no botão <Share className="inline h-4 w-4" /> compartilhar na barra do Safari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm">Role para baixo e toque em <Plus className="inline h-4 w-4" /> "Adicionar à Tela de Início"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm">Toque em "Adicionar" no canto superior direito</p>
                </div>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <Button 
            onClick={handleInstall}
            size="lg"
            className="w-full rounded-full h-14 text-lg gap-3"
          >
            <Download className="h-5 w-5" />
            Instalar App
          </Button>
        ) : (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-semibold text-center mb-4">Como instalar no Android</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm">Toque no menu <MoreVertical className="inline h-4 w-4" /> do navegador (3 pontinhos)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm">Toque em "Instalar app" ou "Adicionar à tela inicial"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm">Confirme a instalação</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skip button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continuar no navegador
        </button>
      </div>
    </div>
  );
}
