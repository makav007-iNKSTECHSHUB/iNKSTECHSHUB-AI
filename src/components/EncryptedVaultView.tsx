import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Copy, Check, Download, Share2, Sparkles, FileText, Globe, RefreshCw } from 'lucide-react';
import { TaskItem, TeamMember, ArchitectureBlueprint, LanguageCode, EncryptedProjectPayload } from '../types';
import { translations } from '../data/initialData';
import { encodeEncryptedPayload } from '../utils/crypto';

interface EncryptedVaultViewProps {
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  blueprint: ArchitectureBlueprint | null;
  currentLanguage: LanguageCode;
  onOpenShareModal: () => void;
}

export const EncryptedVaultView: React.FC<EncryptedVaultViewProps> = ({
  tasks,
  teamMembers,
  blueprint,
  currentLanguage,
  onOpenShareModal,
}) => {
  const [passcode, setPasscode] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const t = translations[currentLanguage];

  const handleGenerateVaultToken = async () => {
    setIsEncrypting(true);
    try {
      const payload: Omit<EncryptedProjectPayload, 'encryptedHash'> = {
        version: '4.2',
        projectTitle: 'iNKSTECHSHUB AI Enterprise Blueprint',
        creator: 'Mahmood',
        tasks,
        teamMembers,
        blueprint,
        activeLanguage: currentLanguage,
        createdAt: new Date().toISOString(),
        expiresInDays: 7,
      };

      const token = await encodeEncryptedPayload(payload, passcode);
      setGeneratedToken(token);
    } catch (err) {
      console.error('Vault encryption failed:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopyToken = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVaultArchive = () => {
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(generatedToken || 'INKSHUB_VAULT_EMPTY');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `iNKSTECHSHUB_Encrypted_Vault_${Date.now()}.inkshub`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#121212] text-white border border-[#2a2a2a]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">
                {t.encryptedVaultTitle}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {t.encryptedVaultSubtitle}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenShareModal}
          className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-black" />
          <span>{t.shareEncryptedLink}</span>
        </button>
      </div>

      {/* Main Encrypted Vault Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Generator Card */}
        <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl space-y-4">
          <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Generate Cryptographic Vault Payload
          </h3>

          <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-[#020202] p-3.5 border border-[#1a1a1a]">
            This module packs the complete active workspace—including task priorities, global team timezones, multi-language preferences, and infrastructure blueprints—into an AES-GCM / SHA-256 encrypted payload.
          </p>

          <div className="space-y-1.5 font-mono">
            <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 flex items-center gap-1">
              <Key className="w-3 h-3 text-white" />
              AES-256 Secret Passcode Lock
            </label>
            <input
              type="password"
              placeholder="Enter secret key to encrypt token..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono"
            />
          </div>

          <button
            onClick={handleGenerateVaultToken}
            disabled={isEncrypting}
            className="w-full py-2.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] text-white font-mono font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isEncrypting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Executing SHA-256 Handshake...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypt Workspace Payload</span>
              </>
            )}
          </button>

          {generatedToken && (
            <div className="space-y-3 pt-3 border-t border-[#1a1a1a]">
              <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                <span className="font-mono font-bold text-emerald-400 text-[10px] uppercase tracking-wider">Encrypted Token Output:</span>
                <button
                  onClick={handleCopyToken}
                  className="px-2.5 py-1 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-200 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer border border-[#2a2a2a]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={3}
                value={generatedToken}
                className="w-full bg-[#020202] border border-[#1a1a1a] p-3 text-[11px] text-emerald-400 font-mono resize-none focus:outline-none select-all"
              />

              <button
                onClick={handleDownloadVaultArchive}
                className="w-full py-2 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-200 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer border border-[#262626]"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Download `.inkshub` Vault File
              </button>
            </div>
          )}
        </div>

        {/* Security & Audit Summary */}
        <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl space-y-4">
          <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-white" />
            Encrypted Workspace Inspection & Metrics
          </h3>

          <div className="space-y-3 font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between p-3 bg-[#020202] border border-[#1a1a1a]">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider">System Architect:</span>
              <span className="font-bold text-white">Mahmood (iNKSTECHSHUB)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#020202] border border-[#1a1a1a]">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Security Protocol:</span>
              <span className="font-bold text-emerald-400">Swiss Grade (AES-GCM-256)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#020202] border border-[#1a1a1a]">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Active Tasks:</span>
              <span className="font-bold text-white">{tasks.length} Tasks</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#020202] border border-[#1a1a1a]">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Team Timezones:</span>
              <span className="font-bold text-white">{teamMembers.length} Members</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#020202] border border-[#1a1a1a]">
              <span className="text-zinc-500 uppercase text-[10px] tracking-wider">Multi-Lang Sync:</span>
              <span className="font-bold text-amber-400 uppercase">{currentLanguage} (8 Supported)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
