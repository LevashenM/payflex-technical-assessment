namespace PaymentOrchestrator.Api.Models;

public class CreatePaymentRequest
{
    public string CustomerId { get; set; } = "";
    public decimal Amount { get; set; }
}