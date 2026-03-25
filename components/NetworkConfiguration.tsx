'use client';

import { useState, useEffect, useCallback } from 'react';
import { SettingsIcon } from '@/components/icons';
import {
  CardanoNetwork,
  DEFAULT_NETWORKS,
  getCurrentNetworkConfig,
  saveNetworkConfig,
} from '@/lib/network-config';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface NetworkConfigProps {
  onConfigChange: (config: { network: CardanoNetwork; blockfrostUrl: string; blockfrostApiKey: string }) => void;
}

export default function NetworkConfiguration({ onConfigChange }: NetworkConfigProps) {
  const [network, setNetwork] = useState<CardanoNetwork>('mainnet');
  const [blockfrostApiKey, setBlockfrostApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Escape key handler
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleEscape]);

  useEffect(() => {
    const config = getCurrentNetworkConfig();
    setNetwork(config.network);
    setBlockfrostApiKey(config.blockfrostApiKey);
  }, []);

  const handleNetworkChange = (newNetwork: CardanoNetwork) => {
    setNetwork(newNetwork);
    const newConfig = { ...DEFAULT_NETWORKS[newNetwork], blockfrostApiKey };
    saveNetworkConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleApiKeyChange = (newKey: string) => {
    setBlockfrostApiKey(newKey);
    const newConfig = { ...DEFAULT_NETWORKS[network], blockfrostApiKey: newKey };
    saveNetworkConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="relative z-[1001]">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 shadow-lg shadow-black/20"
      >
        <Badge
          variant="outline"
          className={`text-[0.6rem] font-bold uppercase tracking-wider border ${
            network === 'mainnet'
              ? 'bg-brand-success/20 text-brand-success border-brand-success/30'
              : 'bg-brand-warning/20 text-brand-warning border-brand-warning/30'
          }`}
        >
          {network}
        </Badge>
        <SettingsIcon size={14} className="text-white/50" />
        <span className="text-white/70 text-xs font-medium hidden sm:inline">Settings</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-[380px] max-w-[90vw] glass-elevated rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-[1001]"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Network Configuration</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Network selection */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs font-medium uppercase tracking-wider">Network</Label>
                <div className="flex gap-1.5 p-1 rounded-lg bg-white/[0.06]">
                  {(Object.keys(DEFAULT_NETWORKS) as CardanoNetwork[]).map((net) => (
                    <button
                      key={net}
                      onClick={() => handleNetworkChange(net)}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 capitalize ${
                        network === net
                          ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                          : 'text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blockfrost API key */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs font-medium uppercase tracking-wider">Blockfrost Project ID</Label>
                <Input
                  type="password"
                  value={blockfrostApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="mainnetXXXXXXXXXXXXXXXXXXXXXXXXX"
                  className="bg-white/[0.06] border-white/[0.10] text-white placeholder:text-white/30 text-sm"
                />
              </div>

            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
