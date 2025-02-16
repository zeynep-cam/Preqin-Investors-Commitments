using CsvHelper.Configuration;
using Investors_Commitments.Models;

namespace Investors_Commitments;

public class InvestorMap : ClassMap<Investor>
{
    public InvestorMap()
    {
        Map(m => m.Name).Name("Investor Name");
        Map(m => m.Type).Name("Investory Type");
        Map(m => m.Address).Name("Investor Country");
        Map(m => m.DateAdded).Name("Investor Date Added");
        Map(m => m.LastUpdated).Name("Investor Last Updated");
    }
}