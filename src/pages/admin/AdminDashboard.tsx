import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { cmsService } from "../../lib/cms-service";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    reviews: 0,
    messages: 0,
    errors: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [p, r, m, l] = await Promise.all([
          cmsService.getProjects(),
          cmsService.getReviews(),
          cmsService.getMessages(),
          cmsService.getSystemLogs()
        ]);
        
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        setStats({
          projects: p.length,
          reviews: r.length,
          messages: m.filter((msg: any) => msg.status === 'unread').length,
          errors: l.filter((log: any) => log.level === 'error' && new Date(log.created_at) > last24h).length
        });
        
        setRecentProjects(p.slice(0, 5));
        setRecentMessages(m.slice(0, 4));
        setRecentLogs(l.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();

    // ⚡ REALTIME: Listen for new logs and update immediately
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
    { label: "Active Projects", value: stats.projects.toString(), icon: FolderKanban, color: "text-black" },
    { label: "Unread Leads", value: stats.messages.toString(), icon: Bell, color: "text-blue-500" },
    { label: "System Health", value: stats.errors > 0 ? `${stats.errors} ERRORS` : "NOMINAL", icon: Shield, color: stats.errors > 0 ? "text-red-500" : "text-green-500" },
    { label: "Total Reviews", value: stats.reviews.toString(), icon: Star, color: "text-yellow-500" },
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
      <div className="space-y-20">
        
        {/* Header: Cinematic Welcome */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-6 block">
              [ COMMAND CENTER PROTOCOL ]
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-black/5 pb-12">
              <h1 className="font-display text-[12vw] lg:text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
                SYSTEM<br />OVERVIEW
              </h1>
              <div className="lg:text-right">
                <p className="text-sm font-black tracking-[0.2em] uppercase mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[10px] font-medium opacity-40 uppercase">LIVE DATA STREAMING ACTIVE</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: DYNAMIC METRICS */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {dashboardStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/5 p-10 hover:bg-black hover:text-white transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</span>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <h2 className="font-display text-7xl font-black tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left">{stat.value}</h2>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: LIVE FEED GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Latest Project Pipeline */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">[ PROJECT PIPELINE ]</h3>
              <button onClick={() => navigate("/admin/projects")} className="text-[10px] font-black tracking-widest uppercase hover:text-red-500 transition-colors">View All</button>
            </div>
            <div className="bg-white border border-black/5 divide-y divide-black/5">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-6 flex items-center justify-between hover:bg-black/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-black/5 rounded overflow-hidden">
                      <img src={project.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{project.title}</p>
                      <p className="text-[9px] font-medium opacity-40 uppercase">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black px-3 py-1 border border-black/10 uppercase">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Diagnostics (LIVE LOGS) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">[ SYSTEM DIAGNOSTICS ]</h3>
              <div className="flex gap-4">
                <button onClick={handleClearAllLogs} className="text-[10px] font-black tracking-widest uppercase text-red-500/40 hover:text-red-500 transition-colors">Clear All</button>
                <button onClick={() => navigate("/admin/system-logs")} className="text-[10px] font-black tracking-widest uppercase hover:text-red-500 transition-colors">Terminal</button>
              </div>
            </div>
            <div className="bg-black text-white/80 p-8 space-y-6 font-mono text-[10px] min-h-[300px] overflow-hidden">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="flex items-center group/log">
                  <div className="flex gap-4 border-l border-white/10 pl-4 hover:border-red-500 transition-colors flex-1 min-w-0">
                    <span className={cn("shrink-0", log.level === 'error' ? "text-red-500" : "text-yellow-500")}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <p className="truncate opacity-60">{log.message}</p>
                    <span className="ml-auto opacity-20 hidden md:block">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteLog(e, log.id)}
                    className="ml-4 opacity-0 group-hover/log:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )) : (
                <div className="flex items-center justify-center h-full opacity-20 py-20 uppercase tracking-[0.5em]">
                  Integrity Nominal
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: INCOMING COMMUNICATIONS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">[ INCOMING COMMUNICATIONS ]</h3>
            <button onClick={handleClearAllMessages} className="text-[10px] font-black tracking-widest uppercase text-red-500/40 hover:text-red-500 transition-colors">Clear All Messages</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                whileHover={{ y: -5 }}
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
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-black">{msg.name[0]}</div>
                  <p className="text-[10px] font-black uppercase tracking-tight">{msg.name}</p>
                </div>
                <p className="text-xs font-medium opacity-60 leading-relaxed line-clamp-2 uppercase">{msg.message}</p>
                <p className="text-[8px] font-black opacity-20 uppercase tracking-[0.2em]">{new Date(msg.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
