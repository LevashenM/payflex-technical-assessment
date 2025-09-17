# PaymentOrchestrator - Simplified Solution

A Buy Now Pay Later (BNPL) payments platform built with .NET Aspire, ASP.NET Core Web API, SQLite, and React.

## Tech Stack

### Backend
- ASP.NET Core 8.0 Web API
- Entity Framework Core with SQLite
- .NET Aspire for orchestration and telemetry
- Swagger for API documentation

### Frontend
- React 18.2
- Axios for HTTP requests
- Bootstrap 5 for styling
- Modern functional components with hooks

## Project Structure

```
PaymentOrchestrator/
├── PaymentOrchestrator.Api/           # Main API project
│   ├── Controllers/
│   │   └── PaymentsController.cs      # Payment endpoints
│   ├── Program.cs                     # All models, services, and DbContext
│   └── appsettings.json
├── PaymentOrchestrator.AppHost/       # Aspire orchestration
├── PaymentOrchestrator.ServiceDefaults/ # Shared Aspire configuration
├── frontend/                          # React application
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── App.js                   # Main App component
│   │   └── index.js                 # Entry point
│   └── package.json
└── PaymentOrchestrator.sln           # Solution file
```

## API Endpoints

### GET /api/payments
- Returns all payments ordered by creation date
- Response: Array of Payment objects

### POST /api/payments
- Creates a new payment with "Pending" status
- Request body:
```json
{
  "customerId": "string",
  "amount": 0.01
}
```
- Response: Created Payment object

### POST /api/payments/simulate-confirmation/{paymentId}
- Simulates payment confirmation by updating status to "Confirmed"
- Path parameter: `paymentId` (GUID)
- Response: Updated Payment object

## Domain Model

```csharp
public class Payment
{
    public Guid Id { get; set; }
    public string CustomerId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } // "Pending" or "Confirmed"
    public DateTime CreatedAt { get; set; }
}
```

## How to Run

### Prerequisites
- .NET 8.0 SDK
- Node.js 16+ and npm
- Docker (for .NET Aspire dashboard)

### Running with .NET Aspire (Recommended)
```bash
cd PaymentOrchestrator
# Install frontend dependencies (required after cloning)
cd frontend && npm install && cd ..
# Restore .NET packages and run
dotnet restore # Might need to run dotnet workload restore first
dotnet run --project PaymentOrchestrator.AppHost
```

After starting, the application will be accessible at the following URLs:

#### 🎯 Access Points
- **Aspire Dashboard**: `https://localhost:15888` (or check console for login URL with token)
- **API Backend**: Check Aspire dashboard for the assigned port (typically `http://localhost:5000`)
- **React Frontend**: Check Aspire dashboard for the assigned port (example: `http://localhost:61796`)
- **API Swagger Documentation**: `{API_URL}/swagger` (e.g., `http://localhost:5000/swagger`)

> **Note**: Port numbers are dynamically assigned by Aspire. Always check the Aspire dashboard for the current URLs.

The Aspire dashboard will show:
- **API** running on configured port with health checks and telemetry
- **React Frontend** running via npm with automatic service discovery
- **Database** connection status (SQLite)
- **Service-to-service** communication setup
- **Unified logging** and monitoring

Both frontend and backend will start automatically and be visible in the Aspire dashboard with their assigned ports.

### Alternative: Manual Startup
If you prefer to run services separately:

**Backend:**
```bash
cd PaymentOrchestrator/PaymentOrchestrator.Api
dotnet run
# API will be available at: http://localhost:5000
# Swagger UI at: http://localhost:5000/swagger
```

**Frontend:**
```bash
cd PaymentOrchestrator/frontend
npm install
npm start
# Frontend will be available at: http://localhost:3000
```

#### 🎯 Manual Access Points
- **API Backend**: `http://localhost:5000`
- **React Frontend**: `http://localhost:3000`
- **API Swagger Documentation**: `http://localhost:5000/swagger`

## Sample Usage

### Creating a Payment (curl)
```bash
curl -X POST "http://localhost:5000/api/payments" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "CUST001", "amount": 199.99}'
```

### Getting All Payments
```bash
curl -X GET "http://localhost:5000/api/payments"
```

### Confirming a Payment
```bash
curl -X POST "http://localhost:5000/api/payments/simulate-confirmation/{payment-id}"
```

## Key Simplifications Made

1. **Single Project Architecture**: Combined all layers into one API project
2. **In-Memory Models**: All classes defined in Program.cs for simplicity
3. **SQLite Database**: File-based database, no separate database server needed
4. **No Complex DI**: Minimal dependency injection, just what's needed
5. **Direct Controller Actions**: No complex service layers or repositories
6. **Simple React Structure**: Functional components, no complex state management
7. **Basic Error Handling**: Simple try-catch blocks instead of complex middleware

## Features

### Frontend Features
- ✅ Create new payments with validation
- ✅ View all payments in a responsive table
- ✅ Confirm pending payments with one click
- ✅ Real-time updates and loading states
- ✅ Bootstrap styling for clean UI
- ✅ Client-side validation
- ✅ Success/error notifications

### Backend Features
- ✅ RESTful API endpoints
- ✅ Entity Framework Core with SQLite
- ✅ Automatic database creation
- ✅ Input validation
- ✅ Error handling
- ✅ Swagger documentation
- ✅ CORS enabled for frontend
- ✅ .NET Aspire integration

## Development Notes

- SQLite database file (`payments.db`) is created automatically in the API project directory
- The React app uses a proxy to avoid CORS issues during development
- .NET Aspire provides excellent development experience with built-in telemetry
- All business logic is intentionally kept simple and in one place

## Deployment Considerations

- For production, consider using a proper database server
- Add authentication/authorization as needed
- Implement proper logging and monitoring
- Add more comprehensive error handling
- Consider containerization for easier deployment

This simplified solution demonstrates the core requirements while being much easier to understand, maintain, and deploy than the original complex architecture.