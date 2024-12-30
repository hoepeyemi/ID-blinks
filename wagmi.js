import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { mantleSepoliaTestnet } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { metaMask } from "wagmi/connectors";
export const config = createConfig({
  chains: [mantleSepoliaTestnet],
  // chains: [base],
  connectors: [coinbaseWallet(), metaMask()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    // [base.id]: http(),
    [mantleSepoliaTestnet.id]: http(),
  },
});


