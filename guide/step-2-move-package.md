# Creating a Move Package

## Install Sui cli

Before proceeding with this step, we need to make get the Sui CLI set up.

You can follow the
[Sui installation instruction](https://docs.sui.io/build/install) to get
everything set up.

This tutorial uses `devnet`, so we'll need to set up the devnet environment in
the CLI:

```bash
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client switch --env devnet
```

If you haven't set up an address in the sui client yet, you can use the
following command to get a new address:

```bash
sui client new-address secp256k1
```

This well generate a new address and recover phrase for you. You can mark a
newly created address as you active address by running the following command
with your new address:

```bash
sui client switch --address 0xYOUR_ADDRESS...
```

We can ensure we have some Sui in our new wallet by requesting Sui from the
faucet (make sure to replace the address with your address):

```bash
curl --location --request POST 'https://faucet.devnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<YOUR_ADDRESS>"
    }
}'
```

## Creating our a Move package

To get started, we are going to create a very simple move package that allows
creating `Message` objects, and sending them to another Sui address.

First, let's create an empty package in a new `move` directory:

```bash
mkdir move
cd move
sui move new workshop
```

We will now have an empty `move/workshop/sources` directory. Inside the
directory, create a new `messages.move` file:

```move
module dapp_kit_workshop::messages {
    use std::string;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct MessageObject has key, store {
        id: UID,
        /// A string contained in the object
        text: string::String,
        from: address,
    }

    public entry fun sendMessage(address: address, text: string::String, ctx: &mut TxContext) {
        let object = MessageObject {
            id: object::new(ctx),
            text: text,
            from: tx_context::sender(ctx)
        };
        transfer::transfer(object, address);
    }
}
```

We can now publish this module using the Sui CLI:

```bash
sui client publish --gas-budget 100000000 workshop
```

In the output there will be an object with a `"packageId"` property. You'll want
to save that package ID so we can interact with in from our dApp later in the
tutorial.

We can create a new `src/constants.ts` file to save this ID:

```ts
export const MESSAGES_PACKAGE_ID = "<YOUR_PACKAGE_ID>";
```
