using Microsoft.AspNetCore.Mvc;
using PaymentOrchestrator.Api.Models;
using PaymentOrchestrator.Api.Services;

namespace PaymentOrchestrator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
    {
        try
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Payment>> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            if (request.Amount <= 0)
            {
                return BadRequest("Amount must be greater than 0");
            }

            if (string.IsNullOrWhiteSpace(request.CustomerId))
            {
                return BadRequest("CustomerId is required");
            }

            var payment = await _paymentService.CreatePaymentAsync(request);
            return CreatedAtAction(nameof(GetPayments), new { id = payment.Id }, payment);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("simulate-confirmation/{paymentId}")]
    public async Task<ActionResult<Payment>> ConfirmPayment(Guid paymentId)
    {
        try
        {
            var payment = await _paymentService.ConfirmPaymentAsync(paymentId);
            return Ok(payment);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Payment with ID {paymentId} not found");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}