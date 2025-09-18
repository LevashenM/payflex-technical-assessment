using Microsoft.EntityFrameworkCore;
using PaymentOrchestrator.Api.Models;

namespace PaymentOrchestrator.Api.Data;

public class PaymentContext : DbContext
{
    public PaymentContext(DbContextOptions<PaymentContext> options) : base(options) { }
    public DbSet<Payment> Payments { get; set; }
}