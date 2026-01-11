import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Video, StopCircle, RotateCcw, Check, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoRecorderProps {
  open: boolean;
  onClose: () => void;
  onVideoRecorded: (videoBlob: Blob, previewUrl: string) => void;
}

export function VideoRecorder({ open, onClose, onVideoRecorded }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open && !recordedBlob) {
      startCamera();
    }
    
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [open, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      stopCamera();
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const retake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingTime(0);
    startCamera();
  };

  const confirmVideo = () => {
    if (recordedBlob && previewUrl) {
      onVideoRecorded(recordedBlob, previewUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setIsRecording(false);
    setRecordingTime(0);
    setError(null);
    onClose();
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={handleClose}
          className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {!recordedBlob && !isRecording && (
          <button 
            onClick={toggleCamera}
            className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center"
          >
            <RotateCcw className="h-5 w-5 text-white" />
          </button>
        )}
      </div>

      {/* Video Preview */}
      <div className="flex-1 flex items-center justify-center">
        {error ? (
          <div className="text-center p-8">
            <Camera className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80">{error}</p>
            <Button 
              onClick={startCamera}
              variant="secondary"
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        ) : recordedBlob && previewUrl ? (
          <video 
            src={previewUrl} 
            className="w-full h-full object-contain"
            controls
            autoPlay
            loop
          />
        ) : (
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-black/60 to-transparent">
        {recordedBlob ? (
          <div className="flex items-center justify-center gap-8">
            <Button
              onClick={retake}
              variant="secondary"
              size="lg"
              className="rounded-full gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Gravar novamente
            </Button>
            <Button
              onClick={confirmVideo}
              size="lg"
              className="rounded-full gap-2"
            >
              <Check className="h-5 w-5" />
              Usar vídeo
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center border-4 border-white shadow-lg active:scale-95 transition-transform"
              >
                <StopCircle className="h-8 w-8 text-white" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center border-4 border-white shadow-lg active:scale-95 transition-transform"
              >
                <Video className="h-8 w-8 text-white" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
