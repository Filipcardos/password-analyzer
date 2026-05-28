# 🔐 Password Analyzer

Terminal-style password security analyzer with real-time strength scoring, entropy calculation, crack time estimation, and HaveIBeenPwned breach detection.

<img width="739" height="214" alt="image" src="https://github.com/user-attachments/assets/3381c189-065f-4f25-b67c-6b89c22e274c" />

🌐 Deploy: https://password-analyzer-kappa.vercel.app/

## ✨ Features

- **Real-time analysis** — feedback instantâneo enquanto digita
- **Entropia** — cálculo de bits de entropia com visualização em blocos
- **Score de força** — algoritmo próprio de 0 a 100
- **Tempo de quebra** — estimativa por tipo de ataque (online, GPU, ASIC)
- **Vulnerabilidades** — detecção de padrões comuns, sequências, repetições
- **HaveIBeenPwned** — verificação via k-anonymity (nunca envia a senha completa)
- **Gerador de senhas fortes** — sugestão segura com um clique para copiar

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + CSS Modules |
| Backend | FastAPI + Python 3.11 |
| Segurança | HaveIBeenPwned API (k-anonymity) |
| Deploy | Vercel (frontend) + Railway (backend) |

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

A API estará disponível em `http://localhost:8000`

Documentação automática (Swagger): `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`

> O Vite já está configurado para fazer proxy de `/api` → `http://localhost:8000`, então o frontend e o backend se comunicam automaticamente.

## 📁 Estrutura do projeto

```
password-analyzer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StrengthBar.jsx      # Barra de força com cor dinâmica
│   │   │   ├── EntropyViz.jsx       # Visualização de entropia em blocos
│   │   │   ├── MetricsGrid.jsx      # Grid de métricas da senha
│   │   │   ├── VulnerabilityTags.jsx # Tags de vulnerabilidades
│   │   │   ├── CrackTime.jsx        # Tempo estimado de quebra
│   │   │   ├── PwnedBadge.jsx       # Badge de vazamentos (HIBP)
│   │   │   └── PasswordSuggestion.jsx # Gerador de senha forte
│   │   ├── utils/
│   │   │   └── analyzer.js          # Lógica de análise client-side
│   │   ├── App.jsx                  # Componente principal (terminal)
│   │   └── index.css                # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── main.py                      # FastAPI app + endpoints
│   ├── analyzer.py                  # Lógica de análise server-side + HIBP
│   └── requirements.txt
│
└── README.md
```

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/analyze` | Análise completa com verificação HIBP |
| `GET` | `/suggest` | Gera uma senha forte aleatória |

### Exemplo de resposta `/analyze`

```json
{
  "score": 87,
  "strength": "MUITO FORTE",
  "entropy": 104.0,
  "length": 16,
  "charset_size": 94,
  "metrics": {
    "uppercase": 3,
    "lowercase": 7,
    "digits": 3,
    "special": 3
  },
  "vulnerabilities": [
    { "label": "SEM VULNERABILIDADES", "severity": "ok" }
  ],
  "crack_times": {
    "online_attack": "> 1 bilhão de anos",
    "brute_force": "> 1 bilhão de anos",
    "gpu_cluster": "824 mil anos",
    "asic_advanced": "82 mil anos"
  },
  "pwned": {
    "pwned": false,
    "breach_count": 0
  }
}
```

## 🌐 Deploy

### Frontend → Vercel
```bash
cd frontend
npm run build
# Conecte o repositório no vercel.com
```

### Backend → Railway
```bash
# Conecte o repositório no railway.app
# Configure: Start Command = uvicorn main:app --host 0.0.0.0 --port $PORT
```

Após o deploy, atualize o proxy no `vite.config.js` com a URL do seu backend Railway.

## 🔒 Segurança & Privacidade

A verificação de senhas no HaveIBeenPwned usa o modelo **k-anonymity**:
1. A senha é hasheada localmente com SHA-1
2. Apenas os **primeiros 5 caracteres** do hash são enviados
3. A API retorna todos os hashes com aquele prefixo
4. A comparação é feita **localmente** — a senha nunca sai do servidor

## 📄 Licença

MIT — sinta-se livre para usar, modificar e distribuir.
