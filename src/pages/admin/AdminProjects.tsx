import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Edit3,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  X,
  Zap,
  Check,
  Layout as LayoutIcon,
  Globe,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "../../components/SmoothScrollProvider";

const PROJECTS = [
  { id: "1", name: "Sling Shot Branding", status: "Active", category: "Branding", updated: "2h ago", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" },
  { id: "2", name: "Lumina App Design", status: "Review", category: "UI/UX", updated: "5h ago", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400" },
  { id: "3", name: "Vertex Motion Clip", status: "Completed", category: "Motion", updated: "1d ago", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400" },
  { id: "4", name: "Nexus Web Experience", status: "Planning", category: "Web Dev", updated: "3d ago", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" },
  { id: "5", name: "Aura Identity System", status: "Active", category: "Identity", updated: "4d ago", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400" },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("studio_projects");
    return saved ? JSON.parse(saved) : PROJECTS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    category: "Branding",
    image: ""
  });
  const modalRootRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("studio_projects", JSON.stringify(projects));
  }, [projects]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    if (isModalOpen && scrollContainer) {
      scrollContainer.style.overflow = 'hidden';
    } else if (scrollContainer) {
      scrollContainer.style.overflow = '';
    }
    return () => {
      if (scrollContainer) scrollContainer.style.overflow = '';
    };
  }, [isModalOpen]);

  // NATIVE EVENT BLOCKER
  useEffect(() => {
    const blocker = (e: WheelEvent | TouchEvent) => {
      e.stopPropagation();
    };

    const el = modalRootRef.current;
    if (isModalOpen && el) {
      el.addEventListener('wheel', blocker, { passive: true });
      el.addEventListener('touchmove', blocker, { passive: true });
    }

    return () => {
      if (el) {
        el.removeEventListener('wheel', blocker);
        el.removeEventListener('touchmove', blocker);
      }
    };
  }, [isModalOpen]);

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        status: project.status,
        category: project.category,
        image: project.image
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        status: "Active",
        category: "Branding",
        image: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map((p: any) => p.id === editingProject.id ? { ...p, ...formData } : p));
    } else {
      const newProject = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        updated: "Just now"
      };
      setProjects([newProject, ...projects]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-16">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ PORTFOLIO MANAGEMENT ]</span>
            <h1 className="font-display text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              PROJECTS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                className="bg-transparent border border-black/5 px-12 h-14 text-[10px] font-black tracking-[0.2em] uppercase focus:border-black outline-none transition-all w-[300px]"
              />
            </div>
            <button className="h-14 w-14 border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="px-8 h-14 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3"
            >
              <Plus className="w-4 h-4" />
              NEW PROJECT
            </motion.button>
          </div>
        </div>

        {/* Project List Table View */}
        <section className="bg-white border border-black/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-[#fafafa]">
                <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Project Details</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Status</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Category</th>
                <th className="px-8 py-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Last Sync</th>
                <th className="px-8 py-6 text-right text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Control</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project: any, i: number) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group border-b border-black/5 hover:bg-[#fafafa] transition-colors cursor-pointer"
                >
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-24 bg-black/5 overflow-hidden relative">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-base font-black tracking-tighter uppercase block group-hover:text-[#ef4444] transition-colors">{project.name}</span>
                        <div className="flex items-center gap-2 opacity-30 text-[9px] font-black tracking-[0.2em]">
                          <LinkIcon className="w-3 h-3" />
                          <span>PROJECT-ID-{project.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={cn(
                      "text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border",
                      project.status === "Active" ? "border-green-500 text-green-500" :
                        project.status === "Review" ? "border-yellow-500 text-yellow-500" :
                          project.status === "Completed" ? "border-black text-black" : "border-black/20 text-black/40"
                    )}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 opacity-20" />
                      <span className="text-[10px] font-black tracking-[0.1em] uppercase opacity-40">{project.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-medium opacity-40 uppercase">{project.updated}</span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenModal(project)}
                        className="w-10 h-10 border border-black/5 flex items-center justify-center transition-all rounded-full group/btn"
                      >
                        <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#ef4444", color: "#fff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (confirm("ARCHIVE THIS WORK?")) {
                            setProjects(projects.filter((p: any) => p.id !== project.id));
                          }
                        }}
                        className="w-10 h-10 border border-black/5 flex items-center justify-center transition-all rounded-full group/btn shadow-none"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer Stats for Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "PUBLISHED", val: "42" },
            { label: "DRAFTS", val: "12" },
            { label: "ARCHIVED", val: "84" }
          ].map((s) => (
            <div key={s.label} className="p-10 border border-black/5 bg-white flex flex-col items-center">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 mb-4">{s.label}</span>
              <span className="font-display text-5xl font-black">{s.val}</span>
            </div>
          ))}
        </div>

        {/* PREMIUM MODAL SYSTEM */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              ref={modalRootRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] overflow-y-auto custom-scrollbar"
            >
              <SmoothScrollProvider containerRef={modalRootRef} ease={0.12}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xl cursor-crosshair"
                />

                <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                  <motion.div
                    ref={modalContainerRef}
                    initial={{ scale: 0.96, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.96, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-[92vw] md:w-[88vw] max-w-[1450px] max-h-[92vh] lg:max-h-[88vh] bg-white rounded-[28px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row overflow-hidden z-10"
                  >
                    {/* LEFT: CINEMATIC PREVIEW PANEL (35%) */}
                    <div className="lg:w-[35%] bg-[#0a0a0a] flex flex-col items-center justify-center relative p-8 lg:p-12 overflow-hidden border-r border-white/5 shrink-0 min-h-[300px] lg:min-h-0">
                      <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,#ef44440a_0%,transparent_60%)]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-30" />
                      </div>

                      <div className="absolute top-8 left-8 text-[9px] font-black tracking-[0.4em] uppercase text-white/30 z-10 flex items-center gap-4">
                        <LayoutIcon className="w-3 h-3" />
                        [ CASE STUDY PREVIEW ]
                      </div>

                      {/* Cinematic Project Preview (Premium 320x400) */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-full max-w-[320px] aspect-[4/5] bg-white/5 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 group mt-8 lg:mt-0"
                      >
                        <img
                          src={formData.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"}
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                        <div className="absolute bottom-10 left-10 right-10 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#ef4444]">{formData.category || "SERVICE"}</span>
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">{formData.status || "STATUS"}</span>
                          </div>
                          <h4 className="text-4xl font-display font-black uppercase tracking-tighter text-white leading-[0.9]">
                            {formData.name || "PROJECT TITLE"}
                          </h4>
                        </div>

                        <div className="absolute top-10 right-10 w-12 h-12 border border-white/20 flex items-center justify-center backdrop-blur-md">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    {/* RIGHT: BRUTAL FORM ENGINE (65%) */}
                    <div className="lg:w-[65%] bg-white flex flex-col flex-1 relative overflow-hidden min-h-0">
                      {/* Form Header (Static) */}
                      <div className="px-8 md:px-12 lg:px-[56px] pt-8 md:pt-12 lg:pt-[56px] pb-6 shrink-0">
                        <div className="flex justify-between items-start">
                          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                            <span className="text-[9px] font-black tracking-[0.5em] uppercase opacity-30 block mb-2">[ CMS ENGINE ]</span>
                            <h3 className="font-display text-4xl lg:text-5xl font-black uppercase tracking-[-0.04em] leading-none">Project Meta</h3>
                          </motion.div>
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 group shrink-0"
                          >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                          </button>
                        </div>
                      </div>

                      {/* Form Scrollable Body */}
                      <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <SmoothScrollProvider containerRef={formScrollRef} ease={0.12}>
                          <div
                            ref={formScrollRef}
                            className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-[56px] space-y-8 pb-10 custom-scrollbar"
                          >
                            {/* Image Section */}
                            <div className="space-y-4 pt-2">
                              <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30">Main Project Asset</label>
                              <div className="flex items-center gap-6">
                                <div className="w-32 h-20 bg-black/5 border border-black/10 overflow-hidden shrink-0 flex items-center justify-center group">
                                  {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 opacity-20" />
                                  )}
                                </div>
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-transparent border-b border-black/10 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-black transition-all pr-12"
                                    placeholder="PASTE URL OR UPLOAD PROTOCOL →"
                                  />
                                  <label className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#ef4444] transition-colors p-3">
                                    <Plus className="w-5 h-5" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Text Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                              <div className="space-y-3 group md:col-span-2">
                                <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Project Name</label>
                                <input
                                  type="text"
                                  required
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  className="w-full bg-transparent border-b border-black/10 py-2.5 text-2xl font-display uppercase outline-none focus:border-black transition-all"
                                  placeholder="CLIENT NAME"
                                />
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Category</label>
                                <select
                                  value={formData.category}
                                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                  className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                >
                                  {["Branding", "UI/UX", "Motion", "Web Dev", "Identity"].map(c => (
                                    <option key={c} value={c} className="bg-white text-black">{c.toUpperCase()}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Launch Status</label>
                                <select
                                  value={formData.status}
                                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                  className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                >
                                  {["Active", "Review", "Completed", "Planning"].map(s => (
                                    <option key={s} value={s} className="bg-white text-black">{s.toUpperCase()}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Info Banner */}
                            <div className="p-8 bg-[#fafafa] border border-black/5 flex items-center gap-6">
                              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                                <Globe className="w-5 h-5 opacity-20" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Live Deployment</p>
                                <p className="text-[8px] font-medium opacity-40 uppercase leading-relaxed">This project will be broadcasted to the main portfolio and cinematic gallery sections upon saving.</p>
                              </div>
                            </div>
                          </div>
                        </SmoothScrollProvider>

                        {/* Footer / Save Button (Static) */}
                        <div className="px-8 md:px-12 lg:px-[56px] py-8 border-t border-black/5 shrink-0 bg-white">
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01, backgroundColor: "#000", color: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-5 bg-black text-white text-[10px] font-black tracking-[0.5em] uppercase flex items-center justify-center gap-4 transition-all rounded-sm"
                          >
                            <Zap className="w-4 h-4 fill-white" />
                            SAVE PROJECT DATA
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </div>
              </SmoothScrollProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
