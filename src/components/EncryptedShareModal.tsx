import React, { useState, useEffect } from 'react';
import { X, Lock, Key, Copy, Check, ShieldAlert, Sparkles, Download, Upload, Share2, Link } from 'lucide-react';
import { LanguageCode, EncryptedProjectPayload, TaskItem, TeamMember, ArchitectureBlueprint } from '../types';
import { translations } from '../data/initialData';
import { encodeEncryptedPayload, decodeEncryptedPayload } from '../utils/crypto';
import { Logo } from './Logo';

interface EncryptedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  blueprint: ArchitectureBlueprint | null;
  onImportPayload: (payload: EncryptedProjectPayload) => void;
}

export const EncryptedShareModal: React.FC<EncryptedShareModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  tasks,
  teamMembers,
  blueprint,
  onImportPayload,
}) => {
  const [passcode, setPasscode] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number>(7);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [importToken, setImportToken] = useState('');
  const [importPasscode, setImportPasscode] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'import'>('share');

  const t = translations[currentLanguage];

  useEffect(() => {
    if (isOpen) {
      handleGenerateLink();
    }
  }, [isOpen, passcode, expiresInDays]);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
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
        expiresInDays,
      };

      const token = await encodeEncryptedPayload(payload, passcode);
      const fullUrl = `${window.location.origin}${window.location.pathname}#share=${token}`;
      setGeneratedLink(fullUrl);
    } catch (err) {
      console.error('Failed to generate encrypted link:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    setImportError('');
    setImportSuccess(false);

    if (!importToken.trim()) {
      setImportError('Please enter a valid encrypted share token or link.');
      return;
    }

    try {
      let cleanToken = importToken.trim();
      if (cleanToken.includes('#share=')) {
        cleanToken = cleanToken.split('#share=')[1];
      }

      const decoded = await decodeEncryptedPayload(cleanToken, importPasscode);
      if (decoded) {
        onImportPayload(decoded);
        setImportSuccess(true);
        setTimeout(() => {
          onClose();
          setImportSuccess(false);
          setImportToken('');
          setImportPasscode('');
        }, 1500);
      } else {
        setImportError('Unable to decrypt or decode project payload.');
      }
    } catch (err: any) {
      if (err?.message === 'PASSCODE_REQUIRED') {
        setImportError('Secret passcode required for this encrypted link.');
      } else {
        setImportError('Invalid or corrupted encrypted payload.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-xl overflow-hidden shadow-2xl text-zinc-100 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] bg-[#030303]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white border border-[#2a2a2a] p-0.5 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <Logo size={32} />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                {t.encryptedVaultTitle}
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">
                System Architect: Mahmood • Multi-Region Collaborative Link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-[#121212] transition-colors cursor-pointer border border-transparent hover:border-[#222222]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#1a1a1a] bg-[#020202]">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2.5 text-[10px] font-mono uppercase tracking-widest border-b transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'share'
                ? 'border-white text-white font-bold bg-[#0c0c0c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Generate Share Link
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 text-[10px] font-mono uppercase tracking-widest border-b transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'border-white text-white font-bold bg-[#0c0c0c]'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import Link
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'share' ? (
            <>
              <div className="p-3 bg-[#020202] border border-[#1a1a1a] text-[11px] text-zinc-300 leading-relaxed font-mono">
                🔐 <strong>End-to-End Encryption:</strong> Generates a self-contained AES-GCM / SHA-256 payload URL. Anyone with this link in Zurich, Tokyo, Dubai, or London can decrypt and synchronize project documentation in real-time.
              </div>

              {/* Optional Passcode */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-white" />
                  Optional Secret Passcode (AES-256)
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for open link access..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#020202] border border-[#1a1a1a] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#444444] font-mono"
                />
              </div>

              {/* Expiration options */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">
                  Time-Lock Expiration Policy
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '24 Hours', value: 1 },
                    { label: '7 Days', value: 7 },
                    { label: '30 Days', value: 30 },
                    { label: 'Permanent', value: 365 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setExpiresInDays(option.value)}
                      className={`py-1.5 px-2 text-[10px] font-mono uppercase tracking-wider border text-center transition-all cursor-pointer ${
                        expiresInDays === option.value
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-[#020202] border-[#1a1a1a] text-zinc-400 hover:border-[#333333]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Link Preview Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 flex items-center justify-between">
                  <span>Encrypted Share Link</span>
                  {passcode && (
                    <span className="text-[9px] text-emerald-400 font-mono bg-[#020202] px-1.5 py-0.5 border border-[#1a1a1a] uppercase">
                      AES-GCM Password Protected
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-[#020202] border border-[#1a1a1a] px-3 py-2 text-xs font-mono text-emerald-400 truncate focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white hover:bg-zinc-200 text-black'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {t.linkCopied}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {t.copyLink}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Import Tab */
            <div className="space-y-4">
              <div className="p-3 bg-[#020202] border border-[#1a1a1a] text-[11px] text-zinc-300 leading-relaxed font-mono">
                📥 <strong>Import Shared Workspace:</strong> Paste an encrypted link or token shared by Mahmood or team members to load shared project tasks, infrastructure blueprints, and multi-language settings.
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">
                  Encrypted Share Link / Token
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste URL or INKSHUB_V1.ey... token here"
                  value={importToken}
                  onChange={(e) => setImportToken(e.target.value)}
                  className="w-full bg-[#020202] border border-[#1a1a1a] p-3 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[#444444] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">
                  Secret Passcode (If password-protected)
                </label>
                <input
                  type="password"
                  placeholder="Enter passcode if required..."
                  value={importPasscode}
                  onChange={(e) => setImportPasscode(e.target.value)}
                  className="w-full bg-[#020202] border border-[#1a1a1a] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#444444] font-mono"
                />
              </div>

              {importError && (
                <div className="p-2.5 bg-[#1f0a0a] border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 font-mono">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-2.5 bg-[#081a10] border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2 font-mono">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Workspace decrypted & synchronized successfully!</span>
                </div>
              )}

              <button
                onClick={handleImport}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-black" />
                Decrypt & Synchronize Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
