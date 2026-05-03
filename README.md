# GDG Cybersecurity Hands-on Learning Resource

A modern web application built with **Node.js**, **Express**, and **TypeScript**. 

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript 
* **Framework:** Express.js (Inferred from package name `rest-express`)
* **Styling:** CSS
* **Tooling:** `tsx` (for executing TypeScript), `cross-env` (for environment variables)

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (Latest LTS version recommended)
* npm (comes with Node.js)

### Installation

1.  Navigate to the project directory:
    ```bash
    cd InteractiveModern
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Project

To start the development server:

```bash
npm run dev
```

**Verify the deployment:**
    Once the server starts, open your web browser and navigate to:
    > **http://localhost:5000**

## Repository Layout

This repository is now a single-app root layout:

- `client/` - React frontend
- `server/` - Express backend
- `shared/` - shared schemas and types
- `api/` - Vercel serverless entrypoint
- `package.json` - root build and run scripts
