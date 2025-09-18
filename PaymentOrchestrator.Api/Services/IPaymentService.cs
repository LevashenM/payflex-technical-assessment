using PaymentOrchestrator.Api.Models;

namespace PaymentOrchestrator.Api.Services;

public interface IPaymentService
{
    Task<IEnumerable<Payment>> GetAllPaymentsAsync();
    Task<Payment> CreatePaymentAsync(CreatePaymentRequest request);
    Task<Payment> ConfirmPaymentAsync(Guid paymentId);
}