# 💻📦 Inventory Management System | Sistema de Gestão de Estoque

--- 

### English Version
A full-featured inventory management system built with Django Rest Framework and Bootstrap5. It enables secure management of products, brands, categories, suppliers, inflows and outflows using JWT authentication.

### PT/BR
Um sistema completo de gestão de estoque construído com Django Rest Framework e Bootstrap5. Permite o gerenciamento seguro de produtos, marcas, categorias, fornecedores, entradas e saídas com autenticação JWT.

---

## 🚀 Features | Funcionalidades

- 🧾 Product, brand, category and supplier registration  
- 📥 Inflow and outflow control  
- 🔐 JWT authentication  
- 📊 RESTful API documentation  
- 🎨 Responsive interface with Bootstrap5  
- 🤖 Optional OpenAI integration for contextual intelligence

### PT/BR

- 🧾 Cadastro de produtos, marcas, categorias e fornecedores  
- 📥 Controle de entradas e saídas  
- 🔐 Autenticação com JWT  
- 📊 Documentação da API RESTful  
- 🎨 Interface responsiva com Bootstrap5  
- 🤖 Integração opcional com OpenAI para inteligência contextual

---

## 🧪 Tech Stack | Stacks Utilizadas

| Layer         | Technologies                          |
|---------------|----------------------------------------|
| Front-end     | HTML5, CSS3, Bootstrap5                |
| Back-end      | Django, Django Rest Framework, JWT     |
| Database      | PostgreSQL                             |
| AI (optional) | OpenAI                                 |

### PT/BR

| Camada        | Tecnologias                            |
|---------------|----------------------------------------|
| Front-end     | HTML5, CSS3, Bootstrap5                |
| Back-end      | Django, Django Rest Framework, JWT     |
| Banco de Dados| PostgreSQL                             |
| IA (opcional) | OpenAI                                 |

---


## ⛏️ Instalação | Installation


Run the project using Python

```bash
  py manage.py runserver
```
    
--- 

## 📋 API Reference | Documentação Geral da API

The API is organized into modules:

- `/api/v1/auth/` → Authentication  
- `/api/v1/products/` → Products  
- `/api/v1/brands/` → Brands  
- `/api/v1/categories/` → Categories  
- `/api/v1/inflows/` → Inflows  
- `/api/v1/outflows/` → Outflows  
- `/api/v1/suppliers/` → Suppliers  

Each route requires authentication and follows REST standards (`list`, `create`, `detail`, `update`, `delete`).

### PT/BR 

A API está organizada em módulos:

- `/api/v1/auth/` → Autenticação  
- `/api/v1/products/` → Produtos  
- `/api/v1/brands/` → Marcas  
- `/api/v1/categories/` → Categorias  
- `/api/v1/inflows/` → Entradas  
- `/api/v1/outflows/` → Saídas  
- `/api/v1/suppliers/` → Fornecedores  

Cada rota exige autenticação e segue os padrões REST (`list`, `create`, `detail`, `update`, `delete`).

---

# 📋 Detailed API Documentation / Documentação detalhada da API

## 🔐 Authentication Module | Módulo de Autenticação

### POST /api/v1/admin/ — Create Admin Account  
Creates a new admin user. Requires authentication.  
Cria uma conta de administrador. Requer autenticação.

#### Request Body | Corpo da Requisição

| Parameter          | Type     | Required | Description / Descrição             |
|--------------------|----------|----------|-------------------------------------|
| `email`            | string   | ✅       | Admin email / Email do administrador |
| `password`         | string   | ✅       | Admin password / Senha do administrador |
| `group_permission` | FK       | ✅       | Permission group / Grupo de permissão |

---

### POST /api/v1/auth/login — User Login  
Authenticates a user and returns JWT tokens.  
Autentica o usuário e retorna tokens JWT.

#### Request Body | Corpo da Requisição

| Parameter   | Type     | Required | Description / Descrição       |
|-------------|----------|----------|-------------------------------|
| `email`     | string   | ✅       | User email / Email do usuário |
| `password`  | string   | ✅       | User password / Senha do usuário |


---

## 📦 Products Module | Módulo de Produtos

### GET /api/v1/products/list — List Products  
Returns all registered products.  
Retorna todos os produtos cadastrados.

---

### POST /api/v1/products/create — Create Product  
Creates a new product in the inventory.  
Cria um novo produto no estoque.

#### Request Body | Corpo da Requisição

| Parameter       | Type     | Required | Description / Descrição         |
|-----------------|----------|----------|---------------------------------|
| `title`         | string   | ✅       | Product name / Nome do produto  |
| `brand`         | FK       | ✅       | Brand reference / Marca         |
| `category`      | FK       | ✅       | Category reference / Categoria  |
| `description`   | string   | ❌       | Description / Descrição         |
| `serie_number`  | string   | ✅       | Serial number / Nº de série     |
| `cost_price`    | decimal  | ✅       | Cost price / Preço de custo     |
| `selling_price` | decimal  | ✅       | Selling price / Preço de venda  |
| `quantity`      | int      | ✅       | Stock quantity / Quantidade     |

---

### GET /api/v1/products/<int:pk>/detail — Get Product  
Returns details of a specific product.  
Obtém os detalhes de um produto específico.

---

### PUT /api/v1/products/<int:pk>/update — Update Product  
Updates product information.  
Atualiza as informações de um produto.

---

### DELETE /api/v1/products/<int:pk>/delete — Delete Product  
Deletes a product if no dependencies exist.  
Deleta um produto, se não houver dependências.

---

## 🏷️ Brands Module | Módulo de Marcas

### GET /api/v1/brands/list — List Brands  
Returns all registered brands.  
Retorna todas as marcas cadastradas.

---

### POST /api/v1/brands/create — Create Brand  
Registers a new brand.  
Cadastra uma nova marca.

| Parameter     | Type     | Required | Description / Descrição     |
|---------------|----------|----------|-----------------------------|
| `name`        | string   | ✅       | Brand name / Nome da marca |
| `description` | string   | ❌       | Description / Descrição     |

---

### GET /api/v1/brands/<int:pk>/detail — Get Brand  
Returns brand details.  
Obtém os detalhes de uma marca.

---

### PUT /api/v1/brands/<int:pk>/update — Update Brand  
Updates brand data.  
Atualiza os dados de uma marca.

---

### DELETE /api/v1/brands/<int:pk>/delete — Delete Brand  
Deletes a brand if no products are linked.  
Deleta uma marca, se não houver produtos vinculados.

---

## 🗂️ Categories Module | Módulo de Categorias

### GET /api/v1/categories/list — List Categories  
Returns all registered categories.  
Retorna todas as categorias cadastradas.

---

### POST /api/v1/categories/create — Create Category  
Registers a new category.  
Cadastra uma nova categoria.

| Parameter     | Type     | Required | Description / Descrição     |
|---------------|----------|----------|-----------------------------|
| `name`        | string   | ✅       | Category name / Nome da categoria |
| `description` | string   | ❌       | Description / Descrição     |

---

### GET /api/v1/categories/<int:pk>/detail — Get Category  
Returns category details.  
Obtém os detalhes de uma categoria.

---

### PUT /api/v1/categories/<int:pk>/update — Update Category  
Updates category data.  
Atualiza os dados de uma categoria.

---

### DELETE /api/v1/categories/<int:pk>/delete — Delete Category  
Deletes a category if no products are linked.  
Deleta uma categoria, se não houver produtos vinculados.

---

## 📥 Inflows Module | Módulo de Entradas

### GET /api/v1/inflows/list — List Inflows  
Returns all registered inflows.  
Retorna todas as entradas cadastradas.

---

### POST /api/v1/inflows/create — Create Inflow  
Registers a new product inflow.  
Cadastra uma nova entrada de produto.

| Parameter     | Type     | Required | Description / Descrição     |
|---------------|----------|----------|-----------------------------|
| `supplier`    | FK       | ✅       | Supplier / Fornecedor       |
| `product`     | FK       | ✅       | Product / Produto           |
| `quantity`    | int      | ✅       | Quantity / Quantidade       |
| `description` | string   | ❌       | Description / Descrição     |

---

### GET /api/v1/inflows/<int:pk>/detail — Get Inflow  
Returns inflow details.  
Obtém os detalhes de uma entrada.

---

## 🚚 Suppliers Module | Módulo de Fornecedores

### GET /api/v1/suppliers/list — List Suppliers  
Returns all registered suppliers.  
Retorna todos os fornecedores cadastrados.

---

### POST /api/v1/suppliers/create — Create Supplier  
Registers a new supplier.  
Cadastra um novo fornecedor.

| Parameter     | Type     | Required | Description / Descrição     |
|---------------|----------|----------|-----------------------------|
| `name`        | string   | ✅       | Supplier name / Nome        |
| `description` | string   | ❌       | Description / Descrição     |

---

### GET /api/v1/suppliers/<int:pk>/detail — Get Supplier  
Returns supplier details.  
Obtém os detalhes de um fornecedor.

---

### PUT /api/v1/suppliers/<int:pk>/update — Update Supplier  
Updates supplier data.  
Atualiza os dados de um fornecedor.

---

### DELETE /api/v1/suppliers/<int:pk>/delete — Delete Supplier  
Deletes a supplier if no inflows are linked.  
Deleta um fornecedor, se não houver entradas vinculadas.

---

## 📤 Outflows Module | Módulo de Saídas

### GET /api/v1/outflows/list — List Outflows  
Returns all registered outflows.  
Retorna todas as saídas cadastradas.

---

### POST /api/v1/outflows/create — Create Outflow  
Registers a new product outflow.  
Cadastra uma nova saída de produto.

| Parameter     | Type     | Required | Description / Descrição     |
|---------------|----------|----------|-----------------------------|
| `product`     | FK       | ✅       | Product / Produto           |
| `quantity`    | int      | ✅       | Quantity / Quantidade       |
| `description` | string   | ❌       | Description / Descrição     |

---

### GET /api/v1/outflows/<int:pk>/detail — Get Outflow  
Returns outflow details.  
Obtém os detalhes de uma saída.

---

# 🖼️ Project Images / Imagens do Projeto

## Login
![alt text](</public/Captura de tela 2025-09-03 041708.png>)

## Home
![alt text](</public/Captura de tela 2025-09-03 035324.png>)
![alt text](</public/Captura de tela 2025-09-03 035333.png>)

## Suppliers / Fornecedores 
![alt text](</public/Captura de tela 2025-09-03 035519.png>)
![alt text](</public/Captura de tela 2025-09-03 035531.png>)

## Brands / Marcas
![alt text](</public/Captura de tela 2025-09-03 035546.png>)
![alt text](</public/Captura de tela 2025-09-03 035557.png>)

## Categories / Categorias
![alt text](</public/Captura de tela 2025-09-03 035614.png>)
![alt text](</public/Captura de tela 2025-09-03 035624.png>)

## Products / Produtos
![alt text](</public/Captura de tela 2025-09-03 035636.png>)
![alt text](</public/Captura de tela 2025-09-03 035648.png>)

## Inflows / Entradas
![alt text](</public/Captura de tela 2025-09-03 041227.png>)
![alt text](</public/Captura de tela 2025-09-03 041239.png>)

## Outflows / Saídas
![alt text](</public/Captura de tela 2025-09-03 041249.png>)
![alt text](</public/Captura de tela 2025-09-03 041259.png>)