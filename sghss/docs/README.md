# SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde

## 1. Introdução
O SGHSS é um sistema front-end desenvolvido para a VidaPlus, focado na gestão hospitalar e serviços de saúde. O sistema permite o gerenciamento de pacientes, consultas, telemedicina e administração hospitalar.

## 2. Tecnologias Utilizadas
- React 18.2.0
- TypeScript
- Material UI 5.14.18
- React Router DOM 6.19.0
- Formik e Yup para validações
- Recharts para gráficos
- Jest/Vitest para testes

## 3. Arquitetura do Projeto
```tree
sghss/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/        # Contextos React (estado global)
│   ├── pages/          # Páginas/rotas da aplicação
│   ├── services/       # Serviços e APIs
│   ├── types/          # Tipagens TypeScript
│   └── tests/          # Testes automatizados
```

## 4. Funcionalidades Principais
### 4.1 Gestão de Pacientes
- Cadastro de pacientes
- Listagem e busca
- Edição e exclusão
- Histórico médico

### 4.2 Gestão de Consultas
- Agendamento
- Cancelamento
- Visualização de agenda
- Status de consultas

### 4.3 Telemedicina
- Videochamadas
- Chat médico
- Prontuário digital
- Prescrições online

### 4.4 Dashboard
- Indicadores em tempo real
- Gráficos estatísticos
- Resumo de atividades

## 5. Segurança
- Autenticação JWT
- Rotas protegidas
- Validação de formulários
- Sanitização de dados

## 6. Testes
- Testes unitários com Jest/Vitest
- Testes de integração
- Testes de componentes
- Cobertura de código

## 7. Execução do Projeto
```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Testes
npm test

# Build
npm run build
```

## 8. Padrões de Código
- ESLint para padronização
- Prettier para formatação
- TypeScript strict mode
- Conventional Commits

## 9. Design System
- Material UI como base
- Tema personalizado
- Componentes responsivos
- Acessibilidade WCAG

## 10. Melhorias Futuras
- Implementação de PWA
- Integração com APIs de terceiros
- Relatórios avançados
- Notificações push
