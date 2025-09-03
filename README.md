# 💻📱 Inventory Management System

Construção de um Sistema de Gestão de Estoque completo utilizando tecnologias de última geração: Bootstrap5 e Django Rest Framework focado em facilitar o controle de entradas, saídas e organização de produtos em ambientes comerciais.


## ⛏️ Instalação

Execute o projeto com Python

```bash
  py manage.py runserver
```
    
## 💎 Stacks utilizadas

**Front-end:** HTML5, CSS3 e Bootstrap5

**Back-end:** Django, Django Rest Framework, Simple JWT

**Database:** PostgreSQL

**IA:** OpenAI

## 📋 Documentação da API - Autenticação

#### Autenticação - Criar Um Conta (_Necessário Autenticação Usuário Administrador_)

```http
  POST /api/v1/admin/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório** |
| `password` | `string` | **Obrigatório** |
| `group permission` | `FK` | **Obrigatório** |

#### Autenticação - Fazer Login

```http
  POST /api/v1/auth/login
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório** |
| `password` | `string` | **Obrigatório** |

## 📋 Documentação da API - Product 
### 💬Criar o produto para realizar as entradas e saídas no estoque.

#### Products - Listar Produtos Cadastrados - (_Necessário Autenticação_)

```http
  GET /api/v1/products/list
```

#### Products - Criar Um Produto - (_Necessário Autenticação_)

```http
  POST /api/v1/products/create
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório** |
| `title` | `string` | **Obrigatório** |
| `brand` | `FK` | **Obrigatório** |
| `category` | `FK` | **Obrigatório** |
| `description` | `string` |               |
| `serie_number` | `string` | **Obrigatório** |
| `cost_price` | `decimal` | **Obrigatório** |
| `selling_price` | `decimal` | **Obrigatório** |
| `quantity` | `int` | **Obrigatório** |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Products - Obter Um Produto Cadastrado - (_Necessário Autenticação_)

```http
  GET /api/v1/products/<int:pk>/detail/
```

#### Products - Editar Um Produto - (_Necessário Autenticação_)

```http
  PUT /api/v1/products/<int:pk>/update/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `title` | `string` | **Obrigatório** |
| `category` | `FK` | **Obrigatório** |
| `brand` | `FK` | **Obrigatório** |
| `description` | `string` |                |
| `serie_number` | `string` | **Obrigatório** |
| `cost_price` | `decimal` | **Obrigatório** |
| `selling_price` | `decimal` | **Obrigatório** |

#### Products - Deletar Um Produto - (_Necessário Autenticação_)

```http
  DELETE /api/v1/products/<int:pk>/delete/
```

## 📋 Documentação da API - Brands
### 💬Criar a marca para cadastrar um novo produto.

#### Brands - Listar Marcas Cadastradas - (_Necessário Autenticação_)

```http
  GET /api/v1/brands/list/
```

#### Brands - Criar Uma Marca - (_Necessário Autenticação_)

```http
  POST /api/v1/brands/create/
```
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório e Automático** |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |       |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Brands - Obter Uma Marca Cadastrada - (_Necessário Autenticação_)

```http
  GET /api/v1/brands/<int:pk>/detail/
```

#### Brands - Editar Uma Marca - (_Necessário Autenticação_)

```http
  PUT /api/v1/brands/<int:pk>/update/
```
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |  

#### Brands - Deletar Uma Marca - (_Necessário Autenticação_)

```http
  DELETE /api/v1/brands/<int:pk>/delete/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `number` | **Obrigatório**. Caso não tenha nenhum produto relacionado ao ID |

## 📋 Documentação da API - Categories 
### 💬Criar a categoria para cadastrar um novo produto.

#### Categories - Listar Categorias Cadastradas - (_Necessário Autenticação_)

```http
  GET /api/v1/categories/list/
```

#### Categories - Criar Uma Categoria - (_Necessário Autenticação_)

```http
  POST /api/v1/categories/create/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório e Automático** |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |       |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Categories - Obter Uma Categoria Cadastrada - (_Necessário Autenticação_)

```http
  GET /api/v1/categories/<int:pk>/detail/
```

#### Categories - Editar Uma Categoria - (_Necessário Autenticação_)

```http
  PUT /api/v1/categories/<int:pk>/update/
```
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |  

#### Categories - Deletar Uma Categoria - (_Necessário Autenticação_)

```http
  DELETE /api/v1/categories/<int:pk>/delete/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `number` | **Obrigatório**. Caso não tenha nenhum produto relacionado ao ID |

## 📋 Documentação da API - Inflows - Entradas de Produtos

#### Inflows - Listar Entradas Cadastradas - (_Necessário Autenticação_)

```http
  GET /api/v1/inflows/list/
```

#### Inflows - Criar Uma Entrada - (_Necessário Autenticação_)

```http
  POST /api/v1/inflows/create/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório e Automático** |
| `supplier` | `FK` | **Obrigatório e Automático** |
| `product` | `FK` | **Obrigatório** |
| `quantity` | `int` | **Obrigatório** |
| `description` | `string` |       |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Inflows - Obter Uma Entrada Cadastrada - (_Necessário Autenticação_)

```http
  GET /api/v1/inflows/<int:pk>/detail/
```

## 📋 Documentação da API - Suppliers 
### 💬Criar o fornecedor para cadastrar uma nova entrada de um produto/Inflow.

#### Suppliers - Listar Fornecedores Cadastrados - (_Necessário Autenticação_)

```http
  GET /api/v1/suppliers/list/
```

#### Suppliers - Criar Um Fornecedor - (_Necessário Autenticação_)

```http
  POST /api/v1/suppliers/create/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório e Automático** |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |       |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Suppliers - Obter Um Fornecedor Cadastrado - (_Necessário Autenticação_)

```http
  GET /api/v1/suppliers/<int:pk>/detail/
```

#### Suppliers - Editar Um Fornecedor - (_Necessário Autenticação_)

```http
  PUT /api/v1/suppliers/<int:pk>/update/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório** |
| `description` | `string` |  

#### Suppliers - Deletar Um Fornecedor - (_Necessário Autenticação_)

```http
  DELETE /api/v1/suppliers/<int:pk>/delete/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `number` | **Obrigatório**. Caso não tenha nenhuma entrada/inflow relacionada ao ID |


## 📋 Documentação da API - Outflows - Saídas de Produtos

#### Outflows - Listar Saídas Cadastradas - (_Necessário Autenticação_)

```http
  GET /api/v1/outflows/list/
```

#### Outflows - Criar Uma Saída - (_Necessário Autenticação_)

```http
  POST /api/v1/outflows/create/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id` | `PK` | **Obrigatório e Automático** |
| `product` | `FK` | **Obrigatório** |
| `quantity` | `int` | **Obrigatório** |
| `description` | `string` |       |
| `created_at` | `datetime` | **Obrigatório e Automático** |
| `updated_at` | `datetime` | **Obrigatório e Automático** |

#### Outflows - Obter Uma Saída Cadastrada - (_Necessário Autenticação_)

```http
  GET /api/v1/outflows/<int:pk>/detail/
```


#Imagens do Projeto

## Login
![alt text](</public/Captura de tela 2025-09-03 041708.png>)

## Home
![alt text](</public/Captura de tela 2025-09-03 035324.png>)
![alt text](</public/Captura de tela 2025-09-03 035333.png>)

## Fornecedores
![alt text](</public/Captura de tela 2025-09-03 035519.png>)
![alt text](</public/Captura de tela 2025-09-03 035531.png>)

## Marcas
![alt text](</public/Captura de tela 2025-09-03 035546.png>)
![alt text](</public/Captura de tela 2025-09-03 035557.png>)

## Categorias
![alt text](</public/Captura de tela 2025-09-03 035614.png>)
![alt text](</public/Captura de tela 2025-09-03 035624.png>)

## Produtos
![alt text](</public/Captura de tela 2025-09-03 035636.png>)
![alt text](</public/Captura de tela 2025-09-03 035648.png>)

## Entradas
![alt text](</public/Captura de tela 2025-09-03 041227.png>)
![alt text](</public/Captura de tela 2025-09-03 041239.png>)

## Saídas
![alt text](</public/Captura de tela 2025-09-03 041249.png>)
![alt text](</public/Captura de tela 2025-09-03 041259.png>)