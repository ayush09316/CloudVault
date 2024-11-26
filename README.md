<div align="center">
  <br />
      <img src="/public/banner.png" alt="Project Banner">
  <br />

  <div>
     <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>

<h3 align="center">Storage and File Sharing Platform</h3>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 📊 [Overview](#overview)
2. 🤖 [Introduction](#introduction)
3. ⚙️ [Tech Stack](#tech-stack)
4. 🔋 [Features](#features)
5. 🤸 [Quick Start](#quick-start)
6. 🛠️ [Dockerization and Kubernetes Deployment](#dockerization-and-kubernetes-deployment)

## <a name="overview">🤖 Overview</a>

![Screenshot 2024-11-26 183826](https://github.com/user-attachments/assets/87b2e868-0016-41ec-ba86-ad32efa7b4b3)
![Screenshot 2024-11-26 184636](https://github.com/user-attachments/assets/22f2e3f9-2083-4388-9efe-2f359ebfc7a0)


## <a name="introduction">🤖 Introduction</a>

A storage management and file sharing platform that lets users effortlessly upload, organize, and share files. Built with the latest Next.js 15 and the Appwrite Node SDK, utilizing advanced features for seamless file management.

This application is dockerized, deployed on Kubernetes, and follows a CI/CD pipeline managed through GitHub Actions. We ensure code quality and consistency using ESLint, Prettier, and Husky hooks for seamless development.


## <a name="tech-stack">⚙️ Tech Stack</a>

- **React 19**
- **Next.js 15**
- **Appwrite** (Authentication, File Storage)
- **TailwindCSS**
- **ShadCN**
- **TypeScript**
- **Docker** (for containerization)
- **Kubernetes** (for deployment)
- **GitHub Actions** (for CI/CD pipeline)
- **ESLint** (for linting)
- **Prettier** (for code formatting)
- **Husky** (for Git hooks)

## <a name="features">🔋 Features</a>

👉 **User Authentication with Appwrite**: Implement signup, login, and logout functionality using Appwrite's authentication system.

👉 **FIle Uploads**: Effortlessly upload a variety of file types, including documents, images, videos, and audio, ensuring all your important data.

👉 **View and Manage Files**: Users can browse through their uploaded files stored in Appwrite storage, view on a new tab, rename file or delete.

👉 **Download Files**: Users can download their uploaded files giving them instant access to essential documents.

👉 **File Sharing**: Users can easily share their uploaded files with others, enabling collaboration and easy access to important content.

👉 **Dashboard**: Gain insights at a glance with a dynamic dashboard that showcases total and consumed storage, recent uploads, and a summary of files grouped by type.

👉 **Global Search**: Users can quickly find files and shared content across the platform with a robust global search feature.

👉 **Sorting Options**: Organize files efficiently by sorting them by date, name, or size, making file management a breeze.

👉 **Modern Responsive Design**: A fresh and minimalist UI that emphasizes usability, ensuring a clean aesthetic across all devices.

👉 **Grid and List View**:  Allow users to toggle between grid (thumbnail) and list views. Use CSS and JavaScript to switch layouts dynamically.

👉 Admin platform: Empower admins with comprehensive insights, including total storage usage, recent uploads, and a summary of files categorized by type. Monitor and manage the system's performance efficiently with real-time data.

and many more, including the latest **React 19**, **Next.js 15** and **Appwrite** features alongside code architecture and
reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Docker](https://www.docker.com/products/docker-desktop) (for containerization)
- [Kubernetes](https://kubernetes.io/) (for deployment)

**Cloning the Repository**

```bash
git clone https://github.com/JavaScript-Mastery-Pro/storage_management_solution.git
cd storage_management_solution
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT=""
NEXT_PUBLIC_APPWRITE_DATABASE=""
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=""
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=""
NEXT_PUBLIC_APPWRITE_BUCKET=""
NEXT_APPWRITE_KEY=""
```

Replace the values with your actual Appwrite credentials. You can obtain these credentials by signing up &
creating a new project on the [Appwrite website](https://appwrite.io/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


<br/>


## <a name="dockerization-and-kubernetes-deployment">🛠️ Dockerization and Kubernetes Deployment</a>



**Docker Setup**

- Dockerfile: The application is built using a Dockerfile, which creates a Docker image of the app. This image can then be deployed to any environment that supports Docker.
  
**Kubernetes Deployment**

- Kubernetes: The project is deployed on Kubernetes, using a Kubernetes cluster to manage scaling, monitoring, and production deployment.
  
**CI/CD Pipeline**

- GitHub Actions: The project integrates CI/CD through GitHub Actions, automating testing, linting, building, and deployment processes. Every push to the main branch triggers the pipeline, ensuring a seamless development workflow.
  
**Linting and Code Quality**

- ESLint: The project uses ESLint to maintain code quality by enforcing coding standards.
- Prettier: Prettier ensures that the code is formatted consistently across the project.
- Husky: Husky is used for Git hooks, running pre-commit hooks to prevent errors from entering the codebase.
  
**Deployment Workflow**

- Staging Environment: Code is automatically deployed to a staging environment for testing.
- Production Environment: Once tested in staging, the application is deployed to the production environment.

