using CsvHelper;
using System.Globalization;
using Investors_Commitments.Models;

namespace Investors_Commitments;

public class CSVParser
{
    private static string _filepath = "./CSVData/data.csv";

    public static List<Investor> ParseCSV()
    {
        using var streamReader = new StreamReader(_filepath);
        using var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture);
        
        csvReader.Read();
        csvReader.ReadHeader();
        
        csvReader.Context.RegisterClassMap<InvestorMap>();

        var investorRecords = csvReader.GetRecords<Investor>();
        
        var investors = new Dictionary<string, Investor>();

        foreach (var investor in investorRecords)
        {
            if (!investors.ContainsKey(investor.Name))
            {
                investor.Id = Math.Abs(investor.Name.GetHashCode());
                investor.Commitments = new List<Commitment>();
                investors[investor.Name] = investor;
            }
        }
        
        //Required to reset and re-read the CSV 
        streamReader.BaseStream.Seek(0, SeekOrigin.Begin);
        streamReader.DiscardBufferedData();
        csvReader.Read();
        csvReader.ReadHeader();
        
        csvReader.Context.RegisterClassMap<CommitmentMap>();
        var commitmentRecords = csvReader.GetRecords<Commitment>().ToList();

        foreach (var commitment in commitmentRecords)
        {
            if (investors.TryGetValue(commitment.InvestorName, out var investor))
            {
                commitment.Id = Math.Abs(Guid.NewGuid().GetHashCode() % int.MaxValue);
                commitment.InvestorId = investor.Id;
                investor.Commitments.Add(commitment);
            }
        }
        
        return investors.Values.ToList();
    }
}