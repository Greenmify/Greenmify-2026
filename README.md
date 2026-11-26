# Greenmify-2026
Marketplace digital para conectar produtores rurais e consumidores de produtos agrícolas.

*Protótipo local de um marketplace agrícola que conecta produtores rurais e consumidores. A interface foi criada para demonstrar e validar as principais jornadas descritas na proposta do projeto.*

## Website

[Versão-V1](https://greenmify.github.io/Greenmify-2026/)

[Versão-V2](https://greenmify.github.io/Greenmify-2026/index2)

## Como abrir

Não é necessário instalar dependências nem configurar um servidor:

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador atualizado, como Chrome ou Edge.

Os arquivos `styles.css` e `app.js` devem permanecer na mesma pasta que `index.html`.

### Alternativa: servidor local

Se preferir acessar pelo navegador usando `localhost`, abra um terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois, acesse <http://localhost:8000>.

## O que é possível testar

- **Consumidor:** pesquisar produtos, filtrar por categoria e preço, ordenar resultados, favoritar e comparar anúncios, consultar detalhes e perfil do produtor, iniciar conversas e denunciar anúncios.
- **Produtor:** criar e editar anúncios, atualizar disponibilidade e acompanhar os próprios anúncios.
- **Administrador:** aprovar ou reprovar anúncios, analisar denúncias e remover publicações inadequadas.
- **Conta e perfil:** criar uma conta de demonstração e editar informações do perfil.

Use o seletor **Visualizar como**, no topo da tela, para alternar entre consumidor, produtor e administrador.

O cadastro de produtos e equipamentos compartilha o mesmo fluxo. Produtos agrícolas incluem unidade de medida; equipamentos têm campos de marca/modelo e condição, conforme a mudança MUD01.

## Tecnologias

- HTML
- CSS
- JavaScript sem frameworks ou bibliotecas externas
- `localStorage` do navegador para guardar as alterações feitas durante os testes

## Dados e limitações

Os anúncios, usuários e conversas iniciais são fictícios. As alterações ficam salvas apenas no navegador em que o protótipo foi aberto; não há servidor, sincronização entre usuários, autenticação real nem publicação de anúncios fora do protótipo. Portanto, esta versão destina-se à validação da proposta, não ao uso em produção.


## License

Copyright (c) 2026 Greenmify Project. All rights reserved.

This project is proprietary. Unauthorized copying, modification, distribution, or commercial use is strictly prohibited without prior written permission. See the [LICENSE](./LICENSE) file for details.
