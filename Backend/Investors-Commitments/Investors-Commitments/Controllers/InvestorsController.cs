using Microsoft.AspNetCore.Mvc;

namespace Investors_Commitments.Controllers;

[ApiController]
[Route("api/investors")]
public class InvestorsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetInvestors()
    {
        var investors = CSVParser.ParseCSV()
            .Select(i => new
            {
                i.Id,
                i.Name,
                i.Type,
                i.DateAdded,
                i.Address,
                TotalCommitmentAmount = i.Commitments.Sum(c => c.Amount)
            })
            .ToList();
        return Ok(investors);
    }
}