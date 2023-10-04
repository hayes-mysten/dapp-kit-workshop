module workshop::messages {
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
