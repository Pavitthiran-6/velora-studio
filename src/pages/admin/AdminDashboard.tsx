import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  ArrowUpRight, 
  MoreHorizontal, 
  Plus, 
  Upload, 
  ExternalLink, 
  Trash2, 
  Edit3,
  Eye,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { cmsService } from "../../lib/cms-service";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    reviews: 0,
    homeCards: 0,
    messages: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [p, r, h, m] = await Promise.all([
          cmsService.getProjects(),
          cmsService.getReviews(),
          cmsService.getHomeCards(),
          cmsService.getMessages()
        ]);
        setStats({
          projects: p.length,
          reviews: r.length,
          homeCards: h.length,
          messages: m.filter((msg: any) => msg.status === 'unread').length
        });
        setRecentProjects(p.slice(0, 4));
        setRecentMessages(m.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

  const dashboardStats = [
    { label: "Total Projects", value: stats.projects.toString(), change: "LIVE" },
    { label: "Active Reviews", value: stats.reviews.toString(), change: "LIVE" },
    { label: "New Messages", value: stats.messages.toString(), change: "UNREAD" },
    { label: "Website Status", value: "ONLINE", change: "200 OK" },
  ];
  return (
    <AdminLayout>
      <div className="space-y-32">
        
        {/* TOP SECTION: Editorial Welcome */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-6 block">
              [ CONTROL CENTER ]
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <h1 className="font-display text-[12vw] lg:text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
                STUDIO<br />CONTROL
              </h1>
              <div className="lg:mb-4 lg:text-right">
                <p className="text-sm font-black tracking-[0.2em] uppercase mb-1">THURSDAY, 14 MAY 2026</p>
                <p className="text-[10px] font-medium opacity-40 uppercase">GMT +5:30 • LOCAL STUDIO TIME</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: PROJECT OVERVIEW (STATS) */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white border border-black/5 p-8 flex flex-col gap-8 cursor-pointer overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">{stat.label}</span>
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-7xl font-black tracking-tighter">{stat.value}</h2>
                  <p className="text-[10px] font-black tracking-[0.1em] text-green-500 mt-2 uppercase">{stat.change} THIS MONTH</p>
                </div>
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-black w-0 group-hover:w-full transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 2: PROJECT MANAGEMENT */}
        <section>
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ RECENT WORK ]</span>
              <h2 className="font-display text-5xl font-black tracking-tighter uppercase">Project Pipeline</h2>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 h-14 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3"
            >
              <Plus className="w-4 h-4" />
              CREATE PROJECT
            </motion.button>
          </div>

          <div className="bg-white border border-black/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Project</th>
                  <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Last Updated</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project, i) => (
                  <motion.tr 
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group border-b border-black/5 hover:bg-[#fafafa] transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/5 overflow-hidden rounded-lg">
                          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <span className="text-sm font-black tracking-tight uppercase">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border",
                        project.status === "Active" ? "border-green-500 text-green-500" :
                        project.status === "Review" ? "border-yellow-500 text-yellow-500" :
                        project.status === "Completed" ? "border-black text-black" : "border-black/20 text-black/40"
                      )}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-medium opacity-40 uppercase">{project.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-medium opacity-40 uppercase">{project.updated}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-black hover:text-white transition-all rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-[#ef4444] hover:text-white transition-all rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: MEDIA MANAGEMENT (DRAG & DROP) */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ MEDIA ASSETS ]</span>
              <h2 className="font-display text-5xl font-black tracking-tighter uppercase mb-6">Digital Vault</h2>
              <p className="text-sm font-medium opacity-40 uppercase max-w-[400px] leading-relaxed mb-8">
                Upload and manage high-fidelity cinematic assets. Drag and drop your RAW files directly into the studio mainframe.
              </p>
              <div className="flex gap-4">
                <div className="px-6 py-3 border border-black/10 text-[9px] font-black tracking-[0.2em] uppercase">MAX FILE: 500MB</div>
                <div className="px-6 py-3 border border-black/10 text-[9px] font-black tracking-[0.2em] uppercase">FORMATS: JPG, MP4, WEBP</div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative group h-[400px] border-2 border-dashed border-black/10 bg-white flex flex-col items-center justify-center cursor-pointer transition-all hover:border-black/40 overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-display font-black tracking-tighter uppercase mb-1">Drop Cinematic Content</p>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">OR CLICK TO BROWSE LOCAL STORAGE</p>
                  </div>
                </div>
                
                {/* Background Particles Effect (Simplified) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ANALYTICS & MESSAGES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Analytics (Simplified B&W Chart Visualization) */}
          <div className="bg-black text-white p-12 overflow-hidden relative">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-12 block">[ ANALYTICS ]</span>
            <h3 className="font-display text-4xl font-black tracking-tighter uppercase mb-12">Engagement Velocity</h3>
            
            <div className="flex items-end gap-3 h-[200px] mb-12">
              {[40, 70, 45, 90, 65, 80, 100, 55, 75, 60, 85, 95].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="flex-1 bg-white/20 hover:bg-[#ef4444] transition-colors relative group"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black">
                    {height}%
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-between items-center border-t border-white/10 pt-8">
              <div className="flex gap-12">
                <div>
                  <p className="text-3xl font-display font-black">8.4K</p>
                  <p className="text-[8px] font-black tracking-[0.2em] uppercase opacity-40 mt-1">UNIQUE VISITS</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-black">02:14</p>
                  <p className="text-[8px] font-black tracking-[0.2em] uppercase opacity-40 mt-1">AVG SESSION</p>
                </div>
              </div>
              <button className="text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/20 pb-1 hover:border-white transition-all flex items-center gap-2">
                FULL REPORT <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Messages / Inbox */}
          <div className="bg-white border border-black/5 p-12">
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-2 block">[ INBOX ]</span>
                <h3 className="font-display text-4xl font-black tracking-tighter uppercase">Studio Comms</h3>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-black text-white px-3 py-1">{stats.messages} NEW</span>
            </div>

            <div className="space-y-6">
              {recentMessages.map((msg, i) => (
                <motion.div 
                  key={msg.id}
                  whileHover={{ x: 10 }}
                  className="group p-6 border border-black/5 hover:border-black/20 cursor-pointer flex justify-between items-center"
                >
                  <div className="flex gap-6 items-center">
                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-[10px] font-black">
                      {msg.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight uppercase mb-0.5">{msg.name}</p>
                      <p className="text-[10px] font-medium opacity-40 uppercase tracking-tighter truncate max-w-[200px]">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/admin/notifications")}
                className="w-full py-4 border border-black/10 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
              >
                VIEW ALL MESSAGES
              </motion.button>
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
