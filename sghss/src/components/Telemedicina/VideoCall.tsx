import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, Typography, Button, IconButton, 
  Paper, Grid, CircularProgress, Dialog
} from '@mui/material';
import {
  Mic, MicOff, Videocam, VideocamOff, 
  ScreenShare, StopScreenShare, Chat, PresentToAll,
  CallEnd, VolumeUp, VolumeOff
} from '@mui/icons-material';
import { telemedicinaSevice } from '../../services/api';
import { useNotification } from '../Notification';
import useApi from '../../hooks/useApi';

// Interface que seria implementada para integração com WebRTC ou alguma API externa
interface VideoSDK {
  joinRoom: (token: string, roomId: string) => void;
  leaveRoom: () => void;
  toggleMic: () => boolean;
  toggleCamera: () => boolean;
  toggleScreenShare: () => boolean;
  isConnected: () => boolean;
}

// Mock do SDK da videochamada
const mockVideoSDK: VideoSDK = {
  joinRoom: (token, roomId) => {
    console.log(`Joined room ${roomId} with token ${token}`);
  },
  leaveRoom: () => {
    console.log('Left room');
  },
  toggleMic: () => true,
  toggleCamera: () => true,
  toggleScreenShare: () => true,
  isConnected: () => true
};

type VideoCallProps = {
  consultaId: number;
  onEndCall: () => void;
};

const VideoCall: React.FC<VideoCallProps> = ({ consultaId, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [sessionId, setSessionId] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const { showNotification } = useNotification();
  
  const { 
    loading: initializingCall,
    execute: startSession
  } = useApi(telemedicinaSevice.iniciarSessao);
  
  const {
    execute: endSession
  } = useApi(telemedicinaSevice.encerrarSessao);
  
  const {
    execute: toggleRecording
  } = useApi(telemedicinaSevice.gravarSessao);

  // Iniciar a sessão de vídeo
  useEffect(() => {
    const initializeVideoCall = async () => {
      try {
        const sessionData = await startSession(consultaId);
        setSessionId(sessionData.sessionId);
        
        // Aqui seria integrado com SDK real (Twilio, Vonage, etc.)
        mockVideoSDK.joinRoom(sessionData.token, sessionData.sessionId);
        
        // Mock de stream local
        if (localVideoRef.current) {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
            })
            .catch(error => {
              showNotification('Erro ao acessar câmera e microfone: ' + error.message, 'error');
            });
        }
      } catch (error) {
        showNotification('Não foi possível iniciar a videochamada', 'error');
      }
    };
    
    initializeVideoCall();
    
    // Cleanup
    return () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Se houve uma sessão iniciada, encerre-a
      if (sessionId) {
        mockVideoSDK.leaveRoom();
        // Não aguardamos a conclusão para não atrasar o cleanup
        endSession(sessionId).catch(console.error);
      }
    };
  }, [consultaId]);

  const handleToggleMic = () => {
    const newState = mockVideoSDK.toggleMic();
    setIsMicActive(newState);
    showNotification(newState ? 'Microfone ativado' : 'Microfone desativado', 'info');
  };

  const handleToggleCamera = () => {
    const newState = mockVideoSDK.toggleCamera();
    setIsCameraActive(newState);
    showNotification(newState ? 'Câmera ativada' : 'Câmera desativada', 'info');
  };

  const handleToggleScreenShare = () => {
    const newState = mockVideoSDK.toggleScreenShare();
    setIsScreenSharing(newState);
    showNotification(newState ? 'Compartilhamento de tela iniciado' : 'Compartilhamento encerrado', 'info');
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleToggleAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const handleToggleRecording = async () => {
    try {
      if (sessionId) {
        await toggleRecording(sessionId, !isRecording);
        setIsRecording(!isRecording);
        showNotification(
          !isRecording ? 'Gravação iniciada' : 'Gravação encerrada',
          'info'
        );
      }
    } catch (error) {
      showNotification('Erro ao controlar gravação', 'error');
    }
  };

  const handleEndCall = async () => {
    try {
      if (sessionId) {
        await endSession(sessionId);
      }
      onEndCall();
    } catch (error) {
      showNotification('Erro ao encerrar chamada', 'error');
    }
  };

  if (initializingCall) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Iniciando videochamada...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        bgcolor: '#121212', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Área dos vídeos */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        position: 'relative', 
        bgcolor: '#000'
      }}>
        {/* Vídeo remoto */}
        <video 
          ref={remoteVideoRef}
          autoPlay 
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        
        {/* Vídeo local (picture-in-picture) */}
        <Box sx={{
          position: 'absolute',
          right: 20,
          top: 20,
          width: '180px',
          height: '120px',
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid #ffffff70'
        }}>
          <video 
            ref={localVideoRef}
            autoPlay 
            muted 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)' // Espelhar vídeo
            }}
          />
          
          {!isCameraActive && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: '#121212'
            }}>
              <Typography variant="caption">Câmera desligada</Typography>
            </Box>
          )}
        </Box>
        
        {/* Indicador de gravação */}
        {isRecording && (
          <Box sx={{
            position: 'absolute',
            left: 20,
            top: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'error.main',
              animation: 'pulse 1.5s infinite'
            }} />
            <Typography variant="caption" sx={{ color: 'error.main' }}>
              REC
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Controles */}
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        bgcolor: '#1e1e1e',
        gap: 1
      }}>
        <IconButton 
          onClick={handleToggleMic}
          color={isMicActive ? 'primary' : 'error'}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          {isMicActive ? <Mic /> : <MicOff />}
        </IconButton>
        
        <IconButton 
          onClick={handleToggleCamera}
          color={isCameraActive ? 'primary' : 'error'}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          {isCameraActive ? <Videocam /> : <VideocamOff />}
        </IconButton>
        
        <IconButton 
          onClick={handleToggleScreenShare}
          color={isScreenSharing ? 'secondary' : 'inherit'}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>
        
        <IconButton 
          onClick={handleToggleChat}
          color={isChatOpen ? 'secondary' : 'inherit'} 
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          <Chat />
        </IconButton>
        
        <IconButton 
          onClick={handleToggleAudio}
          color={isAudioMuted ? 'error' : 'inherit'}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          {isAudioMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        
        <IconButton 
          onClick={handleToggleRecording}
          color={isRecording ? 'error' : 'inherit'}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          <PresentToAll />
        </IconButton>
        
        <IconButton 
          onClick={handleEndCall}
          sx={{ 
            bgcolor: 'error.main', 
            '&:hover': { bgcolor: 'error.dark' },
            ml: 2
          }}
        >
          <CallEnd />
        </IconButton>
      </Box>
      
      {/* Chat (diálogo) */}
      <Dialog
        open={isChatOpen}
        onClose={handleToggleChat}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Chat da Consulta
          </Typography>
          
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {/* Aqui seriam exibidas as mensagens */}
            <Typography variant="body2" gutterBottom>
              Sistema: A consulta foi iniciada às {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
          
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <input 
                type="text" 
                placeholder="Digite sua mensagem..."
                style={{ 
                  width: '100%', 
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Button 
                variant="contained" 
                fullWidth
              >
                Enviar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default VideoCall;