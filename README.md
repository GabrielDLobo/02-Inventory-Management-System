# 02-Inventory-Management-System


A full-featured **Inventory Management System** designed to securely handle inventory operations such as tracking products, brands, categories, suppliers, and managing inflows and outflows. Built with **Django Rest Framework** and **TailwindCSS**, the system supports JWT authentication for secure access control.

## Main Features

- **Product Management**: Add, update, and delete products with detailed information.
- **Brand & Category Handling**: Organize inventory by brands and categories.
- **Supplier Management**: Keep track of suppliers for efficient sourcing.
- **Flow Operations**: Manage inflows and outflows effortlessly to track stock changes.
- **User Authentication**: Implemented using **JWT (JSON Web Tokens)** for secure access.
- **Responsive Design**: Styled with **TailwindCSS** to ensure a good user experience across devices.

---

## Live Demo

Coming soon.
---

## Table of Contents

- [02-Inventory-Management-System](#02-inventory-management-system)
  - [Main Features](#main-features)
  - [Live Demo](#live-demo)
  - [Coming soon.](#coming-soon)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Requirements](#requirements)
  - [Setup Instructions](#setup-instructions)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
  - [Running Locally](#running-locally)
    - [Using Docker](#using-docker)
    - [Without Docker](#without-docker)
  - [Development Mode](#development-mode)
  - [Project Structure](#project-structure)
  - [License](#license)
  - [Contributing](#contributing)
- [Project Images](#project-images)
  - [Login](#login)
  - [Home](#home)
  - [Suppliers / Fornecedores](#suppliers--fornecedores)
  - [Brands / Marcas](#brands--marcas)
  - [Categories / Categorias](#categories--categorias)
  - [Products / Produtos](#products--produtos)
  - [Inflows / Entradas](#inflows--entradas)
  - [Outflows / Saídas](#outflows--saídas)

---

## Technologies

This project leverages the following key technologies:

- **Backend**:
  - `Django`
  - `Django Rest Framework`
- **Frontend**:
  - `HTML`
  - `TailwindCSS`
- **Database**:
  - Configurable (PostgreSQL, SQLite, etc.)
- **Containerization**:
  - `Docker`
  - `docker-compose`
- **Authentication**:
  - JWT (JSON Web Tokens)
- **Code Quality**:
  - `Flake8`

---

## Requirements

Make sure you have the following installed:

- Python 3.8+
- Docker (for containerized environments)
- npm (Node Package Manager) for TailwindCSS if not using Docker
- pip for Python dependency management

---

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/GabrielDLobo/02-Inventory-Management-System.git
cd 02-Inventory-Management-System
```

### Install Dependencies

Install Python dependencies:

```bash
pip install -r requirements.txt
```

For development, also install these:

```bash
pip install -r requirements_dev.txt
```

Install JavaScript dependencies for TailwindCSS if required:

```bash
npm install
```

---

## Running Locally

### Using Docker

1. Build the Docker containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application at [`http://localhost:8000`](http://localhost:8000).

### Without Docker

1. Run database migrations:
   ```bash
   python manage.py migrate
   ```

2. Start the development server:
   ```bash
   python manage.py runserver
   ```

3. Access the system at [`http://localhost:8000`](http://localhost:8000).

---

## Development Mode

When developing, you can use the provided `manage.py` file to run jobs, migrations, and other Django commands. Ensure to use `flake8` for code formatting:

```bash
flake8
```
For periodic tasks, see `/cron`.

---

## Project Structure

```
.
|-- ai/
|-- app/
|-- authentication/
|-- brands/
|-- categories/
|-- inflows/
|-- outflows/
|-- products/
|-- public/
|-- suppliers/
|-- services/  
```

- `Dockerfile` → Used for building the Docker container.
- `docker-compose.yml` → Predefined setup for container orchestration.
- `requirements.txt` → Production dependencies.
- `requirements_dev.txt` → Development dependencies.
- `manage.py` → Main project management script.

---

## License

> This project is open source, but no license was explicitly defined.

Feel free to clone, use, and contribute back!

---

## Contributing

Pull requests are welcome! For large changes, consider opening an issue first to discuss what you would like to change.

---

# Project Images

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