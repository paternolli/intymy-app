import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Heart, UserPlus, ShieldCheck, X } from 'lucide-react';
import { ProfileType } from '@/types';
import logo from '@/assets/logo.png';

type AuthStep = 'choice' | 'age-verification' | 'login' | 'register' | 'profile-type' | 'profile-info' | 'invite';

const profileTypeOptions: { type: ProfileType; label: string; description: string; emoji: string; maxMembers: number }[] = [
  { type: 'single', label: 'Solteiro(a)', description: 'Perfil individual', emoji: '🎈', maxMembers: 1 },
  { type: 'dating', label: 'Namorando', description: 'Namorados com perfis separados', emoji: '💕', maxMembers: 2 },
  { type: 'couple', label: 'Casal', description: 'Casal com perfis juntos', emoji: '💑', maxMembers: 2 },
  { type: 'throuple', label: 'Trisal', description: 'Três perfis, um acesso', emoji: '👨‍👩‍👧', maxMembers: 3 },
];

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { login, createProfile, acceptInvitation, getPendingInvitations } = useAuth();
  
  const inviteId = searchParams.get('invite');
  const selectedPlanId = searchParams.get('plan');
  
  const [step, setStep] = useState<AuthStep>(inviteId ? 'invite' : selectedPlanId ? 'age-verification' : 'choice');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType | null>(null);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  // Invite form
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteName, setInviteName] = useState('');

  // Age verification
  const [age, setAge] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(loginEmail, loginPassword);
    
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: 'Bem-vindo de volta!' });
      navigate('/');
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileType) return;
    
    setIsLoading(true);
    
    const result = await createProfile({
      profileType: selectedProfileType,
      username,
      bio,
      memberName: registerName,
      email: registerEmail,
      password: registerPassword,
      subscriptionPlanId: selectedPlanId || undefined,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      const planName = selectedPlanId ? 
        { 'plano_free': 'Curioso', 'plano_basico': 'Proximidade', 'plano_intermediario': 'Íntimo', 'plano_premium': 'Diamante' }[selectedPlanId] || '' : '';
      toast({ 
        title: 'Conta criada com sucesso!',
        description: planName ? `Você assinou o plano ${planName}` : undefined
      });
      navigate('/');
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId) return;
    
    setIsLoading(true);
    
    const result = await acceptInvitation({
      invitationId: inviteId,
      email: inviteEmail,
      password: invitePassword,
      memberName: inviteName,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: 'Você entrou no perfil!' });
      navigate('/');
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  const goBack = () => {
    switch (step) {
      case 'age-verification':
        setStep('choice');
        break;
      case 'login':
        setStep('choice');
        break;
      case 'profile-type':
        setStep('age-verification');
        break;
      case 'register':
        setStep('profile-type');
        break;
      case 'profile-info':
        setStep('register');
        break;
      case 'invite':
        setStep('choice');
        break;
      default:
        break;
    }
  };

  const handleAgeVerification = () => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18) {
      toast({ 
        title: 'Acesso negado', 
        description: 'Você precisa ter 18 anos ou mais para acessar esta plataforma.',
        variant: 'destructive'
      });
      return;
    }
    if (!acceptedTerms) {
      toast({ 
        title: 'Termos obrigatórios', 
        description: 'Você precisa aceitar os termos de uso e política de privacidade.',
        variant: 'destructive'
      });
      return;
    }
    setStep('profile-type');
  };

  const handleUnderAge = () => {
    toast({ 
      title: 'Acesso negado', 
      description: 'Esta plataforma é destinada apenas a maiores de 18 anos.',
      variant: 'destructive'
    });
    navigate('/');
  };

  const renderChoice = () => (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <img src={logo} alt="íNtymy" className="h-20 w-20 object-contain" />
        <h1 className="text-3xl font-bold text-brand-gradient">íNtymy</h1>
      </div>
      <p className="text-muted-foreground text-center mb-4">
        Rede social para todos os tipos de amor
      </p>
      
      <Button 
        className="w-full h-14 text-lg" 
        onClick={() => setStep('login')}
      >
        Entrar na minha conta
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full h-14 text-lg"
        onClick={() => navigate('/account-type')}
      >
        Criar nova conta
      </Button>
      
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground text-center mb-3">
          Recebeu um convite para um perfil?
        </p>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => setStep('invite')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Aceitar convite
        </Button>
      </div>
    </div>
  );

  const renderAgeVerification = () => (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Verificação de Idade</h1>
        <p className="text-muted-foreground text-sm">
          Você precisa ter 18 anos ou mais para acessar esta plataforma
        </p>
      </div>

      {/* Age Input */}
      <div className="space-y-2">
        <Label htmlFor="age">Digite sua idade</Label>
        <Input
          id="age"
          type="number"
          placeholder="18"
          min="1"
          max="120"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="text-center text-lg h-12"
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-xl">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          className="mt-0.5"
        />
        <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
          Declaro ter 18 anos ou mais e aceito os{' '}
          <button type="button" className="text-primary font-medium hover:underline">
            Termos de Uso
          </button>{' '}
          e{' '}
          <button type="button" className="text-primary font-medium hover:underline">
            Política de Privacidade
          </button>
          . Entendo que esta plataforma contém conteúdo adulto.
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full h-12"
          onClick={handleAgeVerification}
          disabled={!age || !acceptedTerms}
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          Verificar e Continuar
        </Button>

        <Button
          variant="outline"
          className="w-full h-12"
          onClick={handleUnderAge}
        >
          <X className="h-4 w-4 mr-2" />
          Tenho menos de 18 anos
        </Button>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center">
        Esta verificação é obrigatória por lei para plataformas de conteúdo adulto.
      </p>
    </div>
  );

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Button type="button" variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Entrar</h1>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="seu@email.com" 
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          required 
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      {/* Back button */}
      <button 
        type="button" 
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Logo */}
      <div className="flex justify-center">
        <img src={logo} alt="íNtymy" className="h-16 w-16 object-contain" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Criar Conta</h1>
        <p className="text-muted-foreground text-sm">Dados de acesso</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
          ✓
        </div>
        <div className="w-8 h-0.5 bg-primary" />
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          2
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
          3
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Seu nome</Label>
          <Input 
            id="name" 
            placeholder="Como você quer ser chamado(a)" 
            value={registerName}
            onChange={e => setRegisterName(e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="seu@email.com" 
            value={registerEmail}
            onChange={e => setRegisterEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            value={registerPassword}
            onChange={e => setRegisterPassword(e.target.value)}
            required 
          />
        </div>
      </div>

      <Button 
        className="w-full h-12" 
        onClick={() => setStep('profile-info')}
        disabled={!registerName || !registerEmail || !registerPassword}
      >
        Continuar
        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <button 
          type="button" 
          onClick={() => setStep('login')} 
          className="text-primary font-medium hover:underline"
        >
          Fazer Login
        </button>
      </p>
    </div>
  );

  const renderProfileType = () => (
    <div className="space-y-6">
      {/* Back button */}
      <button 
        type="button" 
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Logo */}
      <div className="flex justify-center">
        <img src={logo} alt="íNtymy" className="h-16 w-16 object-contain" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Criar Conta</h1>
        <p className="text-muted-foreground text-sm">Escolha o tipo de conta</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          1
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
          2
        </div>
        <div className="w-8 h-0.5 bg-border" />
        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
          3
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-center text-sm text-muted-foreground">
        Selecione como você quer usar a plataforma
      </p>
      
      {/* Options */}
      <div className="space-y-3">
        {profileTypeOptions.map(option => (
          <button
            key={option.type}
            type="button"
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
              selectedProfileType === option.type 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedProfileType(option.type)}
          >
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${
              selectedProfileType === option.type ? 'bg-primary/20' : 'bg-muted'
            }`}>
              {option.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{option.label}</h3>
                {selectedProfileType === option.type && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Continue button */}
      <Button 
        className="w-full h-12" 
        onClick={() => setStep('register')}
        disabled={!selectedProfileType}
      >
        Continuar
        <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <button 
          type="button" 
          onClick={() => setStep('login')} 
          className="text-primary font-medium hover:underline"
        >
          Fazer Login
        </button>
      </p>
    </div>
  );

  const renderProfileInfo = () => (
    <form onSubmit={handleCreateProfile} className="space-y-6">
      {/* Back button */}
      <button 
        type="button" 
        onClick={goBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Voltar</span>
      </button>

      {/* Logo */}
      <div className="flex justify-center">
        <img src={logo} alt="íNtymy" className="h-16 w-16 object-contain" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Criar Conta</h1>
        <p className="text-muted-foreground text-sm">Informações do perfil</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
          ✓
        </div>
        <div className="w-8 h-0.5 bg-primary" />
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
          ✓
        </div>
        <div className="w-8 h-0.5 bg-primary" />
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          3
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nome de usuário</Label>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-1">@</span>
            <Input 
              id="username" 
              placeholder="seu_usuario" 
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio (opcional)</Label>
          <Input 
            id="bio" 
            placeholder="Conte um pouco sobre você" 
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>
      </div>

      {selectedProfileType && selectedProfileType !== 'single' && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-muted-foreground">
            💡 Após criar o perfil, você poderá convidar {selectedProfileType === 'throuple' ? 'mais 2 pessoas' : 'mais 1 pessoa'} para acessar a mesma conta com login próprio.
          </p>
        </div>
      )}

      <Button type="submit" className="w-full h-12" disabled={isLoading || !username}>
        {isLoading ? 'Criando...' : 'Criar perfil'}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <button 
          type="button" 
          onClick={() => setStep('login')} 
          className="text-primary font-medium hover:underline"
        >
          Fazer Login
        </button>
      </p>
    </form>
  );

  const renderInvite = () => (
    <form onSubmit={handleAcceptInvite} className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Button type="button" variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Aceitar convite</h1>
      </div>
      
      {inviteId ? (
        <>
          <p className="text-muted-foreground mb-4">
            Você foi convidado para fazer parte de um perfil compartilhado! Crie seu acesso pessoal abaixo.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="invite-name">Seu nome</Label>
            <Input 
              id="invite-name" 
              placeholder="Como você quer ser chamado(a)" 
              value={inviteName}
              onChange={e => setInviteName(e.target.value)}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invite-email">E-mail</Label>
            <Input 
              id="invite-email" 
              type="email" 
              placeholder="Use o e-mail do convite" 
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invite-password">Crie uma senha</Label>
            <Input 
              id="invite-password" 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={invitePassword}
              onChange={e => setInvitePassword(e.target.value)}
              required 
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Entrar no perfil'}
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Para aceitar um convite, use o link que você recebeu.
          </p>
          <p className="text-sm text-muted-foreground">
            O link tem o formato: intymy.com/auth?invite=CÓDIGO
          </p>
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {step === 'choice' && renderChoice()}
        {step === 'age-verification' && renderAgeVerification()}
        {step === 'login' && renderLogin()}
        {step === 'register' && renderRegister()}
        {step === 'profile-type' && renderProfileType()}
        {step === 'profile-info' && renderProfileInfo()}
        {step === 'invite' && renderInvite()}
      </div>
    </div>
  );
}
