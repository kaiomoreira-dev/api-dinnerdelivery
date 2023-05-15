<h1 align="center"> API DinnerDelivery </h1>

## Summary
- [Summary](#summary)
- [Intro](#intro)
- [Description](#description)
- [System Requirements](#system-requirements)
- [Project access](#project-access)
  - [Open \&\& Run](#open--run)

## Intro
* DinnerDelivery é uma plataforma de API REST desenvolvida para atender às necessidades de lanchonetes e restaurantes que desejam disponibilizar o serviço de pedidos online para seus clientes.
  
## Description
* A plataforma DinnerDelivery foi criada com o objetivo de oferecer uma solução completa e eficiente para lanchonetes e restaurantes que desejam expandir seus negócios e melhorar a experiência dos clientes. Com a API REST do DinnerDelivery, é possível integrar um sistema de pedidos online diretamente ao site da lanchonete ou restaurante, permitindo que os clientes realizem pedidos de forma rápida, fácil e segura. 
* Além disso, a plataforma DinnerDelivery oferece recursos avançados para o gerenciamento de pedidos, permitindo que os estabelecimentos acompanhem em tempo real todos os pedidos realizados e gerenciem de forma eficiente a produção e a entrega dos produtos. Tudo isso sem precisar investir em infraestrutura ou contratar desenvolvedores especializados em e-commerce.

## System Requirements
* Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Node.js](https://nodejs.org/en/). 
E o banco de dados Postgres:
[Postgres](https://www.postgresql.org/).
E o docker para utilizar docker-compose para subir o container do Postgres
[Docker](https://https://www.docker.com/).
E instalar o docker-compose pra subir o container.
[Docker-Compose](https://docs.docker.com/compose/install/).
Além disto é bom ter um editor para trabalhar com o código como 
[VSCode](https://code.visualstudio.com/).

## Project access

### Open && Run
```bash
# Clone este repositório
$ git clone <https://github.com/kaiomoreira-dev/api-dinner-delivery.git>

# Acesse a pasta do projeto no terminal/cmd
$ cd api-dinnerdelivery

# Instale as dependências
$ yarn ou npm install

# Exutar apenas o container do postgres
$ docker-compose up -d

# Rodar as mirgations do banco
$ yarn migration:run

# Constuir o aplicação
$ yarn build ou npm run build

## Iniciar aplicação
// desenvolvimento
$ yarn start ou npm run dev

// testes
$ yarn test ou npm run test

# O servidor inciará na porta:3200 - acesse <http://localhost:3200>

# O banco de dados do postgres fica no docker na porta 1999:5432
```
