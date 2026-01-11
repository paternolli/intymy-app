import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Copy, Trash2, Clock, Check, X } from 'lucide-react';
import { ProfileInvitation } from '@/types/auth';

interface InviteMemberSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberSheet({ open, onOpenChange }: InviteMemberSheetProps) {
  const { session, inviteMember, removeMember, getInvitations } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!session) return null;
  
  const invitations = getInvitations();
  const pendingInvitations = invitations.filter(i => i.status === 'pending');
  
  const maxMembers: Record<string, number> = {
    single: 1,
    dating: 2,
    couple: 2,
    throuple: 3,
  };
  
  const canInvite = session.allMembers.length < maxMembers[session.profile.profileType];
  const remainingSlots = maxMembers[session.profile.profileType] - session.allMembers.length;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const result = await inviteMember(email);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: 'Convite enviado!' });
      setEmail('');
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
    toast({ title: 'Link copiado!' });
  };

  const getStatusBadge = (status: ProfileInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-xs text-yellow-600"><Clock className="h-3 w-3" /> Pendente</span>;
      case 'accepted':
        return <span className="flex items-center gap-1 text-xs text-green-600"><Check className="h-3 w-3" /> Aceito</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs text-red-600"><X className="h-3 w-3" /> Recusado</span>;
      case 'expired':
        return <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> Expirado</span>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Membros do Perfil</SheetTitle>
          <SheetDescription>
            Gerencie quem tem acesso a este perfil compartilhado
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Current Members */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Membros atuais ({session.allMembers.length}/{maxMembers[session.profile.profileType]})
            </h3>
            <div className="space-y-2">
              {session.allMembers.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
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
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Dono
                      </span>
                    ) : session.user.role === 'owner' ? (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveMember(member.id, member.memberName)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : null}
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
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed"
                  >
                    <div>
                      <p className="font-medium">{invitation.invitedEmail}</p>
                      {getStatusBadge(invitation.status)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyInviteLink(invitation)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Invite New Member */}
          {session.user.role === 'owner' && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Convidar novo membro</h3>
              
              {canInvite ? (
                <form onSubmit={handleInvite} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">E-mail</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isLoading ? 'Enviando...' : 'Enviar convite'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    O convite expira em 7 dias. Você ainda pode adicionar {remainingSlots} pessoa(s).
                  </p>
                </form>
              ) : (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Este perfil já atingiu o número máximo de membros.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {session.user.role !== 'owner' && (
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Apenas o dono do perfil pode convidar ou remover membros.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
