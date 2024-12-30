"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

// Custom styles to match your app's theme
const buttonStyles = {
  background: "#4c1d95",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  fontSize: "16px",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s",
};

export default function CoinbaseButton() {
  // Set up Solana connection endpoint (using devnet for development)
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  
  // Initialize empty wallet array - you can add specific wallet adapters here
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={buttonStyles}>
            <WalletMultiButton />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
