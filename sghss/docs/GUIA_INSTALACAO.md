# Guia de Instalação - SGHSS

## Pré-requisitos
- Node.js 18.x ou superior
- npm 9.x ou superior
- Git

## Passo a Passo

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sghss.git
cd sghss
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o ambiente de desenvolvimento
```bash
npm run dev
```

5. (Opcional) Configure o ambiente de produção
```bash
npm run build
npm run preview
```

## Problemas Comuns

1. Erro de porta em uso
   - Solução: Altere a porta no arquivo vite.config.ts

2. Erro de tipos TypeScript
   - Solução: Execute `npm install --save-dev @types/node`
