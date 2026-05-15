import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  AlertTriangle, 
  Trash2, 
  Clock, 
  Database, 
  Layout, 
  Code,
  Terminal,
  Search,
  Filter,
  X,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cmsService } from "../../lib/cms-service";

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "error" | "warning" | "info">("ALL");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await cmsService.getSystemLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    try {
      await cmsService.deleteSystemLog(id);
      setLogs(logs.filter(l => l.id !== id));
      if (selectedLog?.id === id) setSelectedLog(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("🚨 SYSTEM WIPE: Are you sure you want to delete ALL diagnostic logs? This cannot be undone.")) return;
    try {
      await cmsService.clearAllSystemLogs();
      await fetchLogs();
      setSelectedLog(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'frontend': return <Layout className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  const filteredLogs = logs.filter((l: any) => {
    if (filter === "ALL") return true;
    return l.level === filter;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ DIAGNOSTIC PROTOCOL ]</span>
            <h1 className="font-display text-[8vw] lg:text-[6vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              SYSTEM<br />LOGS
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-8 border-b border-black/5 pb-4">
            <button 
              onClick={handleClearAll}
              className="text-[10px] font-black tracking-widest uppercase text-red-500/40 hover:text-red-500 transition-all mr-4"
            >
              Clear All Logs
            </button>
            <div className="h-4 w-px bg-black/10 mr-4" />
            <button onClick={fetchLogs} className="p-2 hover:bg-black/5 rounded-full transition-all">
              <RefreshCcw className={cn("w-4 h-4 opacity-40", isLoading && "animate-spin opacity-100")} />
            </button>
            <div className="h-4 w-px bg-black/10" />
            {['ALL', 'error', 'warning', 'info'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f as any)}
                className={cn(
                  "text-[10px] font-black tracking-widest uppercase transition-all relative pb-2",
                  filter === f ? "text-red-500" : "opacity-30 hover:opacity-100"
                )}
              >
                {f}
                {filter === f && <motion.div layoutId="logFilter" className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* List Section */}
          <div className="lg:col-span-5 space-y-3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-black/5 animate-pulse border border-black/5" />
              ))
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={cn(
                    "group p-6 border cursor-pointer transition-all duration-300 relative flex items-center gap-4",
                    selectedLog?.id === log.id ? "bg-black text-white border-black" : "bg-white border-black/5 hover:border-black/20",
                    log.level === 'error' && selectedLog?.id !== log.id ? "border-l-4 border-l-red-500" : ""
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center shrink-0",
                    selectedLog?.id === log.id ? "bg-white/10" : "bg-black/5"
                  )}>
                    {getSourceIcon(log.source)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black tracking-widest uppercase truncate mb-1">
                      {log.message}
                    </p>
                    <div className="flex items-center gap-4 opacity-40">
                      <span className="text-[8px] font-black uppercase tracking-tighter">{log.source}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-black/10">
                <p className="text-[10px] font-black tracking-widest opacity-20 uppercase">System Integrity Nominal</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedLog ? (
                <motion.div
                  key={selectedLog.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-black p-10 lg:p-12 space-y-10"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase tracking-widest",
                          selectedLog.level === 'error' ? "bg-red-500 text-white" : "bg-yellow-400 text-black"
                        )}>
                          {selectedLog.level}
                        </span>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">[ {selectedLog.source} ]</span>
                      </div>
                      <h2 className="text-3xl font-display font-black uppercase tracking-tight leading-tight">
                        {selectedLog.message}
                      </h2>
                    </div>
                    <button 
                      onClick={() => handleDelete(selectedLog.id)}
                      className="p-4 rounded-full border border-black/5 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-black/5">
                    <div>
                      <p className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-2">Timestamp</p>
                      <p className="text-sm font-black uppercase">{new Date(selectedLog.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-2">Log ID</p>
                      <p className="text-[10px] font-mono opacity-50 uppercase truncate">{selectedLog.id}</p>
                    </div>
                  </div>

                  {selectedLog.stack_trace && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[8px] font-black tracking-widest opacity-30 uppercase">
                        <Code className="w-3 h-3" />
                        Stack Trace
                      </div>
                      <div className="p-8 bg-black text-white/70 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-[300px] leading-relaxed">
                        {selectedLog.stack_trace}
                      </div>
                    </div>
                  )}

                  {selectedLog.metadata && (
                    <div className="space-y-4">
                      <p className="text-[8px] font-black tracking-widest opacity-30 uppercase">Context Metadata</p>
                      <pre className="p-6 bg-black/5 border border-black/5 text-[10px] font-mono">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-[400px] bg-black/5 border border-dashed border-black/10 flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="w-12 h-12 opacity-10 mb-6" />
                  <h3 className="text-[10px] font-black tracking-[0.5em] uppercase opacity-20">Select entry to analyze</h3>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
