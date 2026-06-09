# Subdomain Enumeration API

A comprehensive subdomain enumeration solution using OWASP Amass, Python, and Express.js. This project automates passive reconnaissance on domains, validates discovered subdomains, and provides a RESTful API for integration.

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐     ┌──────────────┐
│ Express API │────▶│ Python Script│
│  (Bun/TS)   │     │ (enumerate)  │
└──────┬──────┘     └──────┬───────┘
       │                   │
       │                   ▼
       │            ┌──────────────┐
       │            │  OWASP Amass │
       │            │  (Docker)    │
       │            └──────────────┘
       │
       ▼
┌─────────────┐
│   Outputs   │
│    (JSON)   │
└─────────────┘
```

## 🚀 Installation

### Prerequisites

-   Docker and Docker Compose
-   Bun runtime (or Node.js 18+)

### How to Run

**Step 1: Start Amass Container**

```bash
cd docker
docker compose up -d
```

This will build and start the Amass container with all required dependencies.

**Step 2: Run API Server**

Open a new terminal and run with Bun:

```bash
cd api
bun run src/index.ts
```

Or with Node.js:

```bash
cd api
npm install
npm run start
```

The API server will start on `http://localhost:3000`

**Step 3: Test the API**

```bash
curl http://localhost:3000/health
```

You should see:

```json
{
    "status": "healthy",
    "timestamp": "2026-01-01T12:00:00.000Z",
    "service": "subdomain-enumeration-api"
}
```

### Stopping the Services

To stop the Amass container:

```bash
cd docker
docker compose down
```

To stop the API server, press `Ctrl+C` in the terminal where it's running.

## 📚 API Documentation

### Endpoint: `POST /enumerate`

Start subdomain enumeration for a domain.

#### Request

```bash
curl -X POST http://localhost:3000/enumerate \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

**Request Body:**

```json
{
    "domain": "example.com"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "timestamp": "2026-01-01T12:00:00.000Z",
    "total_subdomains": 15,
    "active_subdomains": 8,
    "subdomains": [...],
    "active": [...],
    "inactive": [...]
  },
  "metadata": {
    /* Processing metadata */
  }
}
```

**Response Codes:**

-   `200 OK` - Enumeration completed successfully
-   `400 Bad Request` - Invalid domain format or missing domain
-   `500 Internal Server Error` - Enumeration failed
