const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");

let chainId = process.env.CHAIN_ID;
let moralisChainId = chainId === "31337" ? "1337" : chainId;

const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.MASTER_KEY;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Working on contract ${contractAddress}`);

  let itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "nftPrice",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
  };
  let ItemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "nftPrice",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
  };
  let ItemCanceledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
    tableName: "ItemCanceled",
  };
  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    {
      useMasterKey: true,
    }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    ItemBoughtOptions,
    {
      useMasterKey: true,
    }
  );
  const canceledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    ItemCanceledOptions,
    {
      useMasterKey: true,
    }
  );
  if (
    listedResponse.success &&
    boughtResponse.success &&
    canceledResponse.success
  ) {
    console.log("Events successfully registered");
  } else {
    console.log("Events registration failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
