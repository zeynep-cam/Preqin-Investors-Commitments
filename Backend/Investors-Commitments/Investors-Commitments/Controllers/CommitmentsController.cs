using Microsoft.AspNetCore.Mvc;

namespace Investors_Commitments.Controllers;

[ApiController]
[Route("api/commitments")]
public class CommitmentsController : ControllerBase
{
    [HttpGet("all")]
    public IActionResult GetAllCommitmentsForAllInvestors()
    {
        var allCommitments = CSVParser.ParseCSV()
            .SelectMany(i => i.Commitments)
            .ToList();
        return Ok(allCommitments);
    }

    [HttpGet("{investorId}/all")]
    public IActionResult GetAllCommitmentsForInvestor(int investorId)
    {
        var investors = CSVParser.ParseCSV();
        if (investors == null || investors.Count == 0)
        {
            return NotFound("No investors found");
        }
        
        var investor = investors.FirstOrDefault(i => i.Id == investorId);
        var totalCommitment = investor.Commitments.Sum(c => c.Amount);
        
        return Ok(new
        {
            TotalCommitmentAmount = totalCommitment,
            investor.Commitments
        });
    }

    [HttpGet("{investorId}/{assetClass}")]
    public IActionResult GetAllCommitmentsByAssetClassPerInvestor(int investorId, string assetClass)
    {
        var investors = CSVParser.ParseCSV();
        
        if (investors == null || investors.Count == 0)
        {
            return NotFound("No investors found.");
        }
        
        var investor = investors.FirstOrDefault(i => i.Id == investorId);
        
        var filteredCommitments = investor.Commitments
            .Where(c => c.AssetClass.Equals(assetClass, StringComparison.OrdinalIgnoreCase))
            .ToList();
        decimal totalAmountForAsset = filteredCommitments.Sum(c => c.Amount);

        return Ok(new 
        {
            TotalCommitmentAmountForAsset = totalAmountForAsset,
            Commitments = filteredCommitments
        });
    }
    
}