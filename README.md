# Sonax API - Desafio Técnico

API desenvolvida para o processo seletivo da **Sonax**, com gerenciamento de usuários, protocolos e mensagens.

---

## 🚀 Como executar

### Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- Git (para clonar o repositório)

### Passos para executar

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. **Execute o servidor**

```bash
node server.js
```

3. **Acesse a API**

```
http://localhost:3000
```

---

## 📡 Endpoints Disponíveis

### 👤 Usuários

| Método | Endpoint                         | Descrição                               |
| ------ | -------------------------------- | --------------------------------------- |
| GET    | `/usuarios`                      | Lista todos os usuários (com paginação) |
| GET    | `/usuarios?nome=joao`            | Busca usuários por nome                 |
| GET    | `/usuarios?email=joao@email.com` | Busca usuários por email                |
| GET    | `/usuarios/1`                    | Busca usuário por ID                    |

**Parâmetros de paginação:**

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10, máximo: 100)

---

### 📋 Protocolos

| Método | Endpoint                       | Descrição                                 |
| ------ | ------------------------------ | ----------------------------------------- |
| GET    | `/protocolos`                  | Lista todos os protocolos (com paginação) |
| GET    | `/protocolos?usuario_id=1`     | Filtra protocolos por usuário             |
| GET    | `/protocolos?status=resolvido` | Filtra protocolos por status              |
| GET    | `/protocolos?tipo=ativo`       | Filtra protocolos por tipo                |
| GET    | `/protocolos?canal=whatsapp`   | Filtra protocolos por canal               |
| GET    | `/protocolos/1`                | Busca protocolo por ID                    |
| GET    | `/protocolos/1/mensagens`      | Lista mensagens de um protocolo           |

**Status disponíveis:**
| Status | Descrição |
|--------|-----------|
| `resolvido` | Protocolo finalizado |
| `aberto` | Protocolo aguardando atendimento |
| `em_atendimento` | Protocolo sendo atendido |
| `aguardando_cliente` | Aguardando retorno do cliente |

**Tipos disponíveis:**
| Tipo | Descrição |
|------|-----------|
| `ativo` | Protocolo iniciado pelo atendente |
| `receptivo` | Protocolo iniciado pelo cliente |

**Canais disponíveis:**
| Canal | Descrição |
|-------|-----------|
| `whatsapp` | Mensagem via WhatsApp |
| `sms` | Mensagem via SMS |
| `email` | Mensagem via E-mail |
| `chat` | Mensagem via Chat |

---

### 💬 Mensagens

| Método | Endpoint                     | Descrição                                |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/mensagens`                 | Lista todas as mensagens (com paginação) |
| GET    | `/mensagens?protocolo_id=1`  | Filtra mensagens por protocolo           |
| GET    | `/mensagens?usuario_id=1`    | Filtra mensagens por usuário             |
| GET    | `/mensagens?direcao=enviada` | Filtra mensagens por direção             |
| GET    | `/mensagens?status=entregue` | Filtra mensagens por status              |
| GET    | `/mensagens?canal=whatsapp`  | Filtra mensagens por canal               |
| GET    | `/mensagens/1`               | Busca mensagem por ID                    |

**Status disponíveis:**
| Status | Descrição |
|--------|-----------|
| `entregue` | Mensagem entregue com sucesso |
| `lida` | Mensagem lida pelo destinatário |
| `recebida` | Mensagem recebida |
| `pendente` | Mensagem aguardando envio |
| `erro` | Mensagem com erro no envio |

**Direções disponíveis:**
| Direção | Descrição |
|---------|-----------|
| `enviada` | Mensagem enviada pelo sistema |
| `recebida` | Mensagem recebida pelo sistema |

**Canais disponíveis:**
| Canal | Descrição |
|-------|-----------|
| `whatsapp` | Mensagem via WhatsApp |
| `sms` | Mensagem via SMS |
| `email` | Mensagem via E-mail |
| `chat` | Mensagem via Chat |

---

### 📊 Relatórios

| Método | Endpoint               | Descrição                     |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/relatorios/resumo`   | Resumo geral da plataforma    |
| GET    | `/relatorios/analises` | Análises detalhadas dos dados |

**Exemplo de resposta do `/relatorios/resumo`:**

```json
{
  "totalDeUsuarios": 1000,
  "custoTotal": "1234.56",
  "custoPorCanal": {
    "whatsapp": 500.0,
    "sms": 400.0,
    "email": 334.56
  },
  "qntMensagensPorStatus": {
    "entregue": 850,
    "erro": 150
  },
  "taxaDeErroTotal": "15.00%",
  "taxaDeErroEnviadas": "12.50%",
  "taxaDeErroPorCanal": {
    "whatsapp": "10.50%",
    "sms": "20.00%",
    "email": "5.00%"
  }
}
```

---

## 📝 Exemplos de Requisições

### Usuários

```bash
# Listar usuários com paginação
GET http://localhost:3000/usuarios?page=2&limit=5

# Buscar usuário por nome
GET http://localhost:3000/usuarios?nome=joao

# Buscar usuário por email
GET http://localhost:3000/usuarios?email=joao@email.com
```

### Protocolos

```bash
# Filtrar protocolos por status e tipo
GET http://localhost:3000/protocolos?status=resolvido&tipo=ativo

# Filtrar protocolos por canal
GET http://localhost:3000/protocolos?canal=whatsapp

# Listar mensagens de um protocolo com paginação
GET http://localhost:3000/protocolos/1/mensagens?page=1&limit=10
```

### Mensagens

```bash
# Filtrar mensagens por direção e status
GET http://localhost:3000/mensagens?direcao=enviada&status=entregue

# Filtrar mensagens por protocolo
GET http://localhost:3000/mensagens?protocolo_id=1
```

### Relatórios

```bash
# Obter relatório resumo
GET http://localhost:3000/relatorios/resumo

# Obter relatório de análises
GET http://localhost:3000/relatorios/analises
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia           | Descrição                       |
| -------------------- | ------------------------------- |
| **Node.js**          | Ambiente de execução JavaScript |
| **HTTP Module**      | Servidor HTTP nativo            |
| **File System (fs)** | Leitura dos arquivos JSON       |
| **Path Module**      | Manipulação de caminhos         |

---

## 📁 Estrutura do Projeto

```
sonax-api-desafio/
├── server.js              # Servidor principal
├── README.md              # Documentação do projeto
├── package.json           # Configuração do projeto
├── package-lock.json      # Lock de dependências
└── data/                  # Dados mockados
    ├── usuarios.json      # Dados de usuários (1000 registros)
    ├── protocolos.json    # Dados de protocolos (1000 registros)
    └── mensagens.json     # Dados de mensagens (1000 registros)
```

---

## ⚠️ Tratamento de Erros

A API retorna os seguintes códigos:

| Código  | Descrição                      | Exemplo                                   |
| ------- | ------------------------------ | ----------------------------------------- |
| **200** | Sucesso                        | Requisição processada corretamente        |
| **400** | Parâmetro inválido             | ID negativo ou não numérico               |
| **404** | Rota ou recurso não encontrado | Endpoint inexistente ou ID não encontrado |

**Exemplos de respostas de erro:**

```text
Erro 400 - falha no parâmetro de busca
```

```text
Erro 404 - usuário não encontrado
```

```text
404 - Rota não encontrada
```

---

## 📌 Observações Finais

- Todos os endpoints retornam dados em formato **JSON**
- A paginação está disponível em todas as listagens
- Os dados são lidos diretamente dos arquivos JSON na inicialização do servidor
- O servidor roda na porta **3000** por padrão

---

## 🔧 Desenvolvido por

**Matheus Duarte**
