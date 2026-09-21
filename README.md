# Todo List Web App

A full-stack todo list application with a React/Vite frontend and an ASP.NET Core backend.

## Prerequisites

- .NET 10 SDK
- Node.js and npm
- SQL Server running locally on `localhost:1433`

## Run Locally

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

Apply the database migrations:

```bash
dotnet tool restore
dotnet ef database update --project backend
```

Start the backend in a separate terminal:

```bash
npm run be
```

The backend runs at `http://localhost:5555` with the HTTP launch profile.

Start the frontend in another terminal:

```bash
npm run fe
```

The frontend runs at `http://localhost:5173`.

## Tests and Checks (WIP)

Run backend tests:

```bash
dotnet test backend.tests/backend.tests.csproj
```

Build and lint the frontend:

```bash
cd frontend
npm run build
npm run lint
```

## Local Development Configuration

The development settings in `backend/appsettings.Development.json` include local database credentials and a development JWT key so the application can be run locally without extra configuration. These values are intentionally committed for this local-development setup.

They must not be reused for production, shared environments, or deployed services. Production deployments should provide secrets through environment variables, .NET user secrets, or a secrets manager, and should use rotated credentials and signing keys.
