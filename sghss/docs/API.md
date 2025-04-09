# Documentação da API - SGHSS

## Autenticação
Todas as requisições devem incluir o token JWT no header:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Endpoints

### Pacientes
```typescript
// GET /api/pacientes
interface ListaPacientesResponse {
  data: Paciente[];
  total: number;
}

// POST /api/pacientes
interface CriarPacienteRequest {
  nome: string;
  cpf: string;
  // ...outros campos
}
```

### Consultas
```typescript
// GET /api/consultas
interface ListaConsultasResponse {
  // ...definição da interface
}
```

## Tratamento de Erros
```typescript
interface ApiError {
  message: string;
  code: string;
  details?: any;
}
```
