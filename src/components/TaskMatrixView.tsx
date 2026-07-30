import React, { useState } from 'react';
import { ListTodo, Sparkles, AlertCircle, Clock, UserCheck, ShieldCheck, CheckCircle2, Plus, RefreshCw, Filter, ChevronRight, Layers } from 'lucide-react';
import { TaskItem, TeamMember, TaskPriority, EisenhowerQuadrant, LanguageCode } from '../types';
import { translations } from '../data/initialData';

interface TaskMatrixViewProps {
  tasks: TaskItem[];
  onTasksUpdate: (updatedTasks: TaskItem[]) => void;
  teamMembers: TeamMember[];
  currentLanguage: LanguageCode;
}

export const TaskMatrixView: React.FC<TaskMatrixViewProps> = ({
  tasks,
  onTasksUpdate,
  teamMembers,
  currentLanguage,
}) => {
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Infrastructure');
  const [newAssignee, setNewAssignee] = useState(teamMembers[0]?.name || 'Unassigned');
  const [newHours, setNewHours] = useState(8);

  const t = translations[currentLanguage];

  // Call Server-side AI endpoint to prioritize tasks & generate context suggestions
  const handleAutoPrioritize = async () => {
    setIsPrioritizing(true);
    try {
      const res = await fetch('/api/ai/prioritize-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          teamMembers,
          projectContext: 'Enterprise digital architecture and global cloud infrastructure sourcing',
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.prioritizedTasks) {
        // Merge returned AI priorities & suggestions into local task state
        const updated = tasks.map((orig) => {
          const aiMatch = data.prioritizedTasks.find((p: any) => p.id === orig.id);
          if (aiMatch) {
            return {
              ...orig,
              priority: (aiMatch.aiPriority || orig.priority) as TaskPriority,
              aiPriority: (aiMatch.aiPriority || orig.priority) as TaskPriority,
              eisenhowerQuadrant: (aiMatch.eisenhowerQuadrant || 'Do First') as EisenhowerQuadrant,
              aiContextSuggestion: aiMatch.aiContextSuggestion || orig.aiContextSuggestion,
              suggestedAssignee: aiMatch.suggestedAssignee || orig.assignee,
              estimatedHours: aiMatch.estimatedHours || orig.estimatedHours,
              riskFactor: aiMatch.riskFactor || orig.riskFactor,
              strategicImpact: aiMatch.strategicImpact || orig.strategicImpact,
            };
          }
          return orig;
        });

        onTasksUpdate(updated);
        setAiSummary(data.aiSummary);
      }
    } catch (err) {
      console.error('Error auto prioritizing tasks:', err);
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No description provided.',
      category: newCategory,
      status: 'backlog',
      assignee: newAssignee,
      priority: 'P2',
      estimatedHours: newHours,
      createdAt: new Date().toISOString(),
    };

    onTasksUpdate([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setIsAddTaskOpen(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus =
          t.status === 'backlog'
            ? 'in_progress'
            : t.status === 'in_progress'
            ? 'review'
            : t.status === 'review'
            ? 'completed'
            : 'backlog';
        return { ...t, status: nextStatus as TaskItem['status'] };
      }
      return t;
    });
    onTasksUpdate(updated);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedAssignee !== 'all' && t.assignee !== selectedAssignee) return false;
    return true;
  });

  const p0Count = tasks.filter((t) => t.priority === 'P0').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header Banner & Auto-Prioritize Action */}
      <div className="bg-[#080808] border border-[#1a1a1a] p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#121212] text-white border border-[#2a2a2a]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-light uppercase tracking-[0.2em] text-white">
                {t.taskMatrixTitle}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {t.taskMatrixSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-zinc-200 text-[10px] font-mono font-bold uppercase tracking-widest border border-[#262626] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>

          <button
            onClick={handleAutoPrioritize}
            disabled={isPrioritizing}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {isPrioritizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Analyzing Workload...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>{t.prioritizeWithAI}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Executive Summary Box if generated */}
      {aiSummary && (
        <div className="p-4 bg-[#080808] border border-[#1a1a1a] text-xs text-zinc-300 space-y-1 font-mono">
          <div className="font-bold flex items-center gap-1.5 text-white uppercase tracking-widest text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            iNKSTECHSHUB Executive Briefing
          </div>
          <p className="leading-relaxed text-[11px] text-zinc-400">{aiSummary}</p>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080808] p-3 border border-[#1a1a1a] text-xs font-mono">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-zinc-500" />
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#020202] text-zinc-200 border border-[#222222] px-2.5 py-1 focus:outline-none cursor-pointer font-mono text-[11px]"
            >
              <option value="all">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Architecture">Architecture</option>
              <option value="AI Sourcing">AI Sourcing</option>
              <option value="Security">Security</option>
              <option value="DevOps">DevOps</option>
              <option value="Frontend/UI">Frontend/UI</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Assignee:</span>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="bg-[#020202] text-zinc-200 border border-[#222222] px-2.5 py-1 focus:outline-none cursor-pointer font-mono text-[11px]"
            >
              <option value="all">All Global Team Members</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
          <span>
            P0 Critical: <strong className="text-rose-400 font-bold">{p0Count}</strong>
          </span>
          <span>
            In-Progress: <strong className="text-white font-bold">{inProgressCount}</strong>
          </span>
        </div>
      </div>

      {/* Task List / Cards with Context-Aware AI Suggestions */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTasks.map((task) => {
          const assigneeMember = teamMembers.find((m) => m.name === task.assignee);

          const priorityBadgeColor =
            task.priority === 'P0'
              ? 'bg-[#1f0a0a] text-rose-400 border-rose-900/60'
              : task.priority === 'P1'
              ? 'bg-[#1c1308] text-amber-400 border-amber-900/60'
              : task.priority === 'P2'
              ? 'bg-[#0a121c] text-blue-400 border-blue-900/60'
              : 'bg-[#0f0f0f] text-zinc-400 border-[#222222]';

          const statusColor =
            task.status === 'completed'
              ? 'bg-[#081a10] text-emerald-400 border-emerald-900/60'
              : task.status === 'in_progress'
              ? 'bg-[#121212] text-white border-[#333333]'
              : task.status === 'review'
              ? 'bg-[#150a1c] text-purple-300 border-purple-900/60'
              : 'bg-[#080808] text-zinc-500 border-[#1a1a1a]';

          return (
            <div
              key={task.id}
              className={`bg-[#080808] border border-[#1a1a1a] p-5 hover:border-[#2a2a2a] transition-all space-y-4 ${
                task.priority === 'P0' ? 'border-l-2 border-l-rose-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="cursor-pointer text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-none border border-zinc-600 hover:border-emerald-400" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-2 py-0.5 border font-bold uppercase tracking-wider ${priorityBadgeColor}`}>
                        {task.priority}
                      </span>
                      <h3 className={`text-xs font-mono font-bold text-white uppercase tracking-wider ${task.status === 'completed' ? 'line-through text-zinc-600' : ''}`}>
                        {task.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[10px] font-mono px-2.5 py-1 bg-[#020202] text-zinc-400 border border-[#1a1a1a] uppercase tracking-wider">
                    {task.category}
                  </span>
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`text-[10px] font-mono px-2.5 py-1 border font-semibold uppercase tracking-wider cursor-pointer transition-colors ${statusColor}`}
                  >
                    {task.status.replace('_', ' ')}
                  </button>
                </div>
              </div>

              {/* Assignee & Timezone Information */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1a1a1a] text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Assignee: <strong className="text-zinc-200">{task.assignee}</strong></span>
                  {assigneeMember && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-[#020202] px-2 py-0.5 border border-[#1a1a1a]">
                      📍 {assigneeMember.city}, {assigneeMember.country} (UTC{assigneeMember.offsetUTC >= 0 ? `+${assigneeMember.offsetUTC}` : assigneeMember.offsetUTC})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Est: {task.estimatedHours}h
                  </span>
                  {task.eisenhowerQuadrant && (
                    <span className="text-zinc-300 bg-[#121212] px-2 py-0.5 border border-[#2a2a2a] font-bold">
                      {task.eisenhowerQuadrant}
                    </span>
                  )}
                </div>
              </div>

              {/* Generative AI Context-Aware Suggestion for Team Member */}
              {task.aiContextSuggestion && (
                <div className="p-3.5 bg-[#030303] border border-[#1a1a1a] space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                      {t.contextSuggestionsHeader} ({task.assignee})
                    </span>
                    {task.strategicImpact && (
                      <span className="text-zinc-400 text-[9px]">
                        ROI: {task.strategicImpact}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                    {task.aiContextSuggestion}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal to add a new task */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080808] border border-[#1a1a1a] w-full max-w-lg p-6 space-y-4 text-zinc-100 font-mono">
            <h3 className="text-xs font-light uppercase tracking-[0.2em] text-white font-bold">Create New Task Mandate</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Configure Hetzner AX102 Swiss Peering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide technical context and goals..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono resize-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none font-mono mt-1"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Architecture">Architecture</option>
                    <option value="AI Sourcing">AI Sourcing</option>
                    <option value="Security">Security</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Frontend/UI">Frontend/UI</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none font-mono mt-1"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-medium text-zinc-400">Estimated Effort (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-full bg-[#020202] border border-[#1a1a1a] p-2.5 text-xs text-white focus:outline-none focus:border-[#444444] font-mono mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 bg-[#121212] border border-[#2a2a2a] text-zinc-300 text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:bg-zinc-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
