/// <reference types="vite/client" />
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configuração do worker
const worker = setupWorker(...handlers);

// Função para inicialização do worker
export const initMockWorker = async () => {
  // Corrigindo para usar o formato do Vite
  if (import.meta.env.DEV) {
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      onUnhandledRequest: 'bypass'
    });
  }
};

export { worker };
