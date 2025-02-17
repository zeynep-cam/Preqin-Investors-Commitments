"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Investor {
  id: number;
  name: string;
  type: string;
  dateAdded: string;
  address: string;
  totalCommitmentAmount: number;
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5131/api/investors")
      .then((response) => setInvestors(response.data))
      .catch(() => setError("Failed to fetch investors."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>

      {loading && <p>Loading investors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Investor Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Date Added</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Total Commitment (£)</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr key={investor.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{investor.name}</td>
                <td className="p-3">{investor.type}</td>
                <td className="p-3">{new Date(investor.dateAdded).toLocaleDateString()}</td>
                <td className="p-3">{investor.address}</td>
                <td className="p-3 font-bold">
                  {investor.totalCommitmentAmount}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => router.push(`/commitments/${investor.id}`)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                  >
                    See Breakdown
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
