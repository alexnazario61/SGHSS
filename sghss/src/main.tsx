import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import { initMockWorker } from './mocks/browser';
import { NotificationProvider } from './components/Notification';

// Função para iniciar a aplicação
async function startApp() {
  // Em desenvolvimento, inicializa o mock service worker
  if (import.meta.env.DEV) {
    try {
      await initMockWorker();
      console.log('Mock Service Worker iniciado com sucesso');
    } catch (error) {
      console.error('Erro ao iniciar Mock Service Worker:', error);
    }
  }

  // Renderiza a aplicação
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Elemento root não encontrado no DOM');
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

// Inicia a aplicação e captura erros não tratados
startApp().catch(error => {
  console.error('Erro fatal ao iniciar a aplicação:', error);
  // Mostra uma mensagem de erro no DOM para o usuário
  document.body.innerHTML = `
    <div style="color: red; margin: 20px; font-family: sans-serif;">
      <h1>Erro ao carregar a aplicação</h1>
      <p>Ocorreu um erro ao iniciar o SGHSS. Por favor, atualize a página ou contate o suporte.</p>
      <p>Detalhes técnicos: ${error.message || 'Erro desconhecido'}</p>
    </div>
  `;
});
