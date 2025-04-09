# Testes Não Funcionais - SGHSS

## 1. Testes de Performance

### 1.1 Tempo de Resposta
- **Objetivo**: Verificar se as operações respondem em tempo adequado
- **Ferramenta**: Lighthouse
- **Critérios**:
  - Carregamento inicial < 2s
  - Time to Interactive < 3.5s
  - First Contentful Paint < 1.5s

### 1.2 Testes de Carga
- **Ferramenta**: k6
- **Cenários**:
  - 100 usuários simultâneos
  - 1000 requisições/minuto
  - Tempo de resposta < 500ms

## 2. Testes de Segurança

### 2.1 LGPD Compliance
- Verificação de consentimento
- Criptografia de dados sensíveis
- Logs de auditoria
- Política de retenção

### 2.2 Vulnerabilidades
- OWASP Top 10
- Injeção SQL
- XSS
- CSRF

## 3. Testes de Acessibilidade
- WCAG 2.1 Level AA
- Contraste de cores
- Navegação por teclado
- Leitores de tela
