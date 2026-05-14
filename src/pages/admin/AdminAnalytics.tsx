import React from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  MousePointer2,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap,
  Activity,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const METRICS = [
  { label: "UNIQUE VISITORS", val: "48.2K", change: "+12.4%", trend: "up" },
  { label: "AVG. SESSION", val: "04:12", change: "+02:10", trend: "up" },
  { label: "BOUNCE RATE", val: "24.5%", change: "-4.2%", trend: "down" },
  { label: "CONVERSION", val: "3.8%", change: "+1.2%", trend: "up" },
];

const DEVICE_DATA = [
  { label: "DESKTOP", val: "65%", color: "bg-black" },
  { label: "MOBILE", val: "28%", color: "bg-black/40" },
  { label: "TABLET", val: "7%", color: "bg-black/10" },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ STUDIO INTELLIGENCE ]</span>
            <h1 className="font-display text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              ANALYTICS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 h-14 border border-black/5 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              LAST 30 DAYS
            </button>
          </div>
        </div>

        {/* Top Tier Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white border border-black/5 p-10 space-y-8 group hover:border-black transition-all duration-500"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">{m.label}</span>
                <div className={cn(
                  "p-2 rounded-lg",
                  m.trend === "up" ? "bg-green-500/5 text-green-500" : "bg-[#ef4444]/5 text-[#ef4444]"
                )}>
                  {m.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-6xl font-black tracking-tighter">{m.val}</h3>
                <p className={cn(
                  "text-[9px] font-black tracking-[0.1em] uppercase",
                  m.trend === "up" ? "text-green-500" : "text-[#ef4444]"
                )}>{m.change} FROM LAST PERIOD</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Visualization */}
        <section className="bg-black text-white p-12 lg:p-24 overflow-hidden relative">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16">
            <div className="lg:w-1/3 space-y-12">
              <div>
                <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-8 block">[ TRAFFIC VELOCITY ]</span>
                <h2 className="font-display text-5xl font-black tracking-tighter uppercase mb-6 leading-none">Global Reach</h2>
                <p className="text-sm font-medium opacity-40 uppercase leading-relaxed">
                  Real-time visualization of studio engagement across international territories.
                </p>
              </div>
              
              <div className="space-y-8">
                {[
                  { country: "UNITED STATES", perc: 42 },
                  { country: "UNITED KINGDOM", perc: 18 },
                  { country: "GERMANY", perc: 12 },
                  { country: "OTHER", perc: 28 },
                ].map(c => (
                  <div key={c.country} className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black tracking-[0.2em] uppercase">
                      <span className="opacity-40">{c.country}</span>
                      <span>{c.perc}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.perc}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[#ef4444]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-[400px] border border-white/5 bg-white/5 backdrop-blur-3xl p-12 flex items-end gap-3 group">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.random() * 80 + 20}%` }}
                  transition={{ duration: 1, delay: i * 0.03 }}
                  className="flex-1 bg-white/10 hover:bg-white transition-all relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lower Grid: Devices & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Device Distribution */}
          <div className="lg:col-span-4 bg-white border border-black/5 p-12 space-y-12">
            <div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 mb-4 block">[ ECOSYSTEM ]</span>
              <h3 className="font-display text-4xl font-black tracking-tighter uppercase">Device Split</h3>
            </div>
            <div className="space-y-8">
              {DEVICE_DATA.map(d => (
                <div key={d.label} className="flex items-center gap-6">
                  <div className={cn("w-3 h-3 rounded-full", d.color)} />
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{d.label}</span>
                    <span className="font-display text-3xl font-black">{d.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-black/5 flex justify-center">
              <div className="relative w-48 h-48 rounded-full border-[20px] border-black/5 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-display font-black">100%</p>
                  <p className="text-[8px] font-black opacity-30 tracking-widest uppercase">SYNCED</p>
                </div>
                {/* Visual ring element */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="86" fill="transparent" stroke="black" strokeWidth="20" strokeDasharray="540" strokeDashoffset="140" className="opacity-100" />
                </svg>
              </div>
            </div>
          </div>

          {/* Top Portfolio Projects */}
          <div className="lg:col-span-8 bg-white border border-black/5 p-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 mb-4 block">[ ATTENTION ]</span>
                <h3 className="font-display text-4xl font-black tracking-tighter uppercase">Top Performance</h3>
              </div>
              <button className="text-[10px] font-black tracking-[0.2em] uppercase border-b border-black/20 pb-1 hover:border-black transition-all">VIEW FULL ARCHIVE</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Sling Shot Branding", views: "12.4K", time: "05:12" },
                { name: "Nexus Experience", views: "8.2K", time: "04:30" },
                { name: "Lumina App Design", views: "7.1K", time: "03:45" },
                { name: "Vertex Motion Clip", views: "5.8K", time: "02:10" },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-6 border border-black/5 hover:bg-black hover:text-white transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black opacity-20 group-hover:opacity-100">0{i+1}</span>
                    <span className="text-base font-black tracking-tighter uppercase">{p.name}</span>
                  </div>
                  <div className="flex gap-12 text-right">
                    <div>
                      <p className="text-xl font-display font-black">{p.views}</p>
                      <p className="text-[8px] font-black tracking-[0.2em] uppercase opacity-30 group-hover:opacity-60">VIEWS</p>
                    </div>
                    <div>
                      <p className="text-xl font-display font-black">{p.time}</p>
                      <p className="text-[8px] font-black tracking-[0.2em] uppercase opacity-30 group-hover:opacity-60">TIME</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
