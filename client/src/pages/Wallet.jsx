import { useEffect, useState } from "react";

export default function Wallet() {
  const [amount, setAmount] = useState(null);
  const [addValue, setAddValue] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch wallet balance from the database
    const fetchWallet = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/wallet/me/wallet", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          setMessage(data.message || "Failed to fetch wallet");
          setAmount(null);
          return;
        }
        const data = await res.json();
        setAmount(data.wallet);
      } catch (err) {
        setMessage("Network error");
        setAmount(null);
      }
    };
    fetchWallet();
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:5000/api/wallet/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(addValue) }),
    });
    const data = await res.json();
    if (res.ok) {
      setAmount(data.amount);
      setAddValue("");
      setMessage("Money added!");
    } else {
      setMessage(data.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Wallet</h2>
      <div className="mb-4 text-lg">
        Current Balance:{" "}
        <span className="font-bold">
          {amount !== null ? `${amount} €` : "—"}
        </span>
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="number"
          min="1"
          value={addValue}
          onChange={(e) => setAddValue(e.target.value)}
          className="border rounded p-2 flex-1"
          placeholder="Amount to add"
          required
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          type="submit"
        >
          Add Money
        </button>
      </form>
      {message && <div className="mt-2 text-red-700">{message}</div>}
    </div>
  );
}
