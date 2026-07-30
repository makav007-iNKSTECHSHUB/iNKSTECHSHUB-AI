import React, { useState } from 'react';
import { Server, Cpu, ShieldCheck, DollarSign, FileCode, Sparkles, Download, Copy, Check, ArrowRight, Layers, Database, HardDrive, Network } from 'lucide-react';
import { ArchitectureBlueprint, LanguageCode } from '../types';
import { translations, initialBlueprint } from '../data/initialData';

interface SourcingMatrixViewProps {
  blueprint: ArchitectureBlueprint | null;
  onBlueprintUpdate: (newBp: ArchitectureBlueprint) => void;
  currentLanguage: LanguageCode;
}

export const SourcingMatrixView: React.FC<SourcingMatrixViewProps> = ({
  blueprint,
  onBlueprintUpdate,
  currentLanguage,
}) => {
  const [cloudStrategy, setCloudStrategy] = useState('Hybrid (Swiss Bare-Metal + GCP Cloud Run)');
  const [budgetTier, setBudgetTier] = useState('Enterprise Tier ($5k-$20k/mo)');
  const [gpuNeeded, setGpuNeeded] = useState('4x NVIDIA H100 SXM5');
  const [customReqs, setCustomReqs] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const t = translations[currentLanguage];

  const currentBp = blueprint || initialBlueprint;

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements: customReqs || 'High availability multi-region Kubernetes + GPU inference cluster',
          cloudProvider: cloudStrategy,
          budgetTier,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.title) {
        onBlueprintUpdate({
          ...data,
          cloudProvider: cloudStrategy,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Failed to generate blueprint:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalMonthlyCost = currentBp.billOfMaterials.reduce(
    (acc, item) => acc + item.estimatedMonthlyCostUSD,
    0
  );

  const handleCopyTerraform = () => {
    if (!currentBp.terraformSnippet) return;
    navigator.clipboard.writeText(currentBp.terraformSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportBlueprintJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentBp, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `iNKSTECHSHUB_Blueprint_${Date.now()}.json`);
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
              <Server className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">
                {t.sourcingTitle}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {t.sourcingSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBlueprintJSON}
            className="px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-200 text-[10px] font-mono font-bold uppercase tracking-widest border border-[#262626] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Specs</span>
          </button>
        </div>
      </div>

      {/* Blueprint Generator Form Controls */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-5 shadow-2xl space-y-4">
        <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Configure Architecture Sourcing Mandate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Cloud & Infrastructure Strategy</label>
            <select
              value={cloudStrategy}
              onChange={(e) => setCloudStrategy(e.target.value)}
              className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono mt-1"
            >
              <option value="Hybrid (Swiss Bare-Metal + GCP Cloud Run)">Hybrid (Swiss Bare-Metal + GCP Cloud Run)</option>
              <option value="AWS EKS Multi-Region + Cloudflare WAF">AWS EKS Multi-Region + Cloudflare WAF</option>
              <option value="Hetzner Bare-Metal Dedicated Compute">Hetzner Bare-Metal Dedicated Compute</option>
              <option value="Private Swiss Datacenter On-Premise">Private Swiss Datacenter On-Premise</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Budget Tier</label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono mt-1"
            >
              <option value="Startup Tier ($1k-$3k/mo)">Startup Tier ($1k-$3k/mo)</option>
              <option value="Enterprise Tier ($5k-$20k/mo)">Enterprise Tier ($5k-$20k/mo)</option>
              <option value="Hyperscale AI Tier ($25k-$100k/mo)">Hyperscale AI Tier ($25k-$100k/mo)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">GPU Hardware Requirement</label>
            <select
              value={gpuNeeded}
              onChange={(e) => setGpuNeeded(e.target.value)}
              className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono mt-1"
            >
              <option value="4x NVIDIA H100 SXM5">4x NVIDIA H100 SXM5 (80GB)</option>
              <option value="8x NVIDIA L40S">8x NVIDIA L40S (48GB)</option>
              <option value="2x NVIDIA A100 SXM4">2x NVIDIA A100 SXM4 (80GB)</option>
              <option value="CPU Only High Memory Compute">CPU Only High Memory Compute</option>
            </select>
          </div>
        </div>

        <div className="font-mono">
          <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Custom Sourcing Directives & Constraints</label>
          <input
            type="text"
            placeholder="e.g. Must support Swiss DSG data residency in Zurich with Cloudflare Anycast DDoS protection..."
            value={customReqs}
            onChange={(e) => setCustomReqs(e.target.value)}
            className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#444444] font-mono mt-1"
          />
        </div>

        <button
          onClick={handleGenerateBlueprint}
          disabled={isGenerating}
          className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Generating Infrastructure Blueprint...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>{t.generateBlueprint}</span>
            </>
          )}
        </button>
      </div>

      {/* Active Blueprint Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: BOM & Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
                  {currentBp.title}
                </h3>
                <span className="text-[9px] font-mono uppercase bg-[#121212] text-zinc-200 border border-[#2a2a2a] px-2 py-0.5 font-bold tracking-wider">
                  {currentBp.cloudProvider}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-mono">
                {currentBp.summary}
              </p>
            </div>

            {/* Bill of Materials Table */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Bill of Materials (BOM) & Cost Allocation
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] text-zinc-500 uppercase text-[9px] tracking-[0.15em]">
                      <th className="py-2.5 px-3">Component</th>
                      <th className="py-2.5 px-3">Specification</th>
                      <th className="py-2.5 px-3 text-right">Est. Monthly (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#121212] text-zinc-300">
                    {currentBp.billOfMaterials.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#0c0c0c]">
                        <td className="py-3 px-3 font-semibold text-white">{item.component}</td>
                        <td className="py-3 px-3 text-zinc-400">{item.spec}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400">
                          ${item.estimatedMonthlyCostUSD.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#020202] font-bold border-t border-[#1a1a1a]">
                      <td colSpan={2} className="py-3 px-3 text-white uppercase tracking-wider text-[10px]">
                        Total Monthly Infrastructure Spend
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-400 text-xs font-mono">
                        ${totalMonthlyCost.toLocaleString()} USD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            {currentBp.architectureDiagramNodes && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-mono uppercase text-zinc-400 tracking-[0.2em] font-semibold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  Topological Architecture Flow
                </h4>
                <div className="flex flex-wrap items-center gap-2 bg-[#020202] p-4 border border-[#1a1a1a] font-mono text-xs">
                  {currentBp.architectureDiagramNodes.map((node, i) => (
                    <React.Fragment key={i}>
                      <span className="px-3 py-1.5 bg-[#0e0e0e] border border-[#222222] text-zinc-200 text-[11px]">
                        {node}
                      </span>
                      {i < currentBp.architectureDiagramNodes.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Infrastructure as Code Terraform & Compliance */}
        <div className="space-y-6">
          {/* Terraform Code Box */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-white" />
                <h4 className="text-[10px] font-bold text-white tracking-widest font-mono uppercase">
                  Terraform Infrastructure Spec
                </h4>
              </div>
              <button
                onClick={handleCopyTerraform}
                className="px-2.5 py-1 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 border border-[#262626] cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-[#020202] p-4 border border-[#1a1a1a] text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-80 scrollbar-thin">
              <code>{currentBp.terraformSnippet}</code>
            </pre>
          </div>

          {/* Compliance & Security Box */}
          <div className="bg-[#080808] border border-[#1a1a1a] p-5 shadow-2xl space-y-3 font-mono">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security & Compliance Framework</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed bg-[#020202] p-3 border border-[#1a1a1a]">
              {currentBp.complianceNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
