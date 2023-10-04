# Setup a new project

## Install pnpm

If you have not set up pnpm follow the pnpm
[installation instructions](https://pnpm.io/installation)

## Create a new Vite project

```bash
pnpm create vite
# 1. Select React
# 2. Enter a your project name (dapp-kit-workshop)
# 3. Select TypeScript + SWC
```

This will create a new empty React project. You can now change directories to
the newly created project

```bash
cd dapp-kit-workshop
```

## Install Sui dependencies

```bash
pnpm add @mysten/sui.js @mysten/dapp-kit @tanstack/react-query
```

## Run your dev server

Now you are ready to start developing your dapp

```bash
# Start your dev server
pnpm dev
```

You should now have your dev server which you can open at
[http://localhost:5175/](http://localhost:5175/)
