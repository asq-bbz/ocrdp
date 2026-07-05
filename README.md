# OCR de Folhas de Ponto — App de Submissão

App de uma tela só: informa a pasta do Drive, o CID, o nome do condomínio e o
e-mail de destino, e dispara o Fluxo A no n8n. Ver a especificação completa
(`OCR_Folha_Ponto_Especificacao_Tecnica_MVP.docx`) para o contexto do projeto.

## Rodando local (opcional, só se quiser testar antes de publicar)

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev
```

Abre em http://localhost:3000 — vai pedir login (usuário/senha que você
definiu no `.env.local`).

## Publicando (GitHub + Vercel)

**1. Sobe o código pro GitHub**

Cria um repositório novo (pode ser privado) e sobe esta pasta inteira pra lá.
Se nunca fez isso pelo terminal, o GitHub Desktop é o caminho mais simples:
arrasta a pasta pro app, ele te guia pelo resto.

**2. Conecta na Vercel**

- Entra em vercel.com com a conta da BBZ (ou cria uma)
- "Add New" → "Project" → seleciona o repositório que você acabou de subir
- A Vercel detecta sozinha que é Next.js — não precisa mexer em nada nessa tela

**3. Configura as variáveis de ambiente**

Antes de clicar em "Deploy", abre a seção **Environment Variables** e
cadastra cada uma (os valores, não os nomes — os nomes já estão certos):

| Nome | O que colocar |
|---|---|
| `APP_USER` | O usuário que vai logar no app (você escolhe) |
| `APP_PASSWORD` | A senha (você escolhe) |
| `SESSION_SECRET` | Uma string longa e aleatória — gere com `openssl rand -hex 32` no terminal, ou qualquer gerador de senha forte |
| `N8N_WEBHOOK_URL` | A URL do webhook do Fluxo A (pega no node "Webhook - Submissão" do n8n, na versão de **produção**, não a de teste) |
| `N8N_WEBHOOK_SECRET` | O mesmo valor que está na credencial "Header Auth" desse webhook no n8n |
| `N8N_WEBHOOK_HEADER_NAME` | O nome do header dessa credencial (ex: `OCR_MISTRAL`) — se deixar em branco, o app usa `Authorization` |

**4. Deploy**

Clica em "Deploy". Em 1-2 minutos a Vercel te dá uma URL (tipo
`seu-projeto.vercel.app`). É essa URL que você compartilha com quem for usar
o app.

**5. Sempre que precisar mudar algo**

Muda o código, sobe pro GitHub de novo (`git push` ou pelo GitHub Desktop) —
a Vercel publica a versão nova sozinha, automaticamente.

## O que este app faz e não faz

- Faz: recebe os 4 campos, valida que estão preenchidos, chama o webhook do
  n8n, mostra confirmação.
- Não faz: não mostra status do processamento (isso chega por e-mail depois,
  via Fluxo B), não tem cadastro de usuários (login único e fixo — ver seção
  10 e 15 da spec para evolução futura disso).

## Estrutura

```
app/
  login/page.tsx        — tela de login
  page.tsx              — tela principal (formulário), protegida
  api/login/route.ts    — valida usuário/senha, cria cookie de sessão
  api/logout/route.ts   — limpa o cookie
  api/submit/route.ts   — chama o webhook do n8n (o secret nunca vai pro navegador)
  components/           — Header, formulário, glifo da marca
proxy.ts                — protege todas as rotas exceto /login
lib/session.ts           — assina/valida o cookie de sessão
```
