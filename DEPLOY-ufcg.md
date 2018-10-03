# Deploy na infra da UFCG 

## Deploy da API

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

## Deploy da aplicação no apache

Após seguir os passos anteriores a API estará disponível em 150.165.85.32:3000.

Para o deploy da aplicação é preciso fazer o build da versão de produção localmente (no diretório de desenvolvimento) usando

ng build --prod --env=prod

Em seguida compactar a pasta gerada (dist/) usando

zip -r dist.zip dist/

Copiar este arquivo para o diretório /var/html na vm do projeto e descompactar.

unzip dist.zip

Seguindo estes passos a aplicação estará atualizada a nível de produção. Se algo não estiver certo confira a configuração do apache no arquivo:

/etc/apache2/sites-available/000-default.conf
