"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface Commitment {
  id: number;
  investorId: number;
  assetClass: string;
  amount: number;
}

interface APIResponse {
  totalCommitmentAmount: number;
  totalCommitmentAmountForAsset?: number;
  commitments: Commitment[];
}

export default function CommitmentsPage() {
  const router = useRouter();
  const { investorId } = useParams();
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [totalCommitment, setTotalCommitment] = useState<number>(0);
  const [totalCommitmentForAsset, setTotalCommitmentForAsset] = useState<number>(0);
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (investorId) {
      fetchCommitments(selectedAssetClass);
    }
  }, [investorId, selectedAssetClass]);

  const fetchCommitments = async (assetClass: string = "all") => {
    if (!investorId) return;

    const url =
      assetClass === "all"
        ? `http://localhost:5131/api/commitments/${investorId}/all`
        : `http://localhost:5131/api/commitments/${investorId}/${assetClass}`;

    try {
      setLoading(true);
      const response = await axios.get<APIResponse>(url);
      
      setCommitments(response.data.commitments || []);
      setTotalCommitment(response.data.totalCommitmentAmount || 0);
      
      setTotalCommitmentForAsset(response.data.totalCommitmentAmountForAsset || 0);

      setError(null);
    } catch (err) {
      setError("Failed to fetch commitments.");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        ← Back to Investors
      </button>

      <h1 className="text-2xl font-bold mb-4">Commitment Breakdown</h1>

    {/* Total Commitments Display or Commitments per Asset */}
    {selectedAssetClass === "all" ? (
    <p className="text-lg font-semibold text-gray-700">
        <span className="text-blue-600">Total Commitment:</span> £
        {totalCommitment.toLocaleString()}
    </p>
    ) : (
    <p className="text-lg font-semibold text-gray-700">
        <span className="text-blue-600">Total Commitment for {selectedAssetClass}:</span> £
        {totalCommitmentForAsset.toLocaleString()}
    </p>
    )}

      {/* Asset Class Dropdown*/}
      <label className="block mt-4 mb-2 font-semibold">Filter by Asset Class:</label>
      <select
        value={selectedAssetClass}
        onChange={(e) => {
          const newAssetClass = e.target.value;
          setSelectedAssetClass(newAssetClass);
          fetchCommitments(newAssetClass);
        }}
        className="p-2 border rounded"
      >
        <option value="all">All</option>
        <option value="Hedge Funds">Hedge Funds</option>
        <option value="Private Equity">Private Equity</option>
        <option value="Real Estate">Real Estate</option>
        <option value="Infrastructure">Infrastructure</option>
        <option value="Natural Resources">Natural Resources</option>
        <option value="Private Debt">Private Debt</option>
      </select>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {!loading && !error && commitments.length > 0 ? (
        <table className="w-full bg-white shadow-md rounded-lg mt-4">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Commitment ID</th>
              {selectedAssetClass === "all" && <th className="p-3 text-left">Asset Class</th>}
              <th className="p-3 text-left">Amount (£)</th>
            </tr>
          </thead>
          <tbody>
            {commitments.map((commitment) => (
              <tr key={commitment.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{commitment.id}</td>
                {selectedAssetClass === "all" && <td className="p-3">{commitment.assetClass}</td>}
                <td className="p-3 font-bold">{commitment.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && <p className="text-gray-500 mt-4">No commitments found.</p>
      )}
    </div>
  );
}
