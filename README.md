# RMT Park - Sistema de Gestão de Estacionamento

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## Deploy no Vercel

Este guia explica como fazer o deploy desta aplicação Angular no Vercel.

### Pré-requisitos

- Uma conta no [Vercel](https://vercel.com)
- Uma conta no GitHub, GitLab ou Bitbucket (recomendado para integração contínua)

### Método 1: Deploy via GitHub (Recomendado)

1. Faça o push do código para um repositório no GitHub
2. Acesse sua conta no [Vercel](https://vercel.com)
3. Clique em "Add New" e selecione "Project"
4. Importe o repositório do GitHub
5. O Vercel detectará automaticamente que é um projeto Angular
6. Clique em "Deploy"

### Método 2: Deploy via Vercel CLI

1. Instale a Vercel CLI globalmente:
   ```bash
   npm install -g vercel
   ```

2. No diretório do projeto, execute:
   ```bash
   vercel
   ```

3. Siga as instruções para fazer login e configurar o projeto

### Configurações Importantes

O projeto já está configurado com os seguintes arquivos necessários para o deploy:

- **vercel.json**: Configuração específica para o Vercel, definindo como construir e rotear a aplicação
- **package.json**: Contém o script `vercel-build` que o Vercel utilizará para construir a aplicação

### Após o Deploy

- O Vercel fornecerá uma URL para acessar sua aplicação (exemplo: rmt-park.vercel.app)
- Você pode configurar um domínio personalizado nas configurações do projeto no Vercel
- Cada commit na branch principal do repositório acionará automaticamente um novo deploy (se estiver usando a integração com GitHub)

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# rmtpark-tcc
# rmtpark-tcc
