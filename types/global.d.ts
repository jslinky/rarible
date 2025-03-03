declare global {

    type timePeriod = "1h" | "6h" | "24h" | "7d" | "30d";

    type Chain = 
  | "Ethereum"
  | "TON"
  | "Polygon"
  | "Aptos"
  | "Base"
  | "Celo"
  | "Kroma"
  | "Arbitrum"
  | "Moonbeam"
  | "Palm"
  | "Lisk"
  | "RARI Chain"
  | "ImmutableX"
  | "XAI"
  | "Mantle"
  | "Sei"
  | "Bera";
    
    type ChainOptions = {
      value: string,
      label: Chain | "All Chains",
      disabled?: boolean
    };

    interface NFTCollection {
      name: string;
      chain: Chain;
      floor_price: string;        // Floor price in crypto (e.g., "10.5 Ethereum")
      floor_usd: string;          // Floor price in USD (e.g., "$25500")
      floor_change: string;       // % Change in floor price over the period (e.g., "-10.0%")
      top_offer: string;          // Highest offer in crypto (e.g., "8.0 Ethereum")
      sales: number;              // Number of sales in the given time period
      owners: number;             // Number of unique owners
      listed: string;             // % of total supply listed for sale (e.g., "10.0%")
      volume: string;             // Trading volume in the given time period (e.g., "3000 Ethereum")
      floor_chart: number[];      // Array of numbers representing historical floor price changes
    };

    interface NFTCollectionData {
      collections: NFTCollection[];
    };

    type NFTData = {
      [key in timePeriod]: NFTCollectionData;
    }
}

export {}