# Connecting to wallets

## Add Providers

To use `@mysten/dapp-kit` you will need to set a couple of Provider components
at the root of your component tree.

We can start by opening `main.tsx` add adding a new `Providers` component:

```tsx
import "@mysten/dapp-kit/dist/index.css";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
```

This adds 3 providers from the dependencies we installed in the previous step.

- `QueryClientProvider` will provide the client used by dapp-kit for making
  requests to RPC nodes and wallets.
- `SuiClientProvider` will provide the `SuiClient` that `dapp-kit` uses, and
  manages the network/RPC node that you are connecting to.
- `WalletProvider` manages your connection to the users wallet when they sign in
  to your app.

Next we want to use our new Providers component. We can do this by updating what
we render in our `ReactDOM.createRoot` call:

```diff
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
-    <App />
+    <Providers>
+      <App />
+    </Providers>
  </React.StrictMode>
);
```

## Connecting to a wallet

Next we'll want to add a button to our App to connect a users wallet, so they
can interact with the dApp we are building.

Start by replacing the content of App.tsx:

```tsx
import "./App.css";
import { ConnectButton } from "@mysten/dapp-kit";

function App() {
  return (
    <>
      <h1>Dapp Kit Workshop</h1>
      <div className="card">
        <ConnectButton />
      </div>
    </>
  );
}

export default App;
```

You're dApp can now connect to wallets, and you are ready to start interacting
with the Sui network
