import { useEffect, useState } from "react";

export default function Wallet() {
  const [amount, setAmount] = useState(0);
  const [addValue, setAddValue] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch wallet balance
    fetch("/api/wallet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAmount(data.amount || 0));
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/wallet/add", {
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
        Current Balance: <span className="font-bold">{amount} €</span>
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
      {message && <div className="mt-2 text-green-700">{message}</div>}
    </div>
  );
}
