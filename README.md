# TaskMaster Pro 🚀

A modern, full-stack Task Management application built to demonstrate cloud-native development practices using .NET 8 and React.

## 🌐 Live Demo
* **Frontend:** [https://taskmaster-ui-eight.vercel.app](https://taskmaster-ui-eight.vercel.app)
* **Backend API:** [Azure Web App Service](https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks)

## 🛠️ Technology Stack

### Frontend
* **React 18** with **Vite**
* **Tailwind CSS** for modern, responsive UI
* **Fetch API** for asynchronous backend communication
* **Vercel** for automated CI/CD deployment

### Backend
* **ASP.NET Core 8 Web API**
* **Entity Framework Core** (Code-First Migrations)
* **Azure SQL Database** (Cloud-hosted)
* **Microsoft Entra ID** (Managed Identity) for passwordless database security

## 🏗️ Architecture
The application follows a decoupled architecture where the React frontend communicates with the RESTful .NET API. Data is persisted in a highly available Azure SQL instance.



## 🚀 Key Features
* **Full CRUD functionality:** Create, Read, Update, and Delete tasks.
* **Cloud-First:** Fully hosted in the cloud with separated concerns.
* **Modern Security:** Uses Managed Identity to link Azure services securely without hardcoded credentials.
* **Responsive Design:** Fully usable on mobile and desktop.

## 🔧 Local Setup
1. Clone the repository.
2. Update the `apiUrl` in `App.jsx` to `https://localhost:7125`.
3. Run `npm install` and `npm run dev`.