import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SendMessage } from "./SendMessage";
import { MESSAGES_PACKAGE_ID } from "./constants";

export function Messages() {
  const account = useCurrentAccount()!;

  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
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

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        <pre>{error.stack}</pre>
      </div>
    );

  return (
    <div>
      <SendMessage onMessageSent={() => refetch()} />
      <hr />
      <ol>
        {!data?.data.length && <div>No Messages yet!</div>}
        {data?.data.map((message) => (
          <li key={message.data?.objectId}>
            {
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
