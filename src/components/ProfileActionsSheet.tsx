import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  UserMinus, 
  Ban, 
  Flag, 
  EyeOff, 
  Share2, 
  Link2, 
  UserX,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProfileActionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string;
  isFollowing: boolean;
  isBlocked: boolean;
  isRestricted: boolean;
  onToggleFollow: () => void;
  onToggleBlock: () => void;
  onToggleRestrict: () => void;
  onReport: (reason: string) => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam ou fraude' },
  { value: 'inappropriate', label: 'Conteúdo inapropriado' },
  { value: 'harassment', label: 'Assédio ou bullying' },
  { value: 'impersonation', label: 'Personificação' },
  { value: 'violence', label: 'Violência ou ameaças' },
  { value: 'other', label: 'Outro motivo' },
];

export function ProfileActionsSheet({
  open,
  onOpenChange,
  userId,
  username,
  isFollowing,
  isBlocked,
  isRestricted,
  onToggleFollow,
  onToggleBlock,
  onToggleRestrict,
  onReport,
}: ProfileActionsSheetProps) {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Link copiado para a área de transferência!');
    onOpenChange(false);
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de @${username}`,
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const handleUnfollow = () => {
    onToggleFollow();
    onOpenChange(false);
  };

  const handleBlockConfirm = () => {
    onToggleBlock();
    setShowBlockConfirm(false);
    onOpenChange(false);
  };

  const handleRestrict = () => {
    onToggleRestrict();
    onOpenChange(false);
  };

  const handleReportSubmit = () => {
    if (!reportReason) {
      toast.error('Por favor, selecione um motivo');
      return;
    }
    const fullReason = reportDetails 
      ? `${reportReason}: ${reportDetails}` 
      : reportReason;
    onReport(fullReason);
    setShowReportDialog(false);
    setReportReason('');
    setReportDetails('');
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left pb-2">
            <SheetTitle>Ações para @{username}</SheetTitle>
          </SheetHeader>

          <div className="space-y-1 py-4">
            {/* Share Actions */}
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Compartilhar perfil</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
            >
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Copiar link do perfil</span>
            </button>

            <div className="h-px bg-border my-2" />

            {/* Relationship Actions */}
            {isFollowing && (
              <button
                onClick={handleUnfollow}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
              >
                <UserMinus className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Deixar de seguir</span>
              </button>
            )}

            <button
              onClick={handleRestrict}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
            >
              <EyeOff className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">
                  {isRestricted ? 'Remover restrição' : 'Restringir'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRestricted 
                    ? 'Os comentários voltarão a ser visíveis para todos' 
                    : 'Os comentários ficarão visíveis apenas para eles'}
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowBlockConfirm(true)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors",
                isBlocked && "text-destructive"
              )}
            >
              {isBlocked ? (
                <>
                  <UserX className="h-5 w-5" />
                  <span className="font-medium">Desbloquear</span>
                </>
              ) : (
                <>
                  <Ban className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">Bloquear</span>
                </>
              )}
            </button>

            <div className="h-px bg-border my-2" />

            {/* Report */}
            <button
              onClick={() => setShowReportDialog(true)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-destructive"
            >
              <Flag className="h-5 w-5" />
              <span className="font-medium">Denunciar</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBlocked ? 'Desbloquear' : 'Bloquear'} @{username}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBlocked ? (
                'Este perfil poderá ver suas publicações e enviar mensagens novamente.'
              ) : (
                'Este perfil não poderá ver suas publicações, stories ou enviar mensagens. Eles não serão notificados.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockConfirm}
              className={cn(!isBlocked && "bg-destructive hover:bg-destructive/90")}
            >
              {isBlocked ? 'Desbloquear' : 'Bloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Denunciar @{username}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o motivo da denúncia. Nossa equipe analisará o caso.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            <RadioGroup value={reportReason} onValueChange={setReportReason}>
              {REPORT_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="report-details">Detalhes adicionais (opcional)</Label>
              <Textarea
                id="report-details"
                placeholder="Descreva o que aconteceu..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setReportReason('');
              setReportDetails('');
            }}>
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleReportSubmit}
              variant="destructive"
            >
              Enviar denúncia
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
