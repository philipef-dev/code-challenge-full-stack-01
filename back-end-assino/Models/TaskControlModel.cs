public class TaskControlModel
{
    public TaskControlModel(string title, int sla, IFormFile? file)
    {
        Id = Guid.NewGuid();
        Title = title;
        SLA = sla;
        CreatedAt = DateTime.UtcNow;
        ExpirationTime = CreatedAt.AddHours(sla);
        IsCompleted = false;

        if (file != null)
        {
            FilePath = SaveFile(file).Result; 
        }
    }

    public Guid Id { get; init; }
    public string Title { get; private set; } = string.Empty;
    public int SLA { get; private set; }
    public bool IsCompleted { get; private set; }
    public string? FilePath { get; private set; } 
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpirationTime { get; private set; }

    public void MarkAsCompleted() => IsCompleted = true;

    public bool IsSLAPassed()
    {
        return !IsCompleted && DateTime.UtcNow > ExpirationTime;
    }

    private async Task<string> SaveFile(IFormFile file)
    {
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, $"{Guid.NewGuid()}_{file.FileName}");

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return filePath;
    }
}
