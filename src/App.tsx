import "./App.css";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Messages } from "./Messages";

function App() {
  const account = useCurrentAccount();
  return (
    <>
      <h1>Dapp Kit Workshop</h1>
      <div className="card">
        <ConnectButton />
        {account && <Messages />}
      </div>
    </>
  );
}

export default App;
