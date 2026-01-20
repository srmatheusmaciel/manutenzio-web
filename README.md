---

# 📘 Manutenzio - Sistema de Gestão de Oficina Mecânica

Bem-vindo à documentação oficial do **Manutenzio**. Este documento serve como guia definitivo para entender, executar e implantar a solução de gestão de frotas e ordens de serviço.

## 1. Visão Geral do Projeto

### Objetivo

O **Manutenzio** é uma aplicação Full Stack desenvolvida para modernizar o gerenciamento de oficinas mecânicas. O sistema permite o controle total sobre o cadastro de veículos, gestão de status de manutenção e administração de usuários com níveis de acesso hierárquicos (RBAC).

### Tecnologias Utilizadas

**Backend (API RESTful):**

* **Linguagem:** Java 21 (LTS)
* **Framework:** Spring Boot 3
* **Segurança:** Spring Security + JWT (JSON Web Tokens)
* **Banco de Dados:** H2 Database (Em memória para dev/testes)
* **Build Tool:** Maven

* **Link da aplicação backend:** https://github.com/srmatheusmaciel/manutenzio

**Frontend (SPA):**

* **Framework:** React 18
* **Linguagem:** TypeScript
* **Estilização:** TailwindCSS
* **Http Client:** Axios
* **Ícones:** Lucide-React

**DevOps & Infraestrutura:**

* **Containerização:** Docker & Docker Compose
* **Servidor Web:** Nginx (no container do frontend)

### Principais Desafios Superados

1. **Segurança e RBAC:** Implementação de controle de acesso granular onde apenas Administradores podem excluir registros ou cadastrar novos usuários, enquanto Funcionários possuem acesso restrito às operações operacionais.
2. **Sincronização de Estado (Docker):** Garantia da persistência e integridade das senhas (Hashing com BCrypt) ao iniciar o banco de dados volátil dentro dos containers, utilizando *Seeders* automáticos.
3. **Configuração de CORS:** Ajuste fino das políticas de *Cross-Origin Resource Sharing* para permitir a comunicação segura entre o Frontend e o Backend em ambientes containerizados.

---

## 2. Passos para Rodar a Aplicação Localmente

Existem duas formas de rodar o projeto: **Modo Desenvolvedor** (rodando os códigos fonte) e **Modo Produção/Container** (usando Docker).

### Pré-requisitos (Modo Desenvolvedor)

* Java JDK 21+ instalado.
* Node.js 18+ e NPM instalados.
* Maven instalado.

### Passo A: Rodando o Backend

1. Navegue até a pasta do backend (`/manutenzio`):
```bash
cd manutenzio

```


2. Instale as dependências e rode o projeto:
```bash
mvn spring-boot:run

```


3. O servidor iniciará na porta `8080`.

### Passo B: Rodando o Frontend

1. Navegue até a pasta do frontend (`/manutenzio-web`):
```bash
cd manutenzio-web

```


2. Instale as dependências:
```bash
npm install

```


3. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```


4. Acesse a aplicação em `http://localhost:5173`.

---

## 3. Instruções de Deploy e Containers (Recomendado)

O projeto foi totalmente containerizado para simular um ambiente de produção fiel. Esta é a forma mais simples e robusta de executar a aplicação para avaliação.

### Pré-requisitos

* Docker Desktop instalado e rodando.

### Executando com Docker Compose

1. Na raiz do projeto (onde está o arquivo `docker-compose.yml`), abra o terminal.
2. Execute o comando de construção e subida:
```bash
docker-compose up --build

```


3. Aguarde até visualizar a mensagem de log: `✅ USUÁRIO ADMIN SINCRONIZADO`.

### Acessando a Aplicação

* **Frontend (Aplicação):** `http://localhost:3000`
* **Backend (API):** `http://localhost:8080`

### Credenciais de Acesso (Padrão)

O sistema inicia com um usuário Administrador pré-configurado:

* **Login:** `admin@acme.com`
* **Senha:** `123456`

---

## 4. Testes e Validação de Qualidade

A qualidade do software foi assegurada através de uma estratégia de testes manuais rigorosos e validações automatizadas de tipagem.

### Testes Realizados

#### 1. Testes de Autenticação e Segurança (JWT)

* **Cenário:** Tentativa de login com senha errada.
* *Resultado:* Bloqueio imediato (403 Forbidden) e feedback visual.


* **Cenário:** Acesso a rotas protegidas sem token.
* *Resultado:* Redirecionamento automático para login.



#### 2. Validação de Regras de Negócio (RBAC)

* **Teste de Admin:** Logado como Admin, verificar a presença dos botões de "Excluir Carro" e "Novo Usuário". Executar a exclusão e verificar persistência.
* **Teste de Funcionário:** Logado como Funcionário, confirmar a **ausência** visual dos botões de exclusão e cadastro de usuários. Tentar forçar a exclusão via API (Postman) e receber erro `403 Forbidden`.

#### 3. Testes de CRUD (Integridade de Dados)

* **Criação:** Cadastro de veículos com validação de campos obrigatórios.
* **Edição:** Atualização de status e dados cadastrais, garantindo que o ID permaneça imutável.

### Como Executar os Testes Unitários (Backend)

O projeto possui estrutura para testes automatizados com JUnit e Mockito. Para executá-los:

```bash
cd manutenzio
mvn test

```

---

## 5. FAQ - Perguntas Frequentes

**P: Ao rodar no Docker, recebo "Credenciais Inválidas".**
**R:** Isso ocorre se o banco de dados não inicializar corretamente o hash da senha. Execute `docker-compose down -v` para limpar o volume e suba novamente com `docker-compose up --build`. O *Seeder* automático corrigirá a senha.

**P: O Frontend não conecta com o Backend (Erro de Rede).**
**R:** Verifique se ambos os containers estão rodando (`docker ps`). Certifique-se de que a porta 8080 não está ocupada por outro serviço na sua máquina.

**P: Como crio um usuário "Funcionário"?**
**R:** Faça login como `admin@acme.com`. No Dashboard, clique no botão roxo "Novo Usuário". Selecione o perfil "Funcionário". Saia e logue com as novas credenciais para testar o acesso restrito.