import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MicOff, ArrowUp, Copy, Check, Volume2, VolumeX, X, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';
import { GoogleGenAI } from '@google/genai';

interface AttachedFile {
  id: string;
  name: string;
  mimeType: string;
  data: string;
  previewUrl?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  files?: AttachedFile[];
  timestamp: string;
}

export const MinimalistCanvas: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanSpeech = text
      .replace(/```[\s\S]*?```/g, 'Code block generated.')
      .replace(/[*#_`]/g, '')
      .trim();

    if (!cleanSpeech) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceMode = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeaking();
    } else {
      setIsVoiceActive(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition start error:', e);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newFile: AttachedFile = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: result,
          previewUrl: file.type.startsWith('image/') ? result : undefined
        };
        setAttachedFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = async () => {
    if ((!inputText.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMsgText = inputText.trim();
    const currentFiles = [...attachedFiles];

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: userMsgText,
      files: currentFiles,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      // Connect directly using the browser environment API key
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || (window as any).__ENV?.GEMINI_API_KEY });
      
      const contents: any[] = [userMsgText];
      
      currentFiles.forEach((file) => {
        const base64Data = file.data.includes(',') ? file.data.split(',')[1] : file.data;
        contents.push({
          inlineData: {
            mimeType: file.mimeType,
            data: base64Data
          }
        });
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      const aiText = response.text || 'No response generated from iNKSTECHSHUB AI.';

      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (isVoiceActive) {
        speakText(aiText);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: `[iNKSTECHSHUB AI Error]: ${err?.message || String(err)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-mono selection:bg-white selection:text-black">
      <header className="border-b border-[#121212] bg-[#050505]/90 backdrop-blur-md sticky top-0 z-40 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-white p-0.5 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            <Logo size={32} />
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
              iNKSTECHSHUB AI
              <span className="text-[9px] font-mono px-2 py-0.5 border border-[#222222] text-zinc-400 bg-[#0a0a0a]">
                @google/genai
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase font-mono">
              Mahmood Studio • Pure Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Google GenAI Engine Active</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        {messages.length === 0 ? (
          <div className="my-auto text-center py-16 space-y-6">
            <div className="inline-flex h-20 w-20 bg-white p-1 rounded-full items-center justify-center shadow-2xl border border-[#222222] animate-pulse">
              <Logo size={72} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white">
                iNKSTECHSHUB AI
              </h2>
              <p className="text-xs text-zinc-500 font-mono tracking-widest max-w-md mx-auto uppercase">
                Google @google/genai Minimalist Intelligence Interface
              </p>
            </div>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-[11px] font-mono max-w-xl mx-auto">
              <div className="p-3 bg-[#0a0a0a] border border-[#161616] text-zinc-400">
                <span className="text-white font-bold block mb-1">01. DATA (+)</span>
                Attach files, documents, or base64 images directly.
              </div>
              <div className="p-3 bg-[#0a0a0a] border border-[#161616] text-zinc-400">
                <span className="text-white font-bold block mb-1">02. PROMPT</span>
                Type query or directive into the central field.
              </div>
              <div className="p-3 bg-[#0a0a0a] border border-[#161616] text-zinc-400">
                <span className="text-white font-bold block mb-1">03. VOICE</span>
                Toggle real-time speech input & audio readout.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-28 pt-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase">
                  <span>{msg.sender === 'user' ? 'Direct Prompt' : 'iNKSTECHSHUB AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1 justify-end">
                    {msg.files.map((file) => (
                      <div
                        key={file.id}
                        className="p-2 bg-[#0d0d0d] border border-[#222222] text-[10px] text-zinc-300 flex items-center gap-2"
                      >
                        {file.previewUrl ? (
                          <img src={file.previewUrl} alt={file.name} className="w-8 h-8 object-cover border border-[#333333]" />
                        ) : (
                          <FileText className="w-4 h-4 text-zinc-400" />
                        )}
                        <span className="truncate max-w-[120px]">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`p-4 max-w-2xl text-xs leading-relaxed font-mono whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-[#0a0a0a] text-zinc-200 border border-[#1a1a1a] w-full'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="px-2.5 py-1 bg-[#0a0a0a] hover:bg-[#121212] text-zinc-400 hover:text-white text-[10px] flex items-center gap-1.5 border border-[#1a1a1a] transition-all cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => speakText(msg.text)}
                      className="px-2.5 py-1 bg-[#0a0a0a] hover:bg-[#121212] text-zinc-400 hover:text-white text-[10px] flex items-center gap-1.5 border border-[#1a1a1a] transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-zinc-400" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col space-y-2 items-start">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase">
                  <span>iNKSTECHSHUB AI</span>
                  <span>•</span>
                  <span>Executing @google/genai</span>
                </div>
                <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] text-xs text-zinc-400 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span className="uppercase tracking-wider text-[11px]">Processing Google GenAI response matrix...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-40">
        <div className="max-w-2xl mx-auto w-full space-y-2">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-[#0c0c0c] border border-[#1a1a1a]">
              {attachedFiles.map((f) => (
                <div
                  key={f.id}
                  className="px-2.5 py-1 bg-[#141414] border border-[#2a2a2a] text-[10px] text-zinc-300 flex items-center gap-2"
                >
                  {f.previewUrl ? (
                    <img src={f.previewUrl} alt={f.name} className="w-4 h-4 object-cover" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span className="truncate max-w-[100px]">{f.name}</span>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-zinc-500 hover:text-white cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#0a0a0a] border border-[#222222] p-2 flex items-center gap-2 shadow-2xl transition-all focus-within:border-[#444444]">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload Data / Files (+)"
              className="p-2.5 bg-[#121212] hover:bg-white text-zinc-400 hover:text-black border border-[#222222] hover:border-white transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="flex-1 relative flex items-center">
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening to voice input..." : "Type prompt directive..."}
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-mono resize-none"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || (!inputText.trim() && attachedFiles.length === 0)}
                title="Enter / Send"
                className="p-2 bg-white hover:bg-zinc-200 disabled:opacity-20 text-black transition-all cursor-pointer shrink-0 ml-1"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            <button
              onClick={toggleVoiceMode}
              title={isVoiceActive ? "Disable Voice Mode" : "Enable Voice Mode"}
              className={`p-2.5 transition-all cursor-pointer shrink-0 border ${
                isVoiceActive
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-[#121212] hover:bg-[#1a1a1a] text-zinc-400 hover:text-white border-[#222222]'
              }`}
            >
              {isVoiceActive ? (
                <div className="flex items-center gap-1">
                  <Mic className="w-4 h-4 text-black animate-pulse" />
                </div>
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600 px-1 uppercase tracking-wider">
            <span>[+] Upload Files • [Enter] Execute Prompt • [Mic] Voice Synthesis</span>
            {isSpeaking && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-bounce" /> Audio Synthesis Active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
