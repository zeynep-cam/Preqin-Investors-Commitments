using CsvHelper.Configuration;
using Investors_Commitments.Models;

namespace Investors_Commitments;

public class CommitmentMap : ClassMap<Commitment>
{
    public CommitmentMap()
    {
        Map(m => m.InvestorName).Name("Investor Name");
        Map(m => m.AssetClass).Name("Commitment Asset Class");
        Map(m => m.Currency).Name("Commitment Currency");
        Map(m => m.Amount).Name("Commitment Amount");
    }
}