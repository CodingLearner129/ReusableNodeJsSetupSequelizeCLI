# Node JS Project README

This is a Node JS project created to [briefly describe the project's purpose or goal].

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
<!-- -   [Project Structure](#project-structure)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Contributing](#contributing)
-   [License](#license) -->

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   [Node.js](https://nodejs.org) (^20.9.0)
-   [npm](https://www.npmjs.com) (^10.1.0)
-   [Database](#configure-database) (MySQL)

## Getting Started

Follow these steps to get the project up and running:

1.  Clone this repository:

    ```bash
    git clone https://github.com/CodingLearner129/ReusableNodeJsSetupSequelizeCLI.git
    ```

2.  Change into the project directory:

    ```bash
    cd ReusableNodeJsSetupSequelizeCLI
    ```

3.  Install Node JS dependencies using Composer:

    ```bash
    npm install
    ```

4.  Create a copy of the .env.example file and rename it to .env:

    ```bash
    cp .env.example .env
    ```

5.  Configure your database in the .env file:

    ```bash
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_CHARSET=utf8mb4
    DB_COLLATION=utf8mb4_unicode_ci
    DB_LOGGING=false
    TIMEZONE="+05:30"
    ```
5.  Configure your database in the .env file:

    ```bash
    JWT_ENCRYPTION=your_secret_string
    ```

6.  Change into the src directory:

    ```bash
    cd src
    ```

7.  Run migration to generate database schema:

    ```bash
    npx sequelize-cli db:migrate
    ```

8.  Change into the project directory:

    ```bash
    cd ..
    ```

9.  Start the development server:

    ```bash
    npm run dev
    ```
