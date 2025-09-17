# PaymentOrchestrator Lite - Solution Architecture Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Technical Stack Analysis](#technical-stack-analysis)
4. [Design Patterns and Principles](#design-patterns-and-principles)
5. [Data Architecture](#data-architecture)
6. [Security Architecture](#security-architecture)
7. [Performance and Scalability](#performance-and-scalability)
8. [Deployment Architecture](#deployment-architecture)
9. [Monitoring and Observability](#monitoring-and-observability)
10. [Technical Decision Rationale](#technical-decision-rationale)
11. [Comprehensive Q&A](#comprehensive-qa)
12. [Future Considerations](#future-considerations)

---

## Executive Summary

PaymentOrchestrator Lite is a microservice-based Buy Now Pay Later (BNPL) payment processing system designed to demonstrate enterprise-grade software architecture principles. The solution implements a clean, scalable, and maintainable architecture using modern technologies including .NET 8, React, PostgreSQL, and Docker containerization.

### Key Architectural Highlights
- **Clean Architecture**: Separation of concerns with clear dependency boundaries
- **Domain-Driven Design**: Payment domain modeling with rich business logic
- **Microservice Ready**: Containerized services with independent scaling capabilities
- **Cloud Native**: Docker-first approach with orchestration readiness
- **Event Simulation**: Demonstration of event-driven architecture patterns
- **Production Ready**: Comprehensive logging, health checks, and monitoring

---

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PaymentOrchestrator Lite                             │
├─────────────────┬─────────────────┬─────────────────┬─────────────────────────────┤
│   Presentation  │   Application   │  Infrastructure │       External Services     │
│      Layer      │      Layer      │      Layer      │                             │
└─────────────────┴─────────────────┴─────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Frontend Tier                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  React SPA      │  │  Nginx Proxy    │  │  Static Assets  │                │
│  │  - Components   │  │  - SSL Term.    │  │  - Images       │                │
│  │  - State Mgmt   │  │  - Load Bal.    │  │  - CSS/JS       │                │
│  │  - API Client   │  │  - Compression  │  │  - Fonts        │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ HTTPS/REST API
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API Gateway Layer                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  API Gateway    │  │  Rate Limiting  │  │  Authentication │                │
│  │  - Routing      │  │  - Throttling   │  │  - Authorization│                │
│  │  - Validation   │  │  - Circuit Br.  │  │  - JWT Tokens   │                │
│  │  - Transformation│ │  - Health Chk   │  │  - CORS Policy  │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ Internal APIs
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Application Services Layer                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Payment API    │  │  Notification   │  │  Audit Service  │                │
│  │  - Controllers  │  │  Service        │  │  - Event Log    │                │
│  │  - Validation   │  │  - Email/SMS    │  │  - Compliance   │                │
│  │  - Error Hdlg   │  │  - Push Notify  │  │  - Monitoring   │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ Business Logic
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Business Logic Layer                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Domain Services│  │  Payment Engine │  │  Risk Assessment│                │
│  │  - Business Rul.│  │  - State Mgmt   │  │  - Fraud Detect │                │
│  │  - Validation   │  │  - Workflow     │  │  - Credit Check │                │
│  │  - Calculations │  │  - Confirmation │  │  - Limits       │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ Data Access
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Data Access Layer                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Repositories   │  │  Entity FW Core │  │  Data Context   │                │
│  │  - CRUD Ops     │  │  - ORM Mapping  │  │  - DB Config    │                │
│  │  - Query Opt.   │  │  - Migrations   │  │  - Connection   │                │
│  │  - Caching      │  │  - Change Track │  │  - Transactions │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ Persistence
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               Data Storage Layer                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  PostgreSQL     │  │  Redis Cache    │  │  File Storage   │                │
│  │  - Primary DB   │  │  - Session      │  │  - Documents    │                │
│  │  - ACID Trans   │  │  - Rate Limit   │  │  - Logs         │                │
│  │  - Replication  │  │  - Temp Data    │  │  - Backups      │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Service Interaction Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Client    │    │   Frontend   │    │   Backend    │    │   Database   │
│   Browser    │    │  React App   │    │  .NET 8 API  │    │ PostgreSQL   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │                   │
       │ 1. HTTP Request   │                   │                   │
       ├──────────────────▶│                   │                   │
       │                   │ 2. API Call       │                   │
       │                   ├──────────────────▶│                   │
       │                   │                   │ 3. Query/Command  │
       │                   │                   ├──────────────────▶│
       │                   │                   │ 4. Data Response  │
       │                   │                   │◀──────────────────┤
       │                   │ 5. JSON Response  │                   │
       │                   │◀──────────────────┤                   │
       │ 6. UI Update      │                   │                   │
       │◀──────────────────┤                   │                   │
       │                   │                   │                   │
```

---

## Technical Stack Analysis

### Backend Technology Stack

#### .NET 8 Web API
**Decision Rationale:**
- **Performance**: Native AOT compilation and improved runtime performance
- **LTS Support**: Long-term support until 2026
- **Modern Features**: Minimal APIs, improved dependency injection, enhanced logging
- **Cloud Native**: First-class container support and Kubernetes integration

**Key Features Utilized:**
```csharp
// Health Checks with Entity Framework
builder.Services.AddHealthChecks()
    .AddDbContextCheck<PaymentContext>();

// Problem Details for standardized error responses
builder.Services.AddProblemDetails();

// Enhanced Swagger documentation
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new() { 
        Title = "PaymentOrchestrator API", 
        Version = "v1",
        Description = "BNPL payments microservice API"
    });
});
```

#### Entity Framework Core 8
**Decision Rationale:**
- **Performance**: Significant improvements in EF Core 8
- **Database Flexibility**: Support for PostgreSQL and In-Memory databases
- **Migration Support**: Automatic schema management
- **LINQ Integration**: Type-safe queries with IntelliSense

**Configuration Example:**
```csharp
// Dynamic database provider selection
if (!string.IsNullOrEmpty(connectionString))
{
    // PostgreSQL for production
    builder.Services.AddDbContext<PaymentContext>(options =>
        options.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);
        }));
}
else
{
    // In-Memory for development/testing
    builder.Services.AddDbContext<PaymentContext>(options =>
        options.UseInMemoryDatabase("PaymentDatabase"));
}
```

#### PostgreSQL 15
**Decision Rationale:**
- **ACID Compliance**: Full transaction support for financial data
- **Performance**: Advanced indexing and query optimization
- **Reliability**: Industry-proven for financial applications
- **Scalability**: Support for read replicas and partitioning

### Frontend Technology Stack

#### React 18
**Decision Rationale:**
- **Modern Features**: Concurrent rendering and automatic batching
- **Developer Experience**: Excellent tooling and debugging capabilities
- **Community**: Large ecosystem and community support
- **Performance**: Virtual DOM and efficient re-rendering

**Architecture Pattern:**
```javascript
// Service layer for API abstraction
export const paymentService = {
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  }
};

// Component-based architecture with hooks
const PaymentList = ({ payments, onConfirmPayment }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConfirm = async (paymentId) => {
    setIsLoading(true);
    try {
      await onConfirmPayment(paymentId);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // Component JSX
  );
};
```

#### Nginx (Production)
**Decision Rationale:**
- **Performance**: High-performance static file serving
- **Security**: SSL termination and security headers
- **Caching**: Efficient static asset caching
- **Proxy**: API request proxying to backend

---

## Design Patterns and Principles

### Clean Architecture Implementation

#### Layer Separation
```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────────────────────────────────────────────┤
│  │              PaymentOrchestrator.Api                │
│  │  • Controllers (PaymentsController)                 │
│  │  • DTOs (CreatePaymentRequest, PaymentResponse)     │
│  │  • Mapping Profiles (AutoMapper)                    │
│  │  • Program.cs (DI Configuration)                    │
│  └─────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────┘
                              │
                              ▼ Depends on
┌─────────────────────────────────────────────────────────┐
│                     Business Layer                      │
│  ┌─────────────────────────────────────────────────────┤
│  │              PaymentOrchestrator.Core               │
│  │  • Domain Entities (Payment)                        │
│  │  • Business Interfaces (IPaymentService)            │
│  │  • Domain Constants (PaymentStatus)                 │
│  │  • Validation Rules                                 │
│  └─────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────┘
                              │
                              ▼ Implements
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                   │
│  ┌─────────────────────────────────────────────────────┤
│  │          PaymentOrchestrator.Infrastructure         │
│  │  • Data Context (PaymentContext)                    │
│  │  • Repositories (PaymentRepository)                 │
│  │  • Services (PaymentService)                        │
│  │  • External Integrations                            │
│  └─────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────┘
```

### Repository Pattern
**Purpose**: Abstract data access logic and provide a consistent interface for data operations.

```csharp
// Interface defines contract (in Core layer)
public interface IPaymentRepository
{
    Task<IEnumerable<Payment>> GetAllPaymentsAsync();
    Task<Payment?> GetPaymentByIdAsync(Guid id);
    Task<Payment> CreatePaymentAsync(Payment payment);
    Task<Payment> UpdatePaymentAsync(Payment payment);
    Task<bool> PaymentExistsAsync(Guid id);
}

// Implementation handles EF Core specifics (in Infrastructure layer)
public class PaymentRepository : IPaymentRepository
{
    private readonly PaymentContext _context;

    public PaymentRepository(PaymentContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
    {
        return await _context.Payments
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
    // ... other implementations
}
```

### Service Layer Pattern
**Purpose**: Encapsulate business logic and coordinate between repositories and external services.

```csharp
public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMapper _mapper;

    public async Task<PaymentResponse> ConfirmPaymentAsync(Guid paymentId)
    {
        var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
        
        if (payment == null)
            throw new KeyNotFoundException($"Payment with ID {paymentId} not found");

        if (payment.Status == PaymentStatus.Confirmed)
            throw new InvalidOperationException("Payment is already confirmed");

        payment.Status = PaymentStatus.Confirmed;
        var updatedPayment = await _paymentRepository.UpdatePaymentAsync(payment);
        
        return _mapper.Map<PaymentResponse>(updatedPayment);
    }
}
```

### Dependency Injection Pattern
**Purpose**: Promote loose coupling and facilitate testing through constructor injection.

```csharp
// Service registration in Program.cs
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Constructor injection in controllers
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }
}
```

### DTO Pattern
**Purpose**: Control data transfer between layers and provide API contract stability.

```csharp
// Request DTO with validation
public class CreatePaymentRequest
{
    [Required(ErrorMessage = "CustomerId is required")]
    public string CustomerId { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Amount is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
}

// Response DTO for API consumers
public class PaymentResponse
{
    public Guid Id { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
```

---

## Data Architecture

### Database Schema Design

#### Payment Entity
```sql
-- PostgreSQL table structure
CREATE TABLE "Payments" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "CustomerId" VARCHAR(100) NOT NULL,
    "Amount" DECIMAL(18,2) NOT NULL CHECK ("Amount" > 0),
    "Status" VARCHAR(20) NOT NULL CHECK ("Status" IN ('Pending', 'Confirmed')),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX "IX_Payments_CustomerId" ON "Payments" ("CustomerId");
CREATE INDEX "IX_Payments_Status" ON "Payments" ("Status");
CREATE INDEX "IX_Payments_CreatedAt" ON "Payments" ("CreatedAt" DESC);

-- Composite index for common queries
CREATE INDEX "IX_Payments_Status_CreatedAt" ON "Payments" ("Status", "CreatedAt" DESC);
```

### Entity Framework Configuration
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Payment>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.CustomerId).IsRequired().HasMaxLength(100);
        entity.Property(e => e.Amount).HasPrecision(18, 2);
        entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
        entity.Property(e => e.CreatedAt).IsRequired();
        
        // Index configuration for performance
        entity.HasIndex(e => e.CustomerId);
        entity.HasIndex(e => e.Status);
    });
}
```

### Data Access Patterns

#### Query Optimization
```csharp
// Efficient payment retrieval with pagination
public async Task<PagedResult<Payment>> GetPaymentsAsync(
    int page, 
    int pageSize, 
    string? status = null)
{
    var query = _context.Payments.AsQueryable();
    
    if (!string.IsNullOrEmpty(status))
        query = query.Where(p => p.Status == status);
    
    var totalCount = await query.CountAsync();
    
    var payments = await query
        .OrderByDescending(p => p.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    
    return new PagedResult<Payment>(payments, totalCount, page, pageSize);
}
```

#### Transaction Management
```csharp
// Transactional payment confirmation
public async Task<PaymentResponse> ConfirmPaymentWithAuditAsync(Guid paymentId)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    
    try
    {
        var payment = await _paymentRepository.GetPaymentByIdAsync(paymentId);
        if (payment == null)
            throw new KeyNotFoundException("Payment not found");
        
        payment.Status = PaymentStatus.Confirmed;
        await _paymentRepository.UpdatePaymentAsync(payment);
        
        // Audit trail
        await _auditRepository.CreateAuditEntryAsync(new AuditEntry
        {
            EntityType = nameof(Payment),
            EntityId = paymentId.ToString(),
            Action = "StatusChanged",
            OldValue = PaymentStatus.Pending,
            NewValue = PaymentStatus.Confirmed,
            Timestamp = DateTime.UtcNow
        });
        
        await transaction.CommitAsync();
        return _mapper.Map<PaymentResponse>(payment);
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

---

## Security Architecture

### Authentication and Authorization

#### JWT Token Implementation (Future Enhancement)
```csharp
// JWT service configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PaymentAdmin", policy =>
        policy.RequireClaim("role", "PaymentAdmin"));
    options.AddPolicy("PaymentUser", policy =>
        policy.RequireClaim("role", "PaymentUser", "PaymentAdmin"));
});
```

#### Controller Security
```csharp
[Authorize(Policy = "PaymentAdmin")]
[HttpPost("simulate-confirmation/{paymentId:guid}")]
public async Task<ActionResult<PaymentResponse>> SimulateConfirmation([FromRoute] Guid paymentId)
{
    // Only payment administrators can confirm payments
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    _logger.LogInformation("Payment confirmation attempted by user {UserId}", userId);
    
    // Implementation...
}
```

### Input Validation and Sanitization

#### Model Validation
```csharp
public class CreatePaymentRequest
{
    [Required(ErrorMessage = "CustomerId is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "CustomerId must be between 3 and 100 characters")]
    [RegularExpression(@"^[A-Z]{4}-\d{5}$", ErrorMessage = "CustomerId must follow pattern: ABCD-12345")]
    public string CustomerId { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Amount is required")]
    [Range(0.01, 1000000, ErrorMessage = "Amount must be between 0.01 and 1,000,000")]
    public decimal Amount { get; set; }
}

// Custom validation attribute
public class PaymentAmountValidationAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is decimal amount)
        {
            // Business rule: Maximum payment amount varies by customer type
            var request = (CreatePaymentRequest)validationContext.ObjectInstance;
            var maxAmount = GetMaxAmountForCustomer(request.CustomerId);
            
            if (amount > maxAmount)
                return new ValidationResult($"Amount exceeds maximum allowed ({maxAmount:C}) for customer");
        }
        
        return ValidationResult.Success;
    }
}
```

### CORS Policy
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Security Headers (Nginx Configuration)
```nginx
# Security headers in nginx.conf
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

---

## Performance and Scalability

### Caching Strategy

#### Memory Caching
```csharp
// Service registration
builder.Services.AddMemoryCache();

// Implementation in service
public class PaymentService : IPaymentService
{
    private readonly IMemoryCache _cache;
    private readonly IPaymentRepository _repository;
    
    public async Task<IEnumerable<PaymentResponse>> GetAllPaymentsAsync()
    {
        const string cacheKey = "all-payments";
        
        if (!_cache.TryGetValue(cacheKey, out IEnumerable<PaymentResponse> payments))
        {
            var paymentsData = await _repository.GetAllPaymentsAsync();
            payments = _mapper.Map<IEnumerable<PaymentResponse>>(paymentsData);
            
            _cache.Set(cacheKey, payments, TimeSpan.FromMinutes(5));
        }
        
        return payments;
    }
}
```

#### Distributed Caching (Redis)
```csharp
// Redis configuration
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "PaymentOrchestrator";
});

// Usage example
public async Task<PaymentResponse?> GetPaymentFromCacheAsync(Guid paymentId)
{
    var cacheKey = $"payment:{paymentId}";
    var cachedPayment = await _distributedCache.GetStringAsync(cacheKey);
    
    if (cachedPayment != null)
    {
        return JsonSerializer.Deserialize<PaymentResponse>(cachedPayment);
    }
    
    return null;
}
```

### Database Optimization

#### Query Performance
```csharp
// Efficient queries with proper indexing
public async Task<IEnumerable<Payment>> GetPaymentsByCustomerAsync(string customerId)
{
    return await _context.Payments
        .Where(p => p.CustomerId == customerId)
        .OrderByDescending(p => p.CreatedAt)
        .Take(100) // Limit results
        .AsNoTracking() // Read-only for better performance
        .ToListAsync();
}

// Bulk operations
public async Task ConfirmMultiplePaymentsAsync(IEnumerable<Guid> paymentIds)
{
    await _context.Payments
        .Where(p => paymentIds.Contains(p.Id) && p.Status == PaymentStatus.Pending)
        .ExecuteUpdateAsync(p => p.SetProperty(x => x.Status, PaymentStatus.Confirmed));
}
```

#### Connection Pooling
```csharp
// PostgreSQL connection pooling configuration
builder.Services.AddDbContext<PaymentContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 5);
        npgsqlOptions.CommandTimeout(30);
    }));

// Connection pool settings in connection string
// "Host=database;Database=payments;Username=postgres;Password=***;Pooling=true;MinPoolSize=5;MaxPoolSize=100"
```

### Horizontal Scaling

#### Stateless Design
```csharp
// Stateless controllers - all state in database or cache
[ApiController]
public class PaymentsController : ControllerBase
{
    // No instance variables storing state
    // All dependencies injected and resolved per request
    
    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }
}
```

#### Load Balancing Configuration
```yaml
# docker-compose.yml scaling
services:
  backend:
    build: ./backend
    scale: 3  # Run 3 instances
    depends_on:
      - database
    environment:
      - INSTANCE_ID=${HOSTNAME}  # Track which instance
```

#### Database Read Replicas
```csharp
// Separate read and write contexts
public class PaymentQueryService : IPaymentQueryService
{
    private readonly PaymentReadOnlyContext _readContext;
    
    public async Task<IEnumerable<PaymentResponse>> GetPaymentsAsync()
    {
        // Read from replica database
        return await _readContext.Payments.ToListAsync();
    }
}

public class PaymentCommandService : IPaymentCommandService
{
    private readonly PaymentContext _writeContext;
    
    public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request)
    {
        // Write to primary database
        var payment = new Payment { /* ... */ };
        await _writeContext.Payments.AddAsync(payment);
        await _writeContext.SaveChangesAsync();
        return _mapper.Map<PaymentResponse>(payment);
    }
}
```

---

## Deployment Architecture

### Containerization Strategy

#### Multi-Stage Docker Build
```dockerfile
# Backend Dockerfile optimization
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore dependencies first (layer caching)
COPY ["PaymentOrchestrator.sln", "./"]
COPY ["src/PaymentOrchestrator.Api/PaymentOrchestrator.Api.csproj", "src/PaymentOrchestrator.Api/"]
COPY ["src/PaymentOrchestrator.Core/PaymentOrchestrator.Core.csproj", "src/PaymentOrchestrator.Core/"]
COPY ["src/PaymentOrchestrator.Infrastructure/PaymentOrchestrator.Infrastructure.csproj", "src/PaymentOrchestrator.Infrastructure/"]
RUN dotnet restore

# Copy source and build
COPY . .
RUN dotnet publish src/PaymentOrchestrator.Api/PaymentOrchestrator.Api.csproj -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser
COPY --from=build /app/publish .
USER appuser
EXPOSE 8080
ENTRYPOINT ["dotnet", "PaymentOrchestrator.Api.dll"]
```

### Kubernetes Deployment

#### Deployment Configuration
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-orchestrator-api
  labels:
    app: payment-orchestrator-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-orchestrator-api
  template:
    metadata:
      labels:
        app: payment-orchestrator-api
    spec:
      containers:
      - name: api
        image: payment-orchestrator-api:latest
        ports:
        - containerPort: 8080
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: db-connection
              key: connection-string
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: payment-orchestrator-api-service
spec:
  selector:
    app: payment-orchestrator-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

#### Horizontal Pod Autoscaler
```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payment-orchestrator-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payment-orchestrator-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Cloud Deployment Options

#### AWS ECS Fargate
```json
{
  "family": "payment-orchestrator-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "payment-orchestrator-api",
      "image": "account.dkr.ecr.region.amazonaws.com/payment-orchestrator:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        }
      ],
      "secrets": [
        {
          "name": "ConnectionStrings__DefaultConnection",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:rds-connection-string"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/payment-orchestrator",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Azure Container Apps
```yaml
# container-app.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: payment-orchestrator-config
data:
  ASPNETCORE_ENVIRONMENT: "Production"
  ASPNETCORE_URLS: "http://+:8080"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-orchestrator
spec:
  replicas: 2
  selector:
    matchLabels:
      app: payment-orchestrator
  template:
    metadata:
      labels:
        app: payment-orchestrator
    spec:
      containers:
      - name: api
        image: paymentorchestrator.azurecr.io/payment-orchestrator-api:latest
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: payment-orchestrator-config
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: database-connection
              key: connection-string
```

---

## Monitoring and Observability

### Logging Strategy

#### Structured Logging with Serilog
```csharp
// Program.cs logging configuration
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "PaymentOrchestrator")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
        .WriteTo.File("logs/payment-orchestrator-.log", rollingInterval: RollingInterval.Day)
        .WriteTo.Seq(context.Configuration.GetConnectionString("Seq"));
});

// Controller logging
[HttpPost]
public async Task<ActionResult<PaymentResponse>> CreatePayment([FromBody] CreatePaymentRequest request)
{
    using var scope = _logger.BeginScope("PaymentCreation {CustomerId} {Amount}", 
        request.CustomerId, request.Amount);
    
    _logger.LogInformation("Creating payment for customer {CustomerId} with amount {Amount:C}", 
        request.CustomerId, request.Amount);
    
    try
    {
        var payment = await _paymentService.CreatePaymentAsync(request);
        
        _logger.LogInformation("Payment {PaymentId} created successfully", payment.Id);
        return CreatedAtAction(nameof(GetAllPayments), new { id = payment.Id }, payment);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to create payment for customer {CustomerId}", request.CustomerId);
        return StatusCode(500, "An error occurred while processing your request");
    }
}
```

### Application Performance Monitoring

#### Custom Metrics
```csharp
// Metrics collection service
public class PaymentMetricsService
{
    private readonly ILogger<PaymentMetricsService> _logger;
    private readonly Counter<long> _paymentCreatedCounter;
    private readonly Counter<long> _paymentConfirmedCounter;
    private readonly Histogram<double> _paymentAmountHistogram;
    private readonly Histogram<double> _requestDurationHistogram;

    public PaymentMetricsService(IMeterFactory meterFactory, ILogger<PaymentMetricsService> logger)
    {
        _logger = logger;
        var meter = meterFactory.Create("PaymentOrchestrator.Payments");
        
        _paymentCreatedCounter = meter.CreateCounter<long>(
            "payments.created.total",
            "The total number of payments created");
            
        _paymentConfirmedCounter = meter.CreateCounter<long>(
            "payments.confirmed.total", 
            "The total number of payments confirmed");
            
        _paymentAmountHistogram = meter.CreateHistogram<double>(
            "payments.amount",
            "The payment amounts processed");
            
        _requestDurationHistogram = meter.CreateHistogram<double>(
            "http.request.duration",
            "The duration of HTTP requests");
    }

    public void RecordPaymentCreated(decimal amount, string customerId)
    {
        _paymentCreatedCounter.Add(1, new KeyValuePair<string, object?>("customer_id", customerId));
        _paymentAmountHistogram.Record((double)amount);
    }

    public void RecordPaymentConfirmed(Guid paymentId)
    {
        _paymentConfirmedCounter.Add(1, new KeyValuePair<string, object?>("payment_id", paymentId.ToString()));
    }
}
```

#### Health Checks
```csharp
// Comprehensive health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<PaymentContext>("database")
    .AddCheck<DatabaseConnectionHealthCheck>("database-connection")
    .AddCheck<ExternalServiceHealthCheck>("external-services")
    .AddCheck("memory", () =>
    {
        var allocated = GC.GetTotalMemory(false);
        var data = new Dictionary<string, object>()
        {
            { "allocated", allocated },
            { "gen0", GC.CollectionCount(0) },
            { "gen1", GC.CollectionCount(1) },
            { "gen2", GC.CollectionCount(2) }
        };
        
        return allocated < 1024 * 1024 * 100 // 100 MB threshold
            ? HealthCheckResult.Healthy("Memory usage is normal", data)
            : HealthCheckResult.Degraded("High memory usage detected", data);
    });

// Custom health check implementations
public class DatabaseConnectionHealthCheck : IHealthCheck
{
    private readonly PaymentContext _context;

    public DatabaseConnectionHealthCheck(PaymentContext context)
    {
        _context = context;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync("SELECT 1", cancellationToken);
            
            var paymentCount = await _context.Payments.CountAsync(cancellationToken);
            var data = new Dictionary<string, object>
            {
                { "payment_count", paymentCount },
                { "database_provider", _context.Database.ProviderName }
            };
            
            return HealthCheckResult.Healthy("Database connection is healthy", data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database connection failed", ex);
        }
    }
}
```

### Distributed Tracing

#### OpenTelemetry Integration
```csharp
// OpenTelemetry configuration
builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddSource("PaymentOrchestrator.Payments")
            .SetSampler(new TraceIdRatioBasedSampler(1.0))
            .AddJaegerExporter();
    })
    .WithMetrics(builder =>
    {
        builder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddPrometheusExporter();
    });

// Custom activity source
public class PaymentService : IPaymentService
{
    private static readonly ActivitySource ActivitySource = new("PaymentOrchestrator.Payments");

    public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request)
    {
        using var activity = ActivitySource.StartActivity("PaymentService.CreatePayment");
        activity?.SetTag("customer.id", request.CustomerId);
        activity?.SetTag("payment.amount", request.Amount);
        
        try
        {
            var payment = new Payment
            {
                CustomerId = request.CustomerId,
                Amount = request.Amount,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            var createdPayment = await _paymentRepository.CreatePaymentAsync(payment);
            
            activity?.SetTag("payment.id", createdPayment.Id);
            activity?.SetStatus(ActivityStatusCode.Ok);
            
            return _mapper.Map<PaymentResponse>(createdPayment);
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            throw;
        }
    }
}
```

---

## Technical Decision Rationale

### Why .NET 8 Over Other Frameworks?

**Performance Considerations:**
- Native AOT compilation reduces startup time by 50-90%
- Improved garbage collection reduces latency spikes
- Better throughput compared to .NET 6 (15-20% improvement)

**Enterprise Features:**
- Long-term support (LTS) until November 2026
- Enhanced security features and vulnerability management
- Excellent tooling and debugging capabilities
- Strong typing system reduces runtime errors

**Ecosystem Benefits:**
- Extensive NuGet package ecosystem
- First-class container support
- Cloud-native features (health checks, metrics, logging)
- Excellent testing frameworks (xUnit, MSTest, NUnit)

### Why PostgreSQL Over SQL Server?

**Cost and Licensing:**
- Open-source with no licensing fees
- Reduced total cost of ownership
- No vendor lock-in concerns

**Technical Capabilities:**
- ACID compliance for financial transactions
- Advanced indexing capabilities (GIN, GIST, BRIN)
- JSON and JSONB support for flexible data models
- Excellent performance with proper tuning

**Operational Benefits:**
- Strong community support and documentation
- Regular updates and security patches
- Docker-friendly with official images
- Horizontal scaling capabilities with read replicas

### Why React Over Angular or Vue?

**Developer Experience:**
- Larger talent pool and easier recruitment
- Excellent developer tools (React DevTools)
- Hot reloading and fast refresh capabilities
- Strong TypeScript integration

**Performance:**
- Virtual DOM provides efficient updates
- Code splitting and lazy loading support
- Server-side rendering capabilities
- Small bundle size with modern build tools

**Ecosystem:**
- Vast component library ecosystem
- Strong testing utilities (React Testing Library)
- Flexible state management options
- Excellent documentation and learning resources

### Why Docker Over Traditional Deployment?

**Consistency:**
- Identical environments across development, testing, and production
- Eliminates "works on my machine" issues
- Simplified dependency management

**Scalability:**
- Easy horizontal scaling with container orchestration
- Resource isolation and efficient utilization
- Fast startup times for auto-scaling scenarios

**Operations:**
- Simplified deployment pipelines
- Easy rollbacks and blue-green deployments
- Consistent monitoring and logging
- Infrastructure as code capabilities

### Why Clean Architecture?

**Maintainability:**
- Clear separation of concerns
- Easier to understand and modify
- Reduced coupling between layers
- Better code organization

**Testability:**
- Easy to unit test business logic
- Dependency injection enables mocking
- Clear interfaces make testing straightforward
- Isolated layers reduce test complexity

**Flexibility:**
- Easy to swap implementations (databases, external services)
- Technology stack changes affect only specific layers
- Business rules remain stable across changes
- Supports multiple interfaces (Web API, gRPC, etc.)

---

## Comprehensive Q&A

### Architecture and Design Questions

**Q: Why did you choose a monolithic approach instead of microservices for this payment system?**

**A:** For a technical assessment and MVP, a monolithic approach provides several advantages:

1. **Simplicity**: Single deployable unit reduces operational complexity
2. **Development Speed**: Faster iteration without distributed system concerns
3. **Resource Efficiency**: Lower resource overhead for a single-domain application
4. **Easy Debugging**: Simplified tracing and debugging across the entire request flow

However, the architecture is designed to be "microservice-ready" with:
- Clear domain boundaries (Payment aggregate)
- Separate data access layer that can be extracted
- Containerized deployment that supports service extraction
- Event-driven patterns that can evolve into messaging

**Migration Path to Microservices:**
```
Current State: PaymentOrchestrator (Monolith)
├── Payment Domain
├── Notification Domain
└── Audit Domain

Future State: Microservices
├── Payment Service (Core BNPL logic)
├── Notification Service (Email/SMS)
├── Audit Service (Compliance/Logging)
└── Customer Service (Customer management)
```

**Q: How does the Clean Architecture implementation provide benefits over a traditional N-tier architecture?**

**A:** Clean Architecture provides several key improvements:

1. **Dependency Inversion**: Business logic doesn't depend on infrastructure concerns
2. **Technology Independence**: Can swap databases or frameworks without changing business rules
3. **Testable**: Business logic can be tested without external dependencies
4. **Framework Independence**: Not tightly coupled to any specific framework

**Comparison:**
```
Traditional N-Tier:
Presentation → Business → Data Access → Database
(Tight coupling, infrastructure concerns bleed up)

Clean Architecture:
Presentation → Application → Domain ← Infrastructure
(Loose coupling, dependencies point inward)
```

**Benefits Demonstrated:**
- Switch between PostgreSQL and In-Memory database without business logic changes
- Easy to add new presentation layers (GraphQL, gRPC) without touching business rules
- Business logic (PaymentService) is framework-agnostic and highly testable

**Q: How would you handle payment state management in a distributed environment?**

**A:** For distributed payment state management, I would implement:

1. **Event Sourcing Pattern:**
```csharp
public class PaymentAggregate
{
    private List<PaymentEvent> _events = new();
    
    public void ConfirmPayment()
    {
        if (Status != PaymentStatus.Pending)
            throw new InvalidOperationException("Payment cannot be confirmed");
            
        ApplyEvent(new PaymentConfirmedEvent(Id, DateTime.UtcNow));
    }
    
    private void ApplyEvent(PaymentEvent @event)
    {
        _events.Add(@event);
        Apply(@event);
    }
}
```

2. **Saga Pattern for Complex Workflows:**
```csharp
public class PaymentConfirmationSaga
{
    public async Task Handle(PaymentCreatedEvent @event)
    {
        // Step 1: Validate customer credit
        await _messageBus.Send(new ValidateCreditCommand(@event.CustomerId));
    }
    
    public async Task Handle(CreditValidatedEvent @event)
    {
        // Step 2: Reserve funds
        await _messageBus.Send(new ReserveFundsCommand(@event.PaymentId));
    }
    
    public async Task Handle(FundsReservedEvent @event)
    {
        // Step 3: Confirm payment
        await _messageBus.Send(new ConfirmPaymentCommand(@event.PaymentId));
    }
}
```

3. **Distributed State Store (Redis/Cosmos DB):**
```csharp
public class DistributedPaymentStateService
{
    private readonly IDistributedCache _cache;
    
    public async Task<PaymentState> GetPaymentStateAsync(Guid paymentId)
    {
        var stateJson = await _cache.GetStringAsync($"payment-state:{paymentId}");
        return JsonSerializer.Deserialize<PaymentState>(stateJson);
    }
    
    public async Task UpdatePaymentStateAsync(Guid paymentId, PaymentState state)
    {
        var stateJson = JsonSerializer.Serialize(state);
        await _cache.SetStringAsync($"payment-state:{paymentId}", stateJson, TimeSpan.FromHours(24));
    }
}
```

### Database and Performance Questions

**Q: How would you optimize database performance for high-volume payment processing?**

**A:** Several optimization strategies would be implemented:

1. **Indexing Strategy:**
```sql
-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_payments_customer_status_created 
ON payments (customer_id, status, created_at DESC);

-- Partial indexes for specific conditions
CREATE INDEX CONCURRENTLY idx_payments_pending 
ON payments (created_at DESC) 
WHERE status = 'Pending';

-- Covering indexes to avoid table lookups
CREATE INDEX CONCURRENTLY idx_payments_status_covering 
ON payments (status, created_at DESC) 
INCLUDE (customer_id, amount);
```

2. **Connection Pooling and Prepared Statements:**
```csharp
// Optimized repository with prepared statements
public class OptimizedPaymentRepository
{
    private readonly NpgsqlConnection _connection;
    
    public async Task<Payment[]> GetPaymentsByCustomerAsync(string customerId)
    {
        const string sql = @"
            SELECT id, customer_id, amount, status, created_at 
            FROM payments 
            WHERE customer_id = $1 
            ORDER BY created_at DESC 
            LIMIT 100";
            
        using var command = new NpgsqlCommand(sql, _connection);
        command.Parameters.AddWithValue(customerId);
        
        // PostgreSQL will cache the execution plan
        return await command.ExecuteReaderAsync().ConfigureAwait(false);
    }
}
```

3. **Read Replicas and Command Query Separation (CQS):**
```csharp
// Separate read and write operations
public class PaymentReadService : IPaymentQueryService
{
    private readonly PaymentReadOnlyContext _readContext;
    
    // All read operations go to read replica
    public async Task<PaymentResponse[]> GetPaymentsAsync(PaymentQuery query)
    {
        return await _readContext.Payments
            .Where(BuildQuery(query))
            .OrderByDescending(p => p.CreatedAt)
            .Take(query.PageSize)
            .ProjectToType<PaymentResponse>()
            .ToArrayAsync();
    }
}

public class PaymentWriteService : IPaymentCommandService
{
    private readonly PaymentContext _writeContext;
    
    // All write operations go to primary database
    public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request)
    {
        var payment = request.Adapt<Payment>();
        await _writeContext.Payments.AddAsync(payment);
        await _writeContext.SaveChangesAsync();
        return payment.Adapt<PaymentResponse>();
    }
}
```

4. **Caching Strategy:**
```csharp
public class CachedPaymentService : IPaymentService
{
    private readonly IPaymentService _baseService;
    private readonly IDistributedCache _cache;
    private readonly IMemoryCache _memoryCache;
    
    public async Task<PaymentResponse[]> GetPaymentsByCustomerAsync(string customerId)
    {
        // L1 Cache: Memory cache for frequent queries
        var memoryCacheKey = $"customer-payments:{customerId}";
        if (_memoryCache.TryGetValue(memoryCacheKey, out PaymentResponse[] cachedPayments))
        {
            return cachedPayments;
        }
        
        // L2 Cache: Distributed cache for shared data
        var distributedCacheKey = $"customer-payments:{customerId}";
        var cachedData = await _cache.GetStringAsync(distributedCacheKey);
        if (cachedData != null)
        {
            var payments = JsonSerializer.Deserialize<PaymentResponse[]>(cachedData);
            _memoryCache.Set(memoryCacheKey, payments, TimeSpan.FromMinutes(5));
            return payments;
        }
        
        // Cache miss: Fetch from database
        var result = await _baseService.GetPaymentsByCustomerAsync(customerId);
        
        // Update both caches
        await _cache.SetStringAsync(distributedCacheKey, JsonSerializer.Serialize(result), TimeSpan.FromMinutes(30));
        _memoryCache.Set(memoryCacheKey, result, TimeSpan.FromMinutes(5));
        
        return result;
    }
}
```

**Q: How would you handle database migrations in a production environment?**

**A:** Production database migration strategy:

1. **Blue-Green Deployment Pattern:**
```bash
# Migration script with rollback capability
#!/bin/bash
MIGRATION_VERSION=$1
ROLLBACK_VERSION=$2

echo "Starting migration to version $MIGRATION_VERSION"

# Create database snapshot
pg_dump paymentorchestrator > backup_pre_migration_$(date +%Y%m%d_%H%M%S).sql

# Apply migration with timeout
timeout 300 dotnet ef database update $MIGRATION_VERSION --project PaymentOrchestrator.Api

if [ $? -eq 0 ]; then
    echo "Migration successful"
    # Update application version
    kubectl set image deployment/payment-orchestrator api=payment-orchestrator:$MIGRATION_VERSION
else
    echo "Migration failed, rolling back"
    dotnet ef database update $ROLLBACK_VERSION --project PaymentOrchestrator.Api
    exit 1
fi
```

2. **Zero-Downtime Migration Strategy:**
```csharp
// Backward-compatible migrations
public partial class AddPaymentProcessorColumn : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Step 1: Add nullable column
        migrationBuilder.AddColumn<string>(
            name: "ProcessorId",
            table: "Payments",
            nullable: true);
            
        // Step 2: Populate existing data
        migrationBuilder.Sql(@"
            UPDATE Payments 
            SET ProcessorId = 'legacy' 
            WHERE ProcessorId IS NULL");
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ProcessorId",
            table: "Payments");
    }
}

// Later migration to make column required
public partial class MakeProcessorIdRequired : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Only after all applications are updated
        migrationBuilder.AlterColumn<string>(
            name: "ProcessorId",
            table: "Payments",
            nullable: false,
            oldNullable: true);
    }
}
```

3. **Migration Validation:**
```csharp
public class MigrationValidationService
{
    public async Task<MigrationValidationResult> ValidateMigrationAsync(string targetMigration)
    {
        var result = new MigrationValidationResult();
        
        // Check migration dependencies
        result.DependenciesValid = await CheckMigrationDependencies(targetMigration);
        
        // Validate data consistency
        result.DataConsistencyValid = await ValidateDataConsistency();
        
        // Check for breaking changes
        result.BreakingChanges = await IdentifyBreakingChanges(targetMigration);
        
        // Estimate migration time
        result.EstimatedDuration = await EstimateMigrationTime(targetMigration);
        
        return result;
    }
}
```

### Security Questions

**Q: How would you implement authentication and authorization for a production payment system?**

**A:** Comprehensive security implementation:

1. **JWT Token Authentication:**
```csharp
// JWT service implementation
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtConfiguration _jwtConfig;
    private readonly ILogger<JwtTokenService> _logger;

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("role", user.Role),
            new Claim("permissions", string.Join(",", user.Permissions)),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtConfig.ExpirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtConfig.SecretKey);
            
            await tokenHandler.ValidateTokenAsync(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtConfig.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtConfig.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            });
            
            return true;
        }
        catch
        {
            return false;
        }
    }
}
```

2. **Role-Based Access Control:**
```csharp
// Custom authorization policies
public static class AuthorizationPolicies
{
    public const string PaymentAdmin = "PaymentAdmin";
    public const string PaymentUser = "PaymentUser";
    public const string PaymentReadOnly = "PaymentReadOnly";
}

// Policy configuration
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationPolicies.PaymentAdmin, policy =>
        policy.RequireClaim("role", "PaymentAdmin"));
        
    options.AddPolicy(AuthorizationPolicies.PaymentUser, policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim("role", "PaymentAdmin") ||
            context.User.HasClaim("role", "PaymentUser")));
            
    options.AddPolicy(AuthorizationPolicies.PaymentReadOnly, policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim("permissions", "payments:read")));
});

// Controller authorization
[Authorize(Policy = AuthorizationPolicies.PaymentAdmin)]
[HttpPost("simulate-confirmation/{paymentId:guid}")]
public async Task<ActionResult<PaymentResponse>> SimulateConfirmation([FromRoute] Guid paymentId)
{
    // Only payment administrators can confirm payments
    var result = await _paymentService.ConfirmPaymentAsync(paymentId);
    
    _logger.LogInformation("Payment {PaymentId} confirmed by user {UserId}", 
        paymentId, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
    return Ok(result);
}
```

3. **API Rate Limiting:**
```csharp
// Rate limiting middleware
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly RateLimitOptions _options;

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        var rateLimitAttribute = endpoint?.Metadata?.GetMetadata<RateLimitAttribute>();
        
        if (rateLimitAttribute != null)
        {
            var clientId = GetClientId(context);
            var key = $"rate_limit:{endpoint.DisplayName}:{clientId}";
            
            if (_cache.TryGetValue(key, out RateLimitCounter counter))
            {
                if (counter.Count >= rateLimitAttribute.MaxRequests)
                {
                    context.Response.StatusCode = 429;
                    await context.Response.WriteAsync("Rate limit exceeded");
                    return;
                }
                counter.Count++;
            }
            else
            {
                _cache.Set(key, new RateLimitCounter { Count = 1 }, rateLimitAttribute.WindowSize);
            }
        }

        await _next(context);
    }
}

// Usage on controllers
[RateLimit(MaxRequests = 10, WindowSize = 60)] // 10 requests per minute
[HttpPost]
public async Task<ActionResult<PaymentResponse>> CreatePayment([FromBody] CreatePaymentRequest request)
{
    // Implementation
}
```

4. **Data Encryption:**
```csharp
// Sensitive data encryption
public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;
    private readonly byte[] _iv;

    public string EncryptSensitiveData(string plaintext)
    {
        if (string.IsNullOrEmpty(plaintext)) return plaintext;

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = _iv;

        using var encryptor = aes.CreateEncryptor();
        using var msEncrypt = new MemoryStream();
        using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
        using (var swEncrypt = new StreamWriter(csEncrypt))
        {
            swEncrypt.Write(plaintext);
        }

        return Convert.ToBase64String(msEncrypt.ToArray());
    }

    public string DecryptSensitiveData(string ciphertext)
    {
        if (string.IsNullOrEmpty(ciphertext)) return ciphertext;

        var buffer = Convert.FromBase64String(ciphertext);

        using var aes = Aes.Create();
        aes.Key = _key;
        aes.IV = _iv;

        using var decryptor = aes.CreateDecryptor();
        using var msDecrypt = new MemoryStream(buffer);
        using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
        using var srDecrypt = new StreamReader(csDecrypt);

        return srDecrypt.ReadToEnd();
    }
}

// Entity configuration for encryption
public class PaymentEntityConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.CustomerId)
            .HasConversion(
                v => _encryptionService.EncryptSensitiveData(v),
                v => _encryptionService.DecryptSensitiveData(v));
    }
}
```

### Scalability and Performance Questions

**Q: How would you handle millions of payments per day?**

**A:** To handle millions of payments per day, I would implement:

1. **Horizontal Scaling with Load Balancing:**
```yaml
# Kubernetes deployment for high availability
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-orchestrator
spec:
  replicas: 10  # Start with 10 replicas
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 2
      maxSurge: 3
  template:
    spec:
      containers:
      - name: api
        image: payment-orchestrator:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        env:
        - name: DATABASE_CONNECTION_POOL_SIZE
          value: "50"
        - name: REDIS_CONNECTION_POOL_SIZE
          value: "100"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payment-orchestrator-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payment-orchestrator
  minReplicas: 5
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

2. **Database Sharding Strategy:**
```csharp
// Database sharding based on customer ID
public class ShardedPaymentRepository : IPaymentRepository
{
    private readonly IShardResolver _shardResolver;
    private readonly Dictionary<string, PaymentContext> _shardContexts;

    public async Task<Payment> CreatePaymentAsync(Payment payment)
    {
        var shardKey = _shardResolver.GetShardKey(payment.CustomerId);
        var context = _shardContexts[shardKey];
        
        context.Payments.Add(payment);
        await context.SaveChangesAsync();
        
        return payment;
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByCustomerAsync(string customerId)
    {
        var shardKey = _shardResolver.GetShardKey(customerId);
        var context = _shardContexts[shardKey];
        
        return await context.Payments
            .Where(p => p.CustomerId == customerId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
}

public class HashBasedShardResolver : IShardResolver
{
    private readonly int _shardCount;

    public HashBasedShardResolver(int shardCount)
    {
        _shardCount = shardCount;
    }

    public string GetShardKey(string customerId)
    {
        var hash = customerId.GetHashCode();
        var shardIndex = Math.Abs(hash) % _shardCount;
        return $"shard_{shardIndex}";
    }
}
```

3. **Asynchronous Processing with Message Queues:**
```csharp
// Event-driven architecture with RabbitMQ/Azure Service Bus
public class PaymentEventService : IPaymentEventService
{
    private readonly IMessagePublisher _messagePublisher;
    private readonly ILogger<PaymentEventService> _logger;

    public async Task PublishPaymentCreatedEventAsync(Payment payment)
    {
        var @event = new PaymentCreatedEvent
        {
            PaymentId = payment.Id,
            CustomerId = payment.CustomerId,
            Amount = payment.Amount,
            CreatedAt = payment.CreatedAt,
            CorrelationId = Guid.NewGuid()
        };

        await _messagePublisher.PublishAsync("payment.created", @event);
        
        _logger.LogInformation("Published PaymentCreated event for payment {PaymentId}", payment.Id);
    }
}

// Background service for processing payment confirmations
public class PaymentConfirmationProcessor : BackgroundService
{
    private readonly IMessageConsumer _messageConsumer;
    private readonly IPaymentService _paymentService;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _messageConsumer.SubscribeAsync<PaymentCreatedEvent>("payment.created", async (@event) =>
        {
            try
            {
                // Simulate external payment processor confirmation
                await Task.Delay(Random.Shared.Next(1000, 5000), stoppingToken);
                
                // Simulate 95% success rate
                if (Random.Shared.NextDouble() > 0.05)
                {
                    await _paymentService.ConfirmPaymentAsync(@event.PaymentId);
                    await _messagePublisher.PublishAsync("payment.confirmed", new PaymentConfirmedEvent
                    {
                        PaymentId = @event.PaymentId,
                        ConfirmedAt = DateTime.UtcNow,
                        CorrelationId = @event.CorrelationId
                    });
                }
                else
                {
                    await _messagePublisher.PublishAsync("payment.failed", new PaymentFailedEvent
                    {
                        PaymentId = @event.PaymentId,
                        Reason = "Payment processor declined",
                        FailedAt = DateTime.UtcNow,
                        CorrelationId = @event.CorrelationId
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment confirmation for {PaymentId}", @event.PaymentId);
                throw; // Will be handled by message queue retry mechanism
            }
        });
    }
}
```

4. **Caching Strategy for High Performance:**
```csharp
// Multi-level caching strategy
public class HighPerformancePaymentService : IPaymentService
{
    private readonly IPaymentService _baseService;
    private readonly IDistributedCache _distributedCache;
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<HighPerformancePaymentService> _logger;

    // Cache frequently accessed data
    public async Task<PaymentResponse[]> GetRecentPaymentsAsync()
    {
        const string cacheKey = "recent_payments";
        
        // L1: Memory cache (fastest, but limited scope)
        if (_memoryCache.TryGetValue(cacheKey, out PaymentResponse[] cachedPayments))
        {
            _logger.LogDebug("Cache hit: Memory cache for recent payments");
            return cachedPayments;
        }

        // L2: Distributed cache (shared across instances)
        var distributedCacheValue = await _distributedCache.GetStringAsync(cacheKey);
        if (distributedCacheValue != null)
        {
            _logger.LogDebug("Cache hit: Distributed cache for recent payments");
            var payments = JsonSerializer.Deserialize<PaymentResponse[]>(distributedCacheValue);
            
            // Warm up memory cache
            _memoryCache.Set(cacheKey, payments, TimeSpan.FromMinutes(2));
            return payments;
        }

        // L3: Database (cache miss)
        _logger.LogDebug("Cache miss: Fetching recent payments from database");
        var result = await _baseService.GetRecentPaymentsAsync();

        // Update both cache levels
        var serializedResult = JsonSerializer.Serialize(result);
        await _distributedCache.SetStringAsync(cacheKey, serializedResult, TimeSpan.FromMinutes(10));
        _memoryCache.Set(cacheKey, result, TimeSpan.FromMinutes(2));

        return result;
    }

    // Cache invalidation strategy
    public async Task<PaymentResponse> ConfirmPaymentAsync(Guid paymentId)
    {
        var result = await _baseService.ConfirmPaymentAsync(paymentId);

        // Invalidate relevant caches
        _memoryCache.Remove("recent_payments");
        _memoryCache.Remove($"customer_payments:{result.CustomerId}");
        await _distributedCache.RemoveAsync("recent_payments");
        await _distributedCache.RemoveAsync($"customer_payments:{result.CustomerId}");

        _logger.LogInformation("Cache invalidated for payment confirmation {PaymentId}", paymentId);
        
        return result;
    }
}
```

5. **Database Connection Pooling and Optimization:**
```csharp
// Optimized database configuration for high throughput
public class DatabaseConfiguration
{
    public static void ConfigureHighThroughputDatabase(IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PaymentContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                // Connection pooling settings
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null);

                // Performance optimizations
                npgsqlOptions.CommandTimeout(30);
                npgsqlOptions.EnableServiceProviderCaching();
                npgsqlOptions.EnableSensitiveDataLogging(false); // Disable in production
            });

            // EF Core performance optimizations
            options.EnableSensitiveDataLogging(false);
            options.EnableServiceProviderCaching();
            options.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.MultipleCollectionIncludeWarning));
        });

        // Configure connection pool in connection string
        // "Host=localhost;Database=payments;Username=postgres;Password=***;Pooling=true;MinPoolSize=10;MaxPoolSize=100;ConnectionIdleLifetime=300"
    }
}

// Bulk operations for high-volume processing
public class BulkPaymentRepository : IPaymentRepository
{
    public async Task<int> CreatePaymentsBatchAsync(IEnumerable<Payment> payments)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        using var writer = connection.BeginBinaryImport(@"
            COPY payments (id, customer_id, amount, status, created_at) 
            FROM STDIN (FORMAT BINARY)");

        foreach (var payment in payments)
        {
            writer.StartRow();
            writer.Write(payment.Id);
            writer.Write(payment.CustomerId);
            writer.Write(payment.Amount);
            writer.Write(payment.Status);
            writer.Write(payment.CreatedAt);
        }

        return (int)writer.Complete();
    }

    public async Task<int> UpdatePaymentStatusBatchAsync(IEnumerable<Guid> paymentIds, string newStatus)
    {
        var paymentIdArray = paymentIds.ToArray();
        
        return await _context.Database.ExecuteSqlRawAsync(@"
            UPDATE payments 
            SET status = {0}, updated_at = NOW() 
            WHERE id = ANY({1})", 
            newStatus, 
            paymentIdArray);
    }
}
```

**Q: How would you monitor and troubleshoot performance issues in production?**

**A:** Comprehensive monitoring and observability strategy:

1. **Application Performance Monitoring (APM):**
```csharp
// Custom metrics collection
public class PaymentMetricsCollector
{
    private readonly IMetrics _metrics;
    private readonly Counter<long> _paymentsProcessed;
    private readonly Histogram<double> _processingDuration;
    private readonly Counter<long> _paymentErrors;

    public PaymentMetricsCollector(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("PaymentOrchestrator");
        
        _paymentsProcessed = meter.CreateCounter<long>(
            "payments_processed_total",
            "Total number of payments processed");
            
        _processingDuration = meter.CreateHistogram<double>(
            "payment_processing_duration_seconds",
            "Duration of payment processing operations");
            
        _paymentErrors = meter.CreateCounter<long>(
            "payment_errors_total",
            "Total number of payment processing errors");
    }

    public void RecordPaymentProcessed(string operation, TimeSpan duration, bool success)
    {
        var tags = new KeyValuePair<string, object?>[]
        {
            new("operation", operation),
            new("success", success.ToString())
        };

        _paymentsProcessed.Add(1, tags);
        _processingDuration.Record(duration.TotalSeconds, tags);
        
        if (!success)
        {
            _paymentErrors.Add(1, tags);
        }
    }
}

// Performance monitoring middleware
public class PerformanceMonitoringMiddleware
{
    private readonly RequestDelegate _next;
    private readonly PaymentMetricsCollector _metrics;
    private readonly ILogger<PerformanceMonitoringMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var success = true;
        
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            success = false;
            _logger.LogError(ex, "Request failed: {Method} {Path}", 
                context.Request.Method, context.Request.Path);
            throw;
        }
        finally
        {
            stopwatch.Stop();
            
            if (context.Response.StatusCode >= 400)
                success = false;

            _metrics.RecordPaymentProcessed(
                $"{context.Request.Method} {context.Request.Path}",
                stopwatch.Elapsed,
                success);

            if (stopwatch.ElapsedMilliseconds > 1000)
            {
                _logger.LogWarning("Slow request detected: {Method} {Path} took {Duration}ms",
                    context.Request.Method, 
                    context.Request.Path, 
                    stopwatch.ElapsedMilliseconds);
            }
        }
    }
}
```

2. **Distributed Tracing with OpenTelemetry:**
```csharp
// Comprehensive tracing setup
public static class TracingConfiguration
{
    public static void ConfigureTracing(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder
                    .AddAspNetCoreInstrumentation(options =>
                    {
                        options.RecordException = true;
                        options.EnrichWithHttpRequest = (activity, request) =>
                        {
                            activity.SetTag("http.request.body.size", request.ContentLength);
                            activity.SetTag("user.id", request.HttpContext.User?.FindFirst("sub")?.Value);
                        };
                        options.EnrichWithHttpResponse = (activity, response) =>
                        {
                            activity.SetTag("http.response.body.size", response.ContentLength);
                        };
                    })
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation(options =>
                    {
                        options.SetDbStatementForStoredProcedure = true;
                        options.SetDbStatementForText = true;
                        options.EnrichWithIDbCommand = (activity, command) =>
                        {
                            var stateDisplayName = $"{command.CommandType} {command.CommandText}";
                            activity.DisplayName = stateDisplayName;
                            activity.SetTag("db.statement", stateDisplayName);
                        };
                    })
                    .AddSource("PaymentOrchestrator.Payments")
                    .AddJaegerExporter(options =>
                    {
                        options.AgentHost = configuration["Jaeger:AgentHost"];
                        options.AgentPort = configuration.GetValue<int>("Jaeger:AgentPort");
                    });
            });
    }
}

// Custom activity source for business operations
public class PaymentTracing
{
    private static readonly ActivitySource ActivitySource = new("PaymentOrchestrator.Payments");

    public static async Task<T> TracePaymentOperation<T>(
        string operationName, 
        Func<Activity?, Task<T>> operation,
        Dictionary<string, object>? tags = null)
    {
        using var activity = ActivitySource.StartActivity(operationName);
        
        if (tags != null)
        {
            foreach (var tag in tags)
            {
                activity?.SetTag(tag.Key, tag.Value);
            }
        }

        try
        {
            var result = await operation(activity);
            activity?.SetStatus(ActivityStatusCode.Ok);
            return result;
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.SetTag("error.type", ex.GetType().Name);
            activity?.SetTag("error.message", ex.Message);
            throw;
        }
    }
}
```

3. **Structured Logging and Log Aggregation:**
```csharp
// Comprehensive logging configuration
public static class LoggingConfiguration
{
    public static void ConfigureLogging(IHostBuilder host)
    {
        host.UseSerilog((context, configuration) =>
        {
            configuration
                .ReadFrom.Configuration(context.Configuration)
                .Enrich.FromLogContext()
                .Enrich.WithProperty("Application", "PaymentOrchestrator")
                .Enrich.WithProperty("Version", Assembly.GetExecutingAssembly().GetName().Version?.ToString())
                .Enrich.WithMachineName()
                .Enrich.WithEnvironmentName()
                .Filter.ByExcluding(logEvent =>
                    logEvent.Properties.ContainsKey("RequestPath") &&
                    logEvent.Properties["RequestPath"].ToString().Contains("/health"))
                .WriteTo.Console(
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
                .WriteTo.File("logs/payment-orchestrator-.log", 
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 30,
                    formatter: new JsonFormatter())
                .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(context.Configuration.GetConnectionString("Elasticsearch")))
                {
                    AutoRegisterTemplate = true,
                    IndexFormat = "payment-orchestrator-logs-{0:yyyy.MM.dd}",
                    TypeName = null // Use default type name
                })
                .WriteTo.ApplicationInsights(
                    context.Configuration["ApplicationInsights:InstrumentationKey"],
                    TelemetryConverter.Traces);
        });
    }
}

// Correlation ID middleware for request tracking
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-ID";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetCorrelationId(context);
        context.Items[CorrelationIdHeader] = correlationId;
        
        // Add to response headers
        context.Response.Headers.Add(CorrelationIdHeader, correlationId);
        
        // Add to logging context
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }

    private string GetCorrelationId(HttpContext context)
    {
        return context.Request.Headers[CorrelationIdHeader].FirstOrDefault() 
               ?? Guid.NewGuid().ToString();
    }
}
```

4. **Database Performance Monitoring:**
```csharp
// Database performance interceptor
public class DatabasePerformanceInterceptor : DbCommandInterceptor
{
    private readonly ILogger<DatabasePerformanceInterceptor> _logger;
    private readonly PaymentMetricsCollector _metrics;

    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        eventData.Context?.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        
        // Log slow queries
        var stopwatch = Stopwatch.StartNew();
        eventData.Context?.Database.SetCommandTimeout(30);
        
        return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
    }

    public override ValueTask<DbDataReader> ReaderExecutedAsync(
        DbCommand command,
        CommandExecutedEventData eventData,
        DbDataReader result,
        CancellationToken cancellationToken = default)
    {
        var duration = eventData.Duration;
        
        if (duration.TotalMilliseconds > 1000)
        {
            _logger.LogWarning("Slow query detected: {Query} took {Duration}ms",
                command.CommandText.Substring(0, Math.Min(200, command.CommandText.Length)),
                duration.TotalMilliseconds);
        }

        _metrics.RecordPaymentProcessed("database_query", duration, true);
        
        return base.ReaderExecutedAsync(command, eventData, result, cancellationToken);
    }
}
```

5. **Health Checks and Circuit Breakers:**
```csharp
// Comprehensive health check system
public class PaymentSystemHealthCheck : IHealthCheck
{
    private readonly PaymentContext _context;
    private readonly IDistributedCache _cache;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<PaymentSystemHealthCheck> _logger;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var healthData = new Dictionary<string, object>();
        var isHealthy = true;
        var errors = new List<string>();

        // Database health
        try
        {
            var dbStartTime = Stopwatch.StartNew();
            await _context.Database.ExecuteSqlRawAsync("SELECT 1", cancellationToken);
            dbStartTime.Stop();
            
            var paymentCount = await _context.Payments.CountAsync(cancellationToken);
            
            healthData["database"] = new
            {
                status = "healthy",
                response_time_ms = dbStartTime.ElapsedMilliseconds,
                payment_count = paymentCount
            };
        }
        catch (Exception ex)
        {
            isHealthy = false;
            errors.Add($"Database: {ex.Message}");
            healthData["database"] = new { status = "unhealthy", error = ex.Message };
        }

        // Cache health
        try
        {
            var cacheKey = $"health_check_{Guid.NewGuid()}";
            await _cache.SetStringAsync(cacheKey, "test", TimeSpan.FromMinutes(1), cancellationToken);
            var cacheValue = await _cache.GetStringAsync(cacheKey, cancellationToken);
            await _cache.RemoveAsync(cacheKey, cancellationToken);
            
            healthData["cache"] = new { status = "healthy" };
        }
        catch (Exception ex)
        {
            errors.Add($"Cache: {ex.Message}");
            healthData["cache"] = new { status = "unhealthy", error = ex.Message };
        }

        // External service health
        try
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(5);
            
            var response = await httpClient.GetAsync("https://api.external-payment-processor.com/health", cancellationToken);
            response.EnsureSuccessStatusCode();
            
            healthData["external_services"] = new { status = "healthy" };
        }
        catch (Exception ex)
        {
            // External services are not critical for basic functionality
            healthData["external_services"] = new { status = "degraded", error = ex.Message };
        }

        // Memory health
        var memoryUsage = GC.GetTotalMemory(false);
        healthData["memory"] = new
        {
            allocated_bytes = memoryUsage,
            allocated_mb = memoryUsage / 1024 / 1024,
            gen0_collections = GC.CollectionCount(0),
            gen1_collections = GC.CollectionCount(1),
            gen2_collections = GC.CollectionCount(2)
        };

        return isHealthy
            ? HealthCheckResult.Healthy("All systems operational", healthData)
            : HealthCheckResult.Unhealthy($"Issues detected: {string.Join(", ", errors)}", data: healthData);
    }
}
```

---

## Future Considerations

### Microservices Evolution

As the system grows, the monolithic approach can evolve into microservices:

1. **Payment Service**: Core payment processing logic
2. **Customer Service**: Customer management and validation
3. **Notification Service**: Email, SMS, and push notifications
4. **Audit Service**: Compliance and logging
5. **Reporting Service**: Analytics and business intelligence
6. **Gateway Service**: API gateway with authentication

### Event-Driven Architecture

```csharp
// Domain events for eventual consistency
public abstract class DomainEvent
{
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
    public Guid EventId { get; } = Guid.NewGuid();
}

public class PaymentCreatedEvent : DomainEvent
{
    public Guid PaymentId { get; set; }
    public string CustomerId { get; set; }
    public decimal Amount { get; set; }
}

public class PaymentConfirmedEvent : DomainEvent
{
    public Guid PaymentId { get; set; }
    public DateTime ConfirmedAt { get; set; }
}

// Event sourcing implementation
public class PaymentAggregate : AggregateRoot
{
    public Guid Id { get; private set; }
    public string CustomerId { get; private set; }
    public decimal Amount { get; private set; }
    public PaymentStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public static PaymentAggregate Create(string customerId, decimal amount)
    {
        var payment = new PaymentAggregate();
        payment.RaiseEvent(new PaymentCreatedEvent
        {
            PaymentId = Guid.NewGuid(),
            CustomerId = customerId,
            Amount = amount
        });
        return payment;
    }

    public void Confirm()
    {
        if (Status != PaymentStatus.Pending)
            throw new InvalidOperationException("Only pending payments can be confirmed");

        RaiseEvent(new PaymentConfirmedEvent
        {
            PaymentId = Id,
            ConfirmedAt = DateTime.UtcNow
        });
    }

    protected void Apply(PaymentCreatedEvent @event)
    {
        Id = @event.PaymentId;
        CustomerId = @event.CustomerId;
        Amount = @event.Amount;
        Status = PaymentStatus.Pending;
        CreatedAt = @event.OccurredAt;
    }

    protected void Apply(PaymentConfirmedEvent @event)
    {
        Status = PaymentStatus.Confirmed;
    }
}
```

### Advanced Security Considerations

1. **Zero Trust Architecture**
2. **Multi-factor Authentication**
3. **Encryption at Rest and in Transit**
4. **Regular Security Audits and Penetration Testing**
5. **Compliance with PCI DSS for payment processing**

### Observability and Monitoring Evolution

1. **Business Metrics Dashboard**
2. **Real-time Alerting System**
3. **Predictive Analytics for Fraud Detection**
4. **Cost Optimization Monitoring**
5. **Customer Experience Monitoring**

---

This comprehensive architecture document demonstrates enterprise-level thinking about system design, scalability, security, and operational concerns while maintaining practical implementation approaches. The solution showcases modern architectural patterns and provides clear pathways for future evolution and scaling.