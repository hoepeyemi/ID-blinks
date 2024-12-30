"use client";

import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SendSolForm({ onClose }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendSol = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    if (!publicKey) {
      setStatus("Error: Wallet not connected");
      setLoading(false);
      return;
    }

    try {
      const recipientPubKey = new PublicKey(event.target.recipient.value);
      const amount = parseFloat(event.target.amount.value);

      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      
      setStatus(`Success! Transaction signature: ${signature}`);
      event.target.reset();
      
      // Close modal after successful transaction
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Transaction failed", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-medium">Send SOL</h3>
        <button 
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={sendSol} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            name="recipient"
            required
            className="w-full p-2 rounded-md bg-purple-900/20 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Solana address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Amount (SOL)
          </label>
          <input
            type="number"
            name="amount"
            step="0.000000001"
            required
            className="w-full p-2 rounded-md bg-purple-900/20 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0.0"
          />
        </div>

        <button
          type="submit"
          disabled={!publicKey || loading}
          className={`w-full p-2 rounded-md text-white font-medium ${
            !publicKey || loading
              ? "bg-purple-900/50 cursor-not-allowed"
              : "bg-purple-900 hover:bg-purple-800"
          }`}
        >
          {loading ? "Processing..." : "Send SOL"}
        </button>

        {status && (
          <div className={`mt-2 p-2 rounded-md ${status.includes("Error") ? "bg-red-500/20" : "bg-green-500/20"}`}>
            <p className="text-sm text-white">{status}</p>
          </div>
        )}
      </form>
    </div>
  );
} 