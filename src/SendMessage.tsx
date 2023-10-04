import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MESSAGES_PACKAGE_ID } from "./constants";

export function SendMessage({ onMessageSent }: { onMessageSent: () => void }) {
  const suiClient = useSuiClient();
  const account = useCurrentAccount()!;
  const [message, setMessage] = useState("hello world!");
  const [recipient, setRecipient] = useState(account.address);
  const [sending, setSending] = useState(false);

  const { mutateAsync: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransactionBlock();

  function sendMessage() {
    setSending(true);

    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${MESSAGES_PACKAGE_ID}::messages::sendMessage`,
      arguments: [txb.pure.address(recipient), txb.pure.string(message)],
    });

    signAndExecuteTransactionBlock({
      transactionBlock: txb,
      chain: "sui:testnet",
    })
      .then(async (result) => {
        await suiClient.waitForTransactionBlock({
          digest: result.digest,
        });

        await onMessageSent();
        // Reset the message form
        setMessage("");
        setSending(false);
      })
      .catch((err) => {
        setSending(false);
        console.error(err);
      });
  }

  return (
    <div style={{ margin: 30 }}>
      <label style={{ display: "flex", justifyContent: "end" }}>
        <span style={{ flex: 1 }}>Message:</span>
        <input
          style={{ flex: 2 }}
          type="text"
          placeholder="Message"
          value={message}
          onChange={(ev) => {
            setMessage(ev.target.value);
          }}
        />
      </label>
      <label style={{ display: "flex", justifyContent: "end" }}>
        <span style={{ flex: 1 }}>Recipient:</span>
        <input
          style={{ flex: 2 }}
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(ev) => {
            setRecipient(ev.target.value);
          }}
        />
      </label>
      <div style={{ display: "flex", justifyContent: "end", marginTop: 10 }}>
        <button
          disabled={!message || !recipient || sending}
          onClick={() => {
            sendMessage();
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
