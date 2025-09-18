using Microsoft.EntityFrameworkCore;
using PaymentOrchestrator.Api.Data;
using PaymentOrchestrator.Api.Models;

namespace PaymentOrchestrator.Api.Services;

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