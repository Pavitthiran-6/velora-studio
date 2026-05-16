import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  FolderKanban, 
  Bell, 
  Shield, 
  Star,
  Plus,
  Eye,
  Trash2,
  Upload,
  ArrowUpRight,
  ArrowRight,
  Activity,
  Briefcase,
  Users,
  MessageSquare,
  Zap,
  RefreshCcw,
  ShieldCheck,
  MousePointer2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { cmsService } from "../../lib/cms-service";
import { supabase } from "../../lib/supabase";
import { logSystemEvent } from "../../lib/logger";

// --- CUSTOM SVG GRAPH COMPONENTS (From Analytics) ---

const LineGraph = ({ data, color = "#ef4444", height = 120 }: { data: number[], color?: string, height?: number }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 80 - 10; 
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full relative" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient-line-dash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          d={`M ${points} L 100,100 L 0,100 Z`}
          fill="url(#gradient-line-dash)"
        />
      </svg>
    </div>
  );
};

const BarGraph = ({ data, labels }: { data: number[], labels: string[] }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 md:gap-2 h-32 w-full">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full relative bg-black/5 hover:bg-black transition-colors duration-300 overflow-hidden">
             <motion.div
               initial={{ height: 0 }}
               animate={{ height: `${(val / max) * 100}%` }}
               transition={{ duration: 1, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] }}
               className="bg-[#ef4444] w-full"
             />
          </div>
          <span className="text-[6px] md:text-[8px] font-black opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-tighter truncate w-full text-center">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    reviews: 0,
    messages: 0,
    activeCards: 0,
    errors: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [growthData, setGrowthData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [categoryStats, setCategoryStats] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [p, r, m, l, c] = await Promise.all([
        cmsService.getProjects(),
        cmsService.getReviews(),
        cmsService.getMessages(),
        cmsService.getSystemLogs(),
        supabase.from("home_cards").select("*", { count: "exact", head: true })
      ]);
      
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      setStats({
        projects: p.length,
        reviews: r.length,
        messages: m.filter((msg: any) => msg.status === 'unread').length,
        activeCards: c.count || 0,
        errors: l.filter((log: any) => log.level === 'error' && new Date(log.created_at) > last24h).length
      });
      
      setRecentProjects(p.slice(0, 5));
      setRecentMessages(m.slice(0, 4));
      setRecentLogs(l.slice(0, 4));

      // Calculate Real Growth Data (Last 7 Days)
      const dailyCounts = new Array(7).fill(0);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      m.forEach((msg: any) => {
        const d = new Date(msg.created_at);
        if (d >= sevenDaysAgo) {
          const dayIndex = Math.floor((d.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) dailyCounts[dayIndex]++;
        }
      });
      setGrowthData(dailyCounts);

      // Calculate Category Distribution
      const cats: Record<string, number> = {};
      p.forEach((proj: any) => {
        cats[proj.category] = (cats[proj.category] || 0) + 1;
      });
      const topCats = Object.entries(cats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      setCategoryStats({
        labels: topCats.map(([k]) => k),
        data: topCats.map(([, v]) => v)
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const subscription = supabase
      .channel('system_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, () => {
        fetchDashboardData(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);



  const dashboardStats = [
    { label: "Active Projects", value: stats.projects.toString(), icon: Briefcase, color: "text-[#ef4444]", trend: "+12%" },
    { label: "Unread Leads", value: stats.messages.toString(), icon: MessageSquare, color: "text-blue-500", trend: "+5%" },
    { label: "System Health", value: stats.errors > 0 ? `${stats.errors} ERRORS` : "NOMINAL", icon: ShieldCheck, color: stats.errors > 0 ? "text-red-500" : "text-green-500", trend: "100%" },
    { label: "Active Cards", value: stats.activeCards.toString(), icon: Zap, color: "text-orange-500", trend: "0" },
  ];

  const handleDeleteLog = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this log?")) return;
    try {
      await cmsService.deleteSystemLog(id);
      setRecentLogs(recentLogs.filter(l => l.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDeleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;
    try {
      await cmsService.deleteMessage(id);
      setRecentMessages(recentMessages.filter(m => m.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleClearAllLogs = async () => {
    if (!confirm("🚨 TRACE WIPE: Are you sure you want to delete ALL system logs? This cannot be undone.")) return;
    try {
      await cmsService.clearAllSystemLogs();
      setRecentLogs([]);
      setStats(prev => ({ ...prev, errors: 0 }));
    } catch (err) { console.error(err); }
  };

  const handleClearAllMessages = async () => {
    if (!confirm("📬 INBOX WIPE: Are you sure you want to delete ALL messages? This cannot be undone.")) return;
    try {
      await cmsService.clearAllMessages();
      setRecentMessages([]);
      setStats(prev => ({ ...prev, messages: 0 }));
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-12"
          >
            <div className="w-full max-w-sm space-y-8 text-center">
              <div className="relative flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border border-black/5 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Zap className="w-8 h-8 text-[#ef4444]" />
                  </motion.div>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-t-2 border-red-500 rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black tracking-[0.6em] uppercase opacity-40">System Initialization</p>
                <h2 className="text-4xl font-display font-black tracking-tighter uppercase">CALIBRATING...</h2>
              </div>
              <div className="w-full h-px bg-black/5 relative overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[#ef4444] w-1/3"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16 pb-20"
          >
        
        {/* Header: Cinematic Welcome */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-6">
              <Activity className="w-3 h-3" />
              <span>[ COMMAND CENTER v3.0 ]</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-black/10 pb-12">
              <h1 className="font-display text-[12vw] lg:text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
                SYSTEM<br />CONTROL
              </h1>
              <div className="lg:text-right">
                <p className="text-sm font-black tracking-[0.2em] uppercase mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-2 justify-end">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Live Link Established</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: DYNAMIC METRICS & GRAPH */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {dashboardStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-black/10 p-8 hover:border-black transition-all group flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</span>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <h2 className="font-display text-5xl font-black tracking-tighter leading-none">{stat.value}</h2>
                  <div className="h-4 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <LineGraph data={[10, 30, 20, 50, 40, 60]} color={stat.color.includes('red') ? '#ef4444' : '#000'} height={24} />
                  </div>
                </motion.div>
              ))}
           </div>

           {/* Main Visualization Bridge */}
           <div className="lg:col-span-8 bg-black text-white p-10 md:p-14 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60 mb-4 block">[ GROWTH ANALYSIS ]</span>
                  <h3 className="font-display text-5xl font-black tracking-tighter uppercase">Global Pulse</h3>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-display font-black text-[#ef4444]">{growthData.reduce((a, b) => a + b, 0)}</p>
                   <p className="text-[8px] font-black opacity-60 uppercase tracking-widest">7D INQUIRIES</p>
                </div>
             </div>

             <div className="flex-1 mt-10">
                <LineGraph data={growthData} color="#ef4444" height={180} />
             </div>

             <div className="mt-8 flex gap-10 pt-8 border-t border-white/20">
                <div className="flex-1">
                  <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-4">Category Distribution</p>
                  <BarGraph data={categoryStats.data} labels={categoryStats.labels} />
                </div>
                <div className="hidden md:block w-px bg-white/20" />
                <div className="hidden md:grid grid-cols-2 gap-x-10 gap-y-4 items-center">
                   {[
                     { l: "BOUNCE", v: "24%" },
                     { l: "LOAD", v: "0.8s" },
                     { l: "SECURE", v: "YES" },
                     { l: "CACHE", v: "HIT" },
                   ].map(x => (
                     <div key={x.l}>
                       <p className="text-[8px] font-black opacity-60 uppercase tracking-[0.2em]">{x.l}</p>
                       <p className="text-sm font-black">{x.v}</p>
                     </div>
                   ))}
                </div>
             </div>

             
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef4444]/10 blur-[80px] rounded-full" />
           </div>
        </section>

        {/* SECTION 2: LIVE FEED GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Latest Project Pipeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60">[ PROJECT PIPELINE ]</h3>
              <button onClick={() => navigate("/admin/projects")} className="text-[10px] font-black tracking-widest uppercase hover:text-red-500 transition-colors">View All</button>
            </div>
            <div className="bg-white border border-black/10 divide-y divide-black/10">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-5 flex items-center justify-between hover:bg-black/5 transition-colors group cursor-pointer" onClick={() => navigate(`/admin/projects`)}>
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-black/10 overflow-hidden">
                      <img src={project.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{project.title}</p>
                      <p className="text-[9px] font-medium opacity-60 uppercase">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[8px] font-black px-2 py-1 border border-black/20 uppercase">{project.status}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* System Diagnostics (LIVE LOGS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60">[ SYSTEM DIAGNOSTICS ]</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => logSystemEvent("Manual Test Trigger", "admin_dashboard", "error")}
                  className="text-[10px] font-black tracking-widest uppercase text-[#ef4444] hover:bg-[#ef4444]/20 px-2 py-1 transition-all font-bold"
                >
                  Test Trigger
                </button>
                <button onClick={handleClearAllLogs} className="text-[10px] font-black tracking-widest uppercase text-red-500/60 hover:text-red-500 transition-colors px-2 py-1">Clear</button>
                <button onClick={() => navigate("/admin/system-logs")} className="text-[10px] font-black tracking-widest uppercase hover:text-red-500 transition-colors px-2 py-1">Terminal</button>
              </div>
            </div>
            <div className="bg-black text-white p-8 space-y-5 font-mono text-[9px] min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-hide border border-white/10">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="flex flex-col gap-1 group/log border-l border-white/20 pl-4 hover:border-red-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-[2px] font-black text-[7px]",
                        log.level === 'error' ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                      )}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="opacity-50 uppercase tracking-tighter text-[7px] font-bold text-white">{log.source}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="opacity-40 text-[7px]">{new Date(log.created_at).toLocaleTimeString()}</span>

                       <button 
                        onClick={(e) => handleDeleteLog(e, log.id)}
                        className="opacity-0 group-hover/log:opacity-100 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="opacity-60 leading-relaxed">{log.message}</p>
                </div>
              )) : (
                <div className="flex items-center justify-center h-full opacity-20 py-16 uppercase tracking-[0.5em]">
                  Integrity Nominal
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: INCOMING COMMUNICATIONS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">[ INCOMING COMMUNICATIONS ]</h3>
            <button onClick={handleClearAllMessages} className="text-[10px] font-black tracking-widest uppercase text-red-500/40 hover:text-red-500 transition-colors">Wipe Inbox</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/admin/notifications")}
                className="bg-white border border-black/5 p-8 space-y-4 cursor-pointer hover:border-black transition-all relative group/msg"
              >
                <button 
                  onClick={(e) => handleDeleteMessage(e, msg.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover/msg:opacity-100 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-[9px] font-black">{msg.name[0]}</div>
                  <p className="text-[10px] font-black uppercase tracking-tight truncate flex-1">{msg.name}</p>
                </div>
                <p className="text-[11px] font-medium opacity-60 leading-relaxed line-clamp-2 uppercase">{msg.message}</p>
                <p className="text-[8px] font-black opacity-20 uppercase tracking-[0.2em]">{new Date(msg.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </section>

          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
