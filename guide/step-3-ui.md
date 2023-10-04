# Adding UI for interacting with your move package

## Load messages

Let's start by creating a new component to that loads any messages owned by the
current account. These will be the messages sent to the address selected when a
user hit's the `Connect Wallet` button.

We can create a new `src/Messages.tsx` file to define our `Messages` component:

```tsx
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
// This is the package ID we saved when we published the package
import { MESSAGES_PACKAGE_ID } from "./constants";

export function Messages() {
  const account = useCurrentAccount()!;

  const { data, isLoading, isError, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account.address,
      filter: {
        Package: MESSAGES_PACKAGE_ID,
      },
      options: {
        showContent: true,
      },
    }
  );

  // Add very basic handling of loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        <pre>{error.stack}</pre>
      </div>
    );

  return (
    <div>
      <hr />
      <ol>
        // We won't have any messages until we have a way to send messages
        {!data?.data.length && <div>No Messages yet!</div>}
        {data?.data.map((message) => (
          <li key={message.data?.objectId}>
            {
              // We need a type cast here since, the SDK doesn't know what our message objects look like
              (
                message.data?.content as unknown as {
                  fields: { text: string };
                }
              ).fields.text
            }
          </li>
        ))}
      </ol>
    </div>
  );
}
```

Now let's add our new message component to `App.tsx`

```diff
  import "./App.css";
- import { ConnectButton } from "@mysten/dapp-kit";
+ import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
+ import { Messages } from "./Messages";

  function App() {
+   const account = useCurrentAccount();
    return (
      <>
        <h1>Dapp Kit Workshop</h1>
        <div className="card">
          <ConnectButton />
+         {account && <Messages />}
        </div>
      </>
    );
  }

export default App;

```

If everything is working correctly, you should see a new "No Messages yet!"
displayed after connection your wallet.

## Sending messages

To Send messages, we'll need to add a form that takes a message and an address,
and uses them to create, sign, and send a transaction block.

We can do this by creating a new `src/SendMessage.tsx` file:

```tsx
import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MESSAGES_PACKAGE_ID } from "./constants";

export function SendMessage({ onMessageSent }: { onMessageSent: () => void }) {
  // We need to suiClient to wait for the transaction block to be available
  const suiClient = useSuiClient();
  // We use the current accounts address as the default message recipient
  const account = useCurrentAccount()!;
  // state for the message form
  const [message, setMessage] = useState("hello world!");
  const [recipient, setRecipient] = useState(account.address);
  const [sending, setSending] = useState(false);

  // This hook lets us sign and send a message using the connected wallet
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
        // If we don't wait for the transaction block, the message may not exist yet when we reload the messages
        await suiClient.waitForTransactionBlock({
          digest: result.digest,
        });

        // Trigger the callback, which will allow us to refetch the messages
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
```

Now we need to use our new ` SendMessages` component in the `Messages`
component:

```diff
+ import { SendMessage } from "./SendMessage";

  export function Messages() {
    const account = useCurrentAccount()!;

-   const { data, isLoading, isError, error } = useSuiClientQuery(
+   const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
      "getOwnedObjects",
      {
....
  return (
      <div>
+       <SendMessage onMessageSent={() => refetch()} />
+       <hr />
      <ol>
        {!data?.data.length && <div>No Messages yet!</div>}
...
```

You should now be able to send new messages, and see messages sent to your
address.
