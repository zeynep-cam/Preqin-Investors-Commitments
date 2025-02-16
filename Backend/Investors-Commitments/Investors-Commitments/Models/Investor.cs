namespace Investors_Commitments.Models;

public class Investor
{
    public int Id { get; set; }
    
    public string Name { get; set; } = null!;
    
    public string Type { get; set; } = null!;
    
    public string Address { get; set; } = null!;
    
    public DateOnly DateAdded { get; set; }
    
    public DateOnly LastUpdated { get; set; }
    
    public List<Commitment> Commitments { get; set; } = new List<Commitment>();
}