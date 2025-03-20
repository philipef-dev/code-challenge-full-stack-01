public static class TaskControlRoute
{
    private static readonly List<TaskControlModel> tasks = new();

    public static void TaskControlRoutes(this WebApplication app)
    {

        app.MapPost("/tasks", async (HttpContext context) =>
        {
            var form = await context.Request.ReadFormAsync();

            if (!form.ContainsKey("title") || !form.ContainsKey("sla"))
            {
                return Results.BadRequest("Missing required fields: title or sla.");
            }

            string title = form["title"].ToString();
            if (string.IsNullOrWhiteSpace(title))
            {
                return Results.BadRequest("Title is required.");
            }

            if (!int.TryParse(form["sla"], out int sla))
            {
                return Results.BadRequest("Invalid SLA format.");
            }

            // Obtendo o arquivo corretamente
            IFormFile? file = form.Files.GetFile("file");

            var task = new TaskControlModel(title, sla, file);

            // Verifique se a lista "tasks" está declarada e inicializada
            tasks.Add(task);

            return Results.Created($"/tasks/{task.Id}", task);
        })
        .Produces<TaskControlModel>(StatusCodes.Status201Created)
        .Produces<string>(StatusCodes.Status400BadRequest)
        .Accepts<IFormCollection>("multipart/form-data")
        .WithOpenApi();

        app.MapGet("/tasks", () => Results.Ok(tasks));

        app.MapGet("/tasks/completed", () => Results.Ok(tasks.Where(t => t.IsCompleted)));

        app.MapPut("/tasks/{id}/complete", (Guid id) =>
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task is null) return Results.NotFound();

            task.MarkAsCompleted();
            return Results.NoContent();
        });
    }
}
