using System.ComponentModel.DataAnnotations.Schema;

namespace Investors_Commitments.Models;

public class Commitment
{
    public int Id { get; set; }
    
    [ForeignKey("InvestorId")]
    public int InvestorId { get; set; }

    public Investor Investor { get; set; } = null!;
    
    public string InvestorName { get; set; } = null!;
    
    public string AssetClass { get; set; } = null!;
    
    public string Currency { get; set; } = null!;
  
    public decimal Amount { get; set; }
}