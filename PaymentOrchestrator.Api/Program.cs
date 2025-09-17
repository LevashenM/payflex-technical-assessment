using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddDbContext<PaymentContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=payments.db"));

builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddControllers();
builder.Services.AddHealthChecks()
    .AddDbContextCheck<PaymentContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                new Uri(origin).Host == "localhost" ||
                new Uri(origin).Host == "127.0.0.1")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PaymentContext>();
    context.Database.EnsureCreated();
}

app.Run();

public class Payment
{
    public Guid Id { get; set; }
    public string CustomerId { get; set; } = "";
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
}

public class CreatePaymentRequest
{
    public string CustomerId { get; set; } = "";
    public decimal Amount { get; set; }
}

public class PaymentContext : DbContext
{
    public PaymentContext(DbContextOptions<PaymentContext> options) : base(options) { }
    public DbSet<Payment> Payments { get; set; }
}

public interface IPaymentService
{
    Task<IEnumerable<Payment>> GetAllPaymentsAsync();
    Task<Payment> CreatePaymentAsync(CreatePaymentRequest request);
    Task<Payment> ConfirmPaymentAsync(Guid paymentId);
}

public class PaymentService : IPaymentService
{
    private readonly PaymentContext _context;

    public PaymentService(PaymentContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
    {
        return await _context.Payments.OrderByDescending(p => p.CreatedAt).ToListAsync();
    }

    public async Task<Payment> CreatePaymentAsync(CreatePaymentRequest request)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            Amount = request.Amount,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<Payment> ConfirmPaymentAsync(Guid paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null)
            throw new KeyNotFoundException("Payment not found");

        if (payment.Status != "Pending")
            throw new InvalidOperationException("Payment is not in pending status");

        payment.Status = "Confirmed";
        await _context.SaveChangesAsync();
        return payment;
    }
}