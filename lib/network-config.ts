// Network configuration utilities with localStorage and cookie support

export type CardanoNetwork = 'mainnet' | 'preprod' | 'preview';

export interface NetworkConfig {
  network: CardanoNetwork;
  blockfrostUrl: string;
  blockfrostApiKey: string;
}

// Default network configurations
export const DEFAULT_NETWORKS: Record<CardanoNetwork, NetworkConfig> = {
  mainnet: { network: 'mainnet', blockfrostUrl: process.env.NEXT_PUBLIC_BLOCKFROST_URL_MAINNET!, blockfrostApiKey: '' },
  preprod: { network: 'preprod', blockfrostUrl: process.env.NEXT_PUBLIC_BLOCKFROST_URL_PREPROD!, blockfrostApiKey: '' },
  preview: { network: 'preview', blockfrostUrl: process.env.NEXT_PUBLIC_BLOCKFROST_URL_PREVIEW!, blockfrostApiKey: '' },
};

export const EXPLORER_URLS: Record<CardanoNetwork, string> = {
  mainnet: 'https://cardanoscan.io',
  preprod: 'https://preprod.cardanoscan.io',
  preview: 'https://preview.cardanoscan.io',
};

const STORAGE_KEY = 'keri-cardano-network-config';

/**
 * Get network configuration from localStorage
 */
export function getStoredNetworkConfig(): NetworkConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const config = JSON.parse(stored);
    return config;
  } catch (error) {
    console.error('Failed to get stored network config:', error);
    return null;
  }
}

/**
 * Save network configuration to localStorage
 */
export function saveNetworkConfig(config: NetworkConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save network config:', error);
  }
}

/**
 * Get current network configuration with defaults
 */
export function getCurrentNetworkConfig(): NetworkConfig {
  const stored = getStoredNetworkConfig();
  const network = stored?.network ?? 'mainnet';
  return { ...DEFAULT_NETWORKS[network], blockfrostApiKey: stored?.blockfrostApiKey ?? '' };
}

/**
 * Get network magic number for wallet validation
 * Note: NetworkId from wallet API returns 0 for testnets and 1 for mainnet
 */
export function getNetworkMagic(network: CardanoNetwork): number {
  switch (network) {
    case 'mainnet':
      return 764824073; // Mainnet magic
    case 'preprod':
      return 1; // Preprod magic
    case 'preview':
      return 2; // Preview magic
    default:
      return 764824073;
  }
}
