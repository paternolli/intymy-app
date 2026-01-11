import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  MessageSquare,
  Users,
  Ban,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Trash2,
  FileText,
  ExternalLink,
  UserPlus,
  Copy,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileInvitation } from '@/types/auth';

type SettingsSection = 'profile' | 'members' | 'account' | 'privacy' | 'notifications' | 'payments' | 'appearance' | 'help';

const sections = [
  { id: 'profile' as const, label: 'Perfil', icon: User, description: 'Foto, nome, bio' },
  { id: 'members' as const, label: 'Membros', icon: Users, description: 'Gerenciar acessos' },
  { id: 'account' as const, label: 'Conta', icon: Shield, description: 'Email, senha, segurança' },
  { id: 'privacy' as const, label: 'Privacidade', icon: Eye, description: 'Visibilidade, bloqueios' },
  { id: 'notifications' as const, label: 'Notificações', icon: Bell, description: 'Push, email, sons' },
  { id: 'payments' as const, label: 'Pagamentos', icon: CreditCard, description: 'Cartões, histórico' },
  { id: 'appearance' as const, label: 'Aparência', icon: Palette, description: 'Tema, idioma' },
  { id: 'help' as const, label: 'Ajuda', icon: HelpCircle, description: 'Suporte, termos' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isAuthenticated, inviteMember, removeMember, getInvitations, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: currentUser.members?.[0]?.name || '',
    username: currentUser.username,
    bio: currentUser.bio,
    email: 'julia@email.com',
    phone: '+55 11 99999-9999',
  });

  // Privacy state
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showActivity: true,
    allowMessages: 'followers' as 'everyone' | 'followers' | 'nobody',
    showOnline: true,
  });

  // Notification state
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    newFollower: true,
    newMessage: true,
    newLike: true,
    newComment: true,
    marketing: false,
  });

  // Appearance state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    language: 'pt-BR',
  });

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'Suas alterações foram aplicadas com sucesso.',
    });
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    const result = await inviteMember(inviteEmail);
    setIsInviting(false);
    
    if (result.success) {
      toast({ title: 'Convite enviado!', description: `Um link foi criado para ${inviteEmail}` });
      setInviteEmail('');
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    const result = await removeMember(memberId);
    
    if (result.success) {
      toast({ title: `${memberName} foi removido(a) do perfil` });
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
  };

  const copyInviteLink = (invitation: ProfileInvitation) => {
    const link = `${window.location.origin}/auth?invite=${invitation.id}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link copiado!', description: 'Envie para a pessoa que você quer convidar.' });
  };

  const getMaxMembers = () => {
    if (!session) return 1;
    const maxMembers: Record<string, number> = {
      single: 1,
      dating: 2,
      couple: 2,
      throuple: 3,
    };
    return maxMembers[session.profile.profileType] || 1;
  };

  const getProfileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      single: 'Solteiro(a)',
      dating: 'Namorando',
      couple: 'Casal',
      throuple: 'Trisal',
    };
    return labels[type] || type;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Editar Perfil</h2>
              <p className="text-sm text-muted-foreground">Atualize suas informações públicas</p>
            </div>

            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.members?.[0]?.avatar} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium">Foto do Perfil</p>
                <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máx 5MB</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome de Exibição</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="rounded-xl pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                  placeholder="Conte um pouco sobre você..."
                />
                <p className="text-xs text-muted-foreground text-right">
                  {profileData.bio.length}/150
                </p>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full rounded-xl">
              Salvar Alterações
            </Button>
          </div>
        );

      case 'members':
        const invitations = isAuthenticated ? getInvitations() : [];
        const pendingInvitations = invitations.filter(i => i.status === 'pending');
        const canInvite = session ? session.allMembers.length < getMaxMembers() : false;
        const remainingSlots = session ? getMaxMembers() - session.allMembers.length : 0;
        
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Membros do Perfil</h2>
              <p className="text-sm text-muted-foreground">
                {session ? `Perfil ${getProfileTypeLabel(session.profile.profileType)} - até ${getMaxMembers()} pessoa(s)` : 'Gerencie quem tem acesso'}
              </p>
            </div>

            {!isAuthenticated ? (
              <div className="p-6 bg-muted rounded-2xl text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-2">Faça login para gerenciar membros</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Você precisa estar logado para convidar pessoas para seu perfil.
                </p>
                <Button onClick={() => navigate('/auth')} className="rounded-xl">
                  Fazer Login
                </Button>
              </div>
            ) : (
              <>
                {/* Current Members */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Membros atuais ({session?.allMembers.length}/{getMaxMembers()})
                  </h3>
                  <div className="space-y-2">
                    {session?.allMembers.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 bg-muted rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.memberAvatar} />
                            <AvatarFallback>{member.memberName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.memberName}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.role === 'owner' ? (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Dono
                            </span>
                          ) : session?.user.role === 'owner' ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveMember(member.id, member.memberName)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          ) : (
                            <span className="text-xs bg-muted-foreground/10 px-2 py-1 rounded-full">
                              Membro
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Invitations */}
                {pendingInvitations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Convites pendentes</h3>
                    <div className="space-y-2">
                      {pendingInvitations.map(invitation => (
                        <div 
                          key={invitation.id} 
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-dashed"
                        >
                          <div>
                            <p className="font-medium text-sm">{invitation.invitedEmail}</p>
                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                              <Clock className="h-3 w-3" /> Aguardando aceite
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyInviteLink(invitation)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar link
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invite New Member */}
                {session?.user.role === 'owner' && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Convidar novo membro</h3>
                    
                    {canInvite ? (
                      <form onSubmit={handleInviteMember} className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="invite-email">E-mail da pessoa</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="rounded-xl"
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full rounded-xl" disabled={isInviting}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          {isInviting ? 'Enviando...' : 'Criar convite'}
                        </Button>
                        
                        <p className="text-xs text-muted-foreground text-center">
                          O convite expira em 7 dias. Você pode adicionar mais {remainingSlots} pessoa(s).
                        </p>
                      </form>
                    ) : (
                      <div className="p-4 bg-muted rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">
                          Este perfil já atingiu o número máximo de membros.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {session?.user.role !== 'owner' && (
                  <div className="p-4 bg-muted rounded-xl text-center">
                    <p className="text-sm text-muted-foreground">
                      Apenas o dono do perfil pode convidar ou remover membros.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Conta e Segurança</h2>
              <p className="text-sm text-muted-foreground">Gerencie suas credenciais de acesso</p>
            </div>

            <div className="space-y-3">
              <SettingsItem
                icon={Mail}
                title="Email"
                description={profileData.email}
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={Lock}
                title="Senha"
                description="••••••••"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={Phone}
                title="Telefone"
                description={profileData.phone}
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={Shield}
                title="Autenticação em duas etapas"
                description="Adicione uma camada extra de segurança"
                action={
                  <Switch 
                    checked={false}
                    onCheckedChange={() => toast({ title: 'Em breve', description: '2FA será implementado em breve.' })}
                  />
                }
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3 text-destructive">Zona de Perigo</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full rounded-xl gap-2">
                    <Trash2 className="h-4 w-4" />
                    Excluir Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Privacidade</h2>
              <p className="text-sm text-muted-foreground">Controle quem pode ver seu conteúdo</p>
            </div>

            <div className="space-y-3">
              <SettingsItem
                icon={Globe}
                title="Perfil Público"
                description="Qualquer pessoa pode ver seu perfil"
                action={
                  <Switch 
                    checked={privacySettings.profilePublic}
                    onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, profilePublic: checked })}
                  />
                }
              />

              <SettingsItem
                icon={Eye}
                title="Mostrar Status de Atividade"
                description="Outros podem ver quando você está online"
                action={
                  <Switch 
                    checked={privacySettings.showOnline}
                    onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showOnline: checked })}
                  />
                }
              />

              <div className="p-4 rounded-2xl bg-muted/50">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Quem pode enviar mensagens</p>
                    <p className="text-xs text-muted-foreground mb-3">Escolha quem pode iniciar conversas</p>
                    <Select 
                      value={privacySettings.allowMessages}
                      onValueChange={(value: typeof privacySettings.allowMessages) => 
                        setPrivacySettings({ ...privacySettings, allowMessages: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Todos</SelectItem>
                        <SelectItem value="followers">Apenas seguidores</SelectItem>
                        <SelectItem value="nobody">Ninguém</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <SettingsItem
                icon={Ban}
                title="Contas Bloqueadas"
                description="Gerenciar usuários bloqueados"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />
            </div>

            <Button onClick={handleSave} className="w-full rounded-xl">
              Salvar Alterações
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Notificações</h2>
              <p className="text-sm text-muted-foreground">Gerencie como você recebe alertas</p>
            </div>

            <div className="space-y-3">
              <SettingsItem
                icon={Smartphone}
                title="Notificações Push"
                description="Receba alertas no dispositivo"
                action={
                  <Switch 
                    checked={notificationSettings.pushEnabled}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushEnabled: checked })}
                  />
                }
              />

              <SettingsItem
                icon={Mail}
                title="Notificações por Email"
                description="Receba resumos por email"
                action={
                  <Switch 
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailEnabled: checked })}
                  />
                }
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Tipos de Notificação</h3>
              <div className="space-y-3">
                <SettingsItem
                  icon={Users}
                  title="Novos Seguidores"
                  description="Quando alguém começa a te seguir"
                  action={
                    <Switch 
                      checked={notificationSettings.newFollower}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newFollower: checked })}
                    />
                  }
                />

                <SettingsItem
                  icon={MessageSquare}
                  title="Mensagens"
                  description="Novas mensagens diretas"
                  action={
                    <Switch 
                      checked={notificationSettings.newMessage}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newMessage: checked })}
                    />
                  }
                />

                <SettingsItem
                  icon={Bell}
                  title="Curtidas e Comentários"
                  description="Interações nas suas publicações"
                  action={
                    <Switch 
                      checked={notificationSettings.newLike}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newLike: checked })}
                    />
                  }
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full rounded-xl">
              Salvar Alterações
            </Button>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Pagamentos</h2>
              <p className="text-sm text-muted-foreground">Gerencie métodos de pagamento e assinaturas</p>
            </div>

            {/* Balance Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
              <p className="text-sm opacity-90 mb-1">Saldo Disponível</p>
              <p className="text-3xl font-bold mb-4">R$ 1.234,56</p>
              <Button variant="secondary" size="sm" className="rounded-full">
                Sacar Fundos
              </Button>
            </div>

            <div className="space-y-3">
              <SettingsItem
                icon={CreditCard}
                title="Métodos de Pagamento"
                description="Cartões e contas bancárias"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={FileText}
                title="Histórico de Transações"
                description="Ver todas as compras e vendas"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={CreditCard}
                title="Assinaturas Ativas"
                description="Gerenciar assinaturas de criadores"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Aparência</h2>
              <p className="text-sm text-muted-foreground">Personalize a interface do app</p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Tema</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Claro', icon: Sun },
                  { id: 'dark', label: 'Escuro', icon: Moon },
                  { id: 'system', label: 'Sistema', icon: Smartphone },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: theme.id as typeof appearanceSettings.theme })}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      appearanceSettings.theme === theme.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/30"
                    )}
                  >
                    <theme.icon className={cn(
                      "h-6 w-6",
                      appearanceSettings.theme === theme.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={appearanceSettings.language}
                onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, language: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} className="w-full rounded-xl">
              Salvar Alterações
            </Button>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Ajuda e Suporte</h2>
              <p className="text-sm text-muted-foreground">Encontre respostas e entre em contato</p>
            </div>

            <div className="space-y-3">
              <SettingsItem
                icon={HelpCircle}
                title="Central de Ajuda"
                description="Perguntas frequentes e tutoriais"
                action={<ExternalLink className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={MessageSquare}
                title="Fale Conosco"
                description="Entre em contato com o suporte"
                action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={FileText}
                title="Termos de Uso"
                description="Leia nossos termos e condições"
                action={<ExternalLink className="h-5 w-5 text-muted-foreground" />}
              />

              <SettingsItem
                icon={Shield}
                title="Política de Privacidade"
                description="Como protegemos seus dados"
                action={<ExternalLink className="h-5 w-5 text-muted-foreground" />}
              />
            </div>

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>Versão do App: 1.0.0</p>
              <p className="mt-1">© 2024 íNtymy</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-lg">Configurações</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Section Navigation */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all",
                  activeSection === section.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <section.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderContent()}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            onClick={() => {
              logout();
              toast({ title: 'Saindo...', description: 'Você foi desconectado.' });
              navigate('/auth');
            }}
          >
            <LogOut className="h-5 w-5" />
            {isAuthenticated ? 'Sair da Conta' : 'Fazer Login'}
          </Button>
        </div>
      </main>
    </div>
  );
}

// Helper Component
function SettingsItem({ 
  icon: Icon, 
  title, 
  description, 
  action,
  onClick 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  action: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors flex items-center gap-3 text-left"
    >
      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      {action}
    </button>
  );
}