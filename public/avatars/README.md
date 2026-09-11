# Fotos dos alunos

As fotos dos 23 membros cadastrados pelo cliente já estão aqui, nomeadas com o
id de cada pessoa (`a01.jpg` … `a23.jpg`). A ordem dos ids segue a posição no
ranking: `a01` é o primeiro colocado.

## Adicionar a foto de mais alguém

1. Salve o arquivo como `public/avatars/<id>.jpg` — de preferência quadrado,
   enquadrado no rosto, com cerca de 400×400.
2. Inclua o id em `IDS_COM_FOTO`, em `src/lib/mock-data.ts`.

Quem não está nessa lista aparece com um placeholder de iniciais sobre uma cor
derivada do id. O componente `<Avatar>` também cai no placeholder se o arquivo
existir na lista mas falhar ao carregar.
