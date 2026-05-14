import React from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  UserPlus,
  ArrowRight,
  ShieldAlert,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: "1", type: "system", title: "Core Kernel Update", desc: "Studio OS updated to v2.0.4 with enhanced WebGL performance.", time: "12m ago", icon: Zap, color: "text-blue-500" },
  { id: "2", type: "alert", title: "Security Breach Attempt", desc: "Unauthorized login attempt from IP 192.168.1.1 blocked.", time: "2h ago", icon: ShieldAlert, color: "text-[#ef4444]" },
  { id: "3", type: "message", title: "New Inquiry: Sarah Jenkins", desc: "Interested in the 'Nexus Experience' for their upcoming launch.", time: "5h ago", icon: MessageSquare, color: "text-green-500" },
  { id: "4", type: "user", title: "New Collaborator", desc: "David Miller joined the Creative Team as Motion Designer.", time: "1d ago", icon: UserPlus, color: "text-purple-500" },
  { id: "5", type: "success", title: "Upload Complete", desc: "8K Cinematic renders for 'Sling Shot' successfully archived.", time: "2d ago", icon: CheckCircle2, color: "text-green-500" },
];

export default function AdminNotifications() {
  const [filter, setFilter] = React.useState<"all" | "inquiry" | "error">("all");
  const [liveInquiries, setLiveInquiries] = React.useState<any[]>([]);

  React.useEffect(() => {
    const syncInquiries = () => {
      const data = JSON.parse(localStorage.getItem("studio_inquiries") || "[]");
      setLiveInquiries(data);
    };
    syncInquiries();
    window.addEventListener('storage', syncInquiries);
    const interval = setInterval(syncInquiries, 2000);
    return () => {
      window.removeEventListener('storage', syncInquiries);
      clearInterval(interval);
    };
  }, []);

  const displayNotifications = React.useMemo(() => {
    const combined = [...liveInquiries, ...SYSTEM_ERRORS, ...NOTIFICATIONS];
    if (filter === "all") return combined;
    if (filter === "inquiry") return combined.filter(n => n.type === "message");
    if (filter === "error") return combined.filter(n => n.type === "alert");
    return combined;
  }, [filter, liveInquiries]);

  return (
    <AdminLayout>
      <div className="space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ SYSTEM ALERTS ]</span>
            <h1 className="font-display text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              SIGNALS
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="px-8 h-14 border border-black/5 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all">
              MARK ALL AS READ
            </button>
          </div>
        </div>

        {/* Filter System */}
        <div className="flex flex-wrap items-center gap-4 border-b border-black/5 pb-8">
          <button 
            onClick={() => setFilter("all")}
            className={cn(
              "px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-4 transition-all",
              filter === "all" ? "bg-black text-white" : "bg-[#fafafa] text-black border border-black/5 hover:border-black"
            )}
          >
            ALL SIGNALS <span className="opacity-40 text-[9px]">[{displayNotifications.length}]</span>
          </button>
          <button 
            onClick={() => setFilter("inquiry")}
            className={cn(
              "px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-4 transition-all",
              filter === "inquiry" ? "bg-black text-white" : "bg-[#fafafa] text-black border border-black/5 hover:border-black"
            )}
          >
            INQUIRIES <span className={cn("text-[9px]", filter === "inquiry" ? "text-white/40" : "text-[#ef4444]")}>
              [{liveInquiries.length}]
            </span>
          </button>
          <button 
            onClick={() => setFilter("error")}
            className={cn(
              "px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-4 transition-all",
              filter === "error" ? "bg-black text-white" : "bg-[#fafafa] text-black border border-black/5 hover:border-black"
            )}
          >
            ERRORS <span className={cn("text-[9px]", filter === "error" ? "text-white/40" : "text-[#ef4444]")}>
              [{displayNotifications.filter(n => n.type === "alert").length}]
            </span>
          </button>
        </div>

        {/* Notifications Timeline */}
        <div className="max-w-[1000px]">
          <div className="space-y-4">
            {displayNotifications.map((note, i) => {
              const Icon = note.icon === "MessageSquare" ? MessageSquare : note.icon;
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative bg-white border border-black/5 p-8 flex items-start gap-8 hover:border-black/20 transition-all cursor-pointer"
                >
                  <div className={cn("mt-1 p-3 rounded-xl bg-black/5 transition-colors group-hover:bg-black group-hover:text-white", note.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-black tracking-tight uppercase group-hover:text-[#ef4444] transition-colors">{note.title}</h3>
                        {note.type === "message" && <span className="px-2 py-0.5 bg-[#ef4444] text-white text-[7px] font-black tracking-widest uppercase rounded-sm">NEW LEAD</span>}
                      </div>
                      <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">{note.time}</span>
                    </div>
                    <p className="text-xs font-medium opacity-40 uppercase max-w-[800px] leading-relaxed">
                      {note.desc}
                    </p>
                    {note.email && <p className="text-[9px] font-black text-[#ef4444] uppercase mt-2 tracking-widest">{note.email}</p>}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[2px] bg-black w-0 group-hover:w-full transition-all duration-700"
                  />
                </motion.div>
              );
            })}
            {displayNotifications.length === 0 && (
              <div className="p-20 border border-dashed border-black/10 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert className="w-12 h-12 opacity-10" />
                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-20 text-center">NO SIGNALS DETECTED IN THIS FREQUENCY</p>
              </div>
            )}
          </div>
        </div>

        {/* System Health Section */}
        <section className="p-12 border border-black/5 bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "FRONTEND KERNEL", val: "STABLE", status: "OPTIMAL", color: "text-green-500" },
              { label: "SUPABASE VAULT", val: "CONNECTED", status: "SECURE", color: "text-green-500" },
              { label: "BACKEND API", val: "ACTIVE", status: "FAST", color: "text-green-500" }
            ].map(s => (
              <div key={s.label} className="space-y-4">
                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20">{s.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-black uppercase">{s.val}</span>
                  <span className={cn("text-[9px] font-black uppercase", s.color)}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}

// MOCK SYSTEM ERRORS (Detecting Stack Failures)
const SYSTEM_ERRORS = [
  { 
    id: "err_1", 
    type: "alert", 
    title: "Supabase Vault Timeout", 
    desc: "Connection to cloud database interrupted. Retrying handshake in 5s...", 
    time: "4m ago", 
    icon: ShieldAlert, 
    color: "text-[#ef4444]",
    source: "SUPABASE"
  },
  { 
    id: "err_2", 
    type: "alert", 
    title: "Backend API 500", 
    desc: "Endpoint /api/admin/home-cards returned an internal server error. Check stack logs.", 
    time: "15m ago", 
    icon: ShieldAlert, 
    color: "text-[#ef4444]",
    source: "BACKEND"
  },
  { 
    id: "err_3", 
    type: "alert", 
    title: "Frontend Hydration Mismatch", 
    desc: "React hydration failed on route /work. Possible SSR conflict detected.", 
    time: "1h ago", 
    icon: ShieldAlert, 
    color: "text-[#ef4444]",
    source: "FRONTEND"
  }
];
