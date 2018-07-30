# Deploy na infra da UFCG 

Na vm do projeto empenhados (150.165.85.32) encontre o id do docker container que está executando baseado na docker image patrimonio-app-image

docker ps

Em seguida pare a execução do docker container

docker stop <container-id>

No repositório git (~/empenhados-patrimonio-app) que contém o projeto atualize as mudanças que farão parte do deploy. Exemplo: git pull origin master

Dê o build na imagem patrimonio-app-image utilizando o Dockerfile contido na raiz do repositório.

docker build -t patrimonio-app-image .

Verifique se o processo não apresentou erros.

Execute o docker container baseado na imagem criada.

docker run -p 3000:3000 -d patrimonio-app-image

As informações sobre o docker container podem ser acessadas pelo comando

docker ps

O docker container pode ser acessado via terminal pelo comando

docker exec -it <container-id> bash
