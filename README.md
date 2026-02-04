# Sticky Notes App

A single-page sticky notes application built with **React**, **TypeScript**, and **Vite**. The app focuses on interaction design, performance, and clean architecture, implementing core drag-and-drop behaviors without relying on third-party UI or interaction libraries.

This project was implemented as a take-home assignment, with emphasis on correctness, usability, and maintainable code structure.

![React](https://img.shields.io/badge/React-v19.1.0-blue) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-v2.6.1-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-blue) ![Vite](https://img.shields.io/badge/Vite-v6.2.4-purple) ![CSS](https://img.shields.io/badge/CSS-Modern-blue)

## 📖 Table of Contents

- [🕹️ How it Works](#️-how-it-works)
- [🚀 Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [⚙️ Local Setup and Development](#️-local-setup-and-development)
- [📧 Contact](#-contact)

## 🕹️ How it Works

- Notes are displayed on a board and positioned using absolute layout.
- Each note can be:
  - Moved by dragging
  - Resized by dragging its resize handle
  - Deleted by dragging it over the trash zone
- All interactions are implemented using `PointerEvents` and `requestAnimationFrame` for smooth updates.
- Note state is managed centrally and committed only at the end of interactions.

The application is designed for **desktop usage** (minimum resolution: 1024×768).

## 🚀 Features

- **Create Notes at Position:** New notes are created directly on the board at the cursor position.
- **Move Notes by Dragging:** Notes can be freely repositioned within board bounds.
- **Resize Notes by Dragging:** Notes support resizing with minimum width and height constraints.
- **Delete via Trash Zone:** Notes are removed when dropped over a dedicated trash area, with live visual feedback during drag.
- **Performance-Oriented Dragging:** DOM updates are performed via `requestAnimationFrame`; React state updates are deferred until interaction commit
- **Strict Type Safety:** Geometry, interaction modes, and reducers are fully typed; ESLint is configured with type-aware rules

## 🛠️ Technologies

- **Framework**: [React.js](https://reactjs.org/) (leveraging [React + TypeScript + Vite template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts))
- **Languages**: TypeScript, HTML5, SCSS
- **Build Tools**: [Vite](https://vitejs.dev/)
- **Package Manager**: [NPM](https://nodejs.org/en/download/current)
- **Version Control**: [Git](https://git-scm.com/)
- **Node.js Version Manager**: [NVM](https://github.com/nvm-sh/nvm) (for managing Node.js versions)

## ⚙️ Local Setup and Development

### Prerequisites

In order to run the app locally, the following packages should be pre-installed on your local machine:

- [Git](https://git-scm.com/)
- [Node.js (v20)](https://nodejs.org/)
- [NPM](https://nodejs.org/en/download/current)

> **Note**: If you need to switch between different Node.js versions, you can use [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm). Install NVM and run the following command to use Node.js v20:
>
> ```bash
> nvm install 20
> nvm use 20
> ```

### Setup and Development

1. Clone the repository:

   ```bash
   git clone https://github.com/prikhoda-natalia/sticky-notes-app
   cd sticky-notes-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:5173`.

## 📧 Contact

Feel free to reach out if you have any questions or feedback:

- **Email**: [prikhoda.natalia.webdev@gmail.com](mailto:prikhoda.natalia.webdev@gmail.com)
- **LinkedIn**: [Natalia Prikhoda](https://www.linkedin.com/in/prikhoda-natalia/)
- **GitHub**: [prikhoda-natalia](https://github.com/prikhoda-natalia)
