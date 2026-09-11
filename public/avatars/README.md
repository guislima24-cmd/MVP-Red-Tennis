# Fotos dos alunos

Coloque aqui as fotos reais, **nomeadas com o id do aluno**:

```
public/avatars/a01.jpg
public/avatars/a02.jpg
...
```

Os ids são os definidos em `src/lib/mock-data.ts` (`a01`–`a20` para os alunos
principais, `b01`–`b70` para os demais matriculados).

Enquanto o arquivo de um aluno não existir, o componente `<Avatar>` exibe
automaticamente um placeholder com as iniciais do nome sobre uma cor derivada
do id — não é preciso alterar código para trocar entre foto e placeholder.
