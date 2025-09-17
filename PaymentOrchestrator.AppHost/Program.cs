// Set required environment variables before creating builder
Environment.SetEnvironmentVariable("ASPNETCORE_URLS", "https://localhost:15888;http://localhost:15889");
Environment.SetEnvironmentVariable("DOTNET_DASHBOARD_OTLP_ENDPOINT_URL", "https://localhost:16686");
Environment.SetEnvironmentVariable("ASPIRE_ALLOW_UNSECURED_TRANSPORT", "true");

var builder = DistributedApplication.CreateBuilder(args);

// Add the API service
var api = builder.AddProject<Projects.PaymentOrchestrator_Api>("api")
    .WithExternalHttpEndpoints();

// Add the React frontend
var frontend = builder.AddNpmApp("frontend", "../frontend", "start")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none") // Don't auto-open browser
    .WithEnvironment("REACT_APP_API_URL", api.GetEndpoint("http"))
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

var app = builder.Build();
await app.RunAsync();