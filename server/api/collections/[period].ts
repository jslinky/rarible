import collectionsData from "~/server/api/data/variance_nft_collections.json";

const isValidChain = (value: string): value is Chain => {
    return [
      "Ethereum", "TON", "NEW", "Polygon", "Aptos", "Base", "Celo",
      "Kroma", "Arbitrum", "Moonbeam", "Palm", "Lisk", "RARI Chain",
      "ImmutableX", "XAI", "Mantle", "Sei", "Bera"
    ].includes(value);
  };
  
  const data: NFTData = {
    "1h": {
      collections: collectionsData["1h"].collections.map((collection) => ({
        ...collection,
        chain: isValidChain(collection.chain) ? collection.chain : "Ethereum" // Default fallback
      }))
    },
    "6h": {
      collections: collectionsData["6h"].collections.map((collection) => ({
        ...collection,
        chain: isValidChain(collection.chain) ? collection.chain : "Ethereum"
      }))
    },
    "24h": {
      collections: collectionsData["24h"].collections.map((collection) => ({
        ...collection,
        chain: isValidChain(collection.chain) ? collection.chain : "Ethereum"
      }))
    },
    "7d": {
      collections: collectionsData["7d"].collections.map((collection) => ({
        ...collection,
        chain: isValidChain(collection.chain) ? collection.chain : "Ethereum"
      }))
    },
    "30d": {
      collections: collectionsData["30d"].collections.map((collection) => ({
        ...collection,
        chain: isValidChain(collection.chain) ? collection.chain : "Ethereum"
      }))
    }
  };

export default defineEventHandler((event) => {
    const period = getRouterParam(event, 'period') as string;

    if (!["1h", "6h", "24h", "7d", "30d"].includes(period)) {
        return { error: "Invalid time period requested" };
    }

    return data[period as timePeriod];
});