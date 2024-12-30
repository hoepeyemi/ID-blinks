"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import CoinbaseButton from "@/app/Components/CoinbaseButton";
import SendSolForm from "@/app/Components/SendSolForm";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) {
        return;
      }

      try {
        // Subscribe to account changes
        const subscriptionId = connection.onAccountChange(
          publicKey,
          (updatedAccountInfo) => {
            setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
          },
          "confirmed"
        );

        // Get initial account info
        const accountInfo = await connection.getAccountInfo(publicKey);
        if (accountInfo) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
        }

        // Redirect to details page when wallet is connected
        if (publicKey) {
          router.push("/details");
        }

        // Cleanup subscription on unmount
        return () => {
          connection.removeAccountChangeListener(subscriptionId);
        };
      } catch (error) {
        console.error("Failed to retrieve account info:", error);
      }
    };

    updateBalance();
  }, [connection, publicKey, router]);

  return (
    <div>
      <div className="mx-auto w-[90%] py-16 flex flex-col-reverse lg:flex-row gap-10">
        <div className="flex-1">
          <h2 className="text-5xl font-semibold mb-3">
            Seamless Institution Experience: Identity, Payments, and Access - All in
            One Software.
          </h2>
          <h6 className="text-xl font-medium mb-5">
            Your key to effortless shopping, secure identity verification, and
            hassle-free activities.
          </h6>
          {publicKey && (
            <>
              <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
                <p className="text-white">
                  Wallet: {publicKey.toString().slice(0, 4)}...
                  {publicKey.toString().slice(-4)}
                </p>
                <p className="text-white">Balance: {balance.toFixed(4)} SOL</p>
              </div>
              <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
                <h3 className="text-white text-lg font-medium mb-4">Send SOL</h3>
                <SendSolForm />
              </div>
            </>
          )}
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default Hero;
