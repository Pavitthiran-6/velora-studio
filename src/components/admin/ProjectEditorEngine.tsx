import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Layers,
  Zap,
  Globe,
  Monitor,
  Check,
  ChevronDown,
  Video,
  Layout as LayoutIcon,
  Play,
  X,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectService, ProjectMetric, ProjectMilestone, ProjectMobileView } from "../../types/project";
import { SmoothScrollProvider } from "../../components/SmoothScrollProvider";
import { MediaUploader } from "./MediaUploader";

const SECTIONS = [
  { id: 'core', label: 'CORE DATA', icon: Zap },
  { id: 'hero', label: 'HERO SECTION', icon: LayoutIcon },
  { id: 'services', label: 'SERVICES', icon: Layers },
  { id: 'metrics', label: 'METRICS', icon: Check },
  { id: 'shuffle', label: 'SHUFFLE SYSTEM', icon: Layers },
  { id: 'mission', label: 'MISSION STORY', icon: Globe },
  { id: 'video', label: 'CINEMATIC VIDEO', icon: Video },
  { id: 'mobile', label: 'MOBILE VIEWS', icon: Monitor },
  { id: 'milestones', label: 'MILESTONES', icon: Layers },
];

interface ProjectEditorEngineProps {
  projectId: string;
  onClose: () => void;
}

import { cmsService } from "../../lib/cms-service";

export function ProjectEditorEngine({ projectId, onClose }: ProjectEditorEngineProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState('core');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const p = await cmsService.getProjectById(projectId);
        if (p) setProject(p);
      } catch (err) {
        console.error("Failed to load project:", err);
      }
    };
    loadProject();
  }, [projectId]);

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      await cmsService.saveProject(project, project.id);
      setIsSaving(false);
      setShowSuccess(true);
      window.dispatchEvent(new Event('cms-update'));
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const addService = () => {
    const newService: ProjectService = { id: Math.random().toString(36).substr(2, 9), label: "NEW SERVICE" };
    setProject({ ...project, services: [...project.services, newService] });
  };

  const addMetric = () => {
    const newMetric: ProjectMetric = { 
      id: Math.random().toString(36).substr(2, 9), 
      number: "00", symbol: "%", title: "METRIC TITLE", description: "DESCRIPTION" 
    };
    setProject({ ...project, metrics: [...project.metrics, newMetric] });
  };

  const addMilestone = () => {
    const newMilestone: ProjectMilestone = {
      id: Math.random().toString(36).substr(2, 9),
      year: "2026", title: "MILESTONE TITLE", category: "CATEGORY"
    };
    setProject({ ...project, milestones: [...project.milestones, newMilestone] });
  };

  const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-12">
      <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-30 block mb-2">[ {subtitle} ]</span>
      <h2 className="font-display text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">{title}</h2>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      
      {/* LEFT: PREVIEW & NAVIGATION (40%) */}
      <aside className="lg:w-[35%] bg-[#171c44] flex flex-col relative overflow-hidden border-r border-white/5 shrink-0">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,#ef44440a_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-30" />
        </div>

        <div className="relative z-10 p-8 lg:p-12 flex flex-col h-full min-h-0">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4 text-[9px] font-black tracking-[0.4em] uppercase text-white/30">
              <Zap className="w-3 h-3" />
              [ EDITOR ENGINE ]
            </div>
            <div className="flex items-center gap-2">
               <span className={cn(
                 "w-2 h-2 rounded-full",
                 project.status === 'Published' ? "bg-green-500" : "bg-yellow-500"
               )} />
               <span className="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">{project.status}</span>
            </div>
          </div>

          <div className="mb-8">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-16 bg-[#ef4444] text-white flex items-center justify-center gap-4 shadow-xl transition-all"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : showSuccess ? (
                <Check className="w-5 h-5" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase">SYNC SYSTEM</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-4 custom-scrollbar">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 group",
                  activeSection === s.id ? "bg-white/10 text-white shadow-2xl" : "hover:bg-white/5 text-white/20 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <s.icon className={cn("w-4 h-4", activeSection === s.id ? "text-[#ef4444]" : "text-white/20")} />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase">{s.label}</span>
                </div>
                {activeSection === s.id && <motion.div layoutId="activeIndicator" className="w-1 h-1 bg-[#ef4444] rounded-full" />}
              </button>
            ))}
          </div>

          <div className="mt-8">
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6 group cursor-default">
                <div className="w-12 h-16 bg-white/5 overflow-hidden rounded-lg shrink-0">
                   <img src={project.coverImage} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 truncate">{project.category}</p>
                   <p className="text-sm font-display font-black text-white uppercase truncate">{project.title}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* RIGHT: EDITOR SURFACE (65%) */}
      <main className="lg:w-[65%] bg-white flex flex-col relative overflow-hidden">
        <div className="px-8 md:px-12 lg:px-[64px] pt-8 md:pt-12 lg:pt-[64px] pb-6 shrink-0 flex justify-between items-start">
           <div />
           <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
        </div>

        <SmoothScrollProvider containerRef={formScrollRef} ease={0.12}>
          <div ref={formScrollRef} className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-[64px] pb-32 space-y-16 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeSection === 'core' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="CORE IDENTITY" subtitle="PHASE 01" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <InputField label="Project Title" value={project.title} onChange={v => setProject({ ...project, title: v })} />
                      <InputField label="Category Label" value={project.category} onChange={v => setProject({ ...project, category: v })} />
                      <div className="md:col-span-2">
                        <MediaUploader 
                          label="Cover Image Protocol" 
                          value={project.coverImage} 
                          onChange={v => setProject({ ...project, coverImage: v })} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'hero' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="HERO ENGINE" subtitle="VISUAL IMPACT" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <InputField label="Giant Title" value={project.heroTitle || ""} onChange={v => setProject({ ...project, heroTitle: v })} />
                      <InputField label="Release Date" value={project.heroDate || ""} onChange={v => setProject({ ...project, heroDate: v })} />
                    </div>
                  </div>
                )}

                {activeSection === 'services' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="STUDIO SERVICES" subtitle="DYNAMIC REPEATER" />
                    <div className="space-y-4">
                      {project.services.map((s, i) => (
                        <div key={s.id} className="flex gap-4 items-center group">
                          <span className="text-[10px] font-black opacity-20">0{i + 1}</span>
                          <input
                            value={s.label}
                            onChange={e => {
                              const newServices = [...project.services];
                              newServices[i].label = e.target.value;
                              setProject({ ...project, services: newServices });
                            }}
                            className="flex-1 bg-transparent border-b border-black/5 py-4 text-xl font-display uppercase focus:border-black outline-none"
                          />
                          <button 
                            onClick={() => setProject({ ...project, services: project.services.filter(serv => serv.id !== s.id) })}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addService}
                        className="w-full py-6 border-2 border-dashed border-black/5 flex items-center justify-center gap-4 hover:border-black/20 hover:bg-black/5 transition-all text-[10px] font-black tracking-[0.2em] uppercase"
                      >
                        <Plus className="w-4 h-4" />
                        ADD SERVICE PROTOCOL
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'metrics' && (
                  <div className="max-w-[1000px] space-y-12">
                    <SectionTitle title="PERFORMANCE METRICS" subtitle="QUANTUM DATA" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {project.metrics.map((m, i) => (
                        <div key={m.id} className="p-8 border border-black/5 bg-[#fafafa] relative group">
                          <button 
                            onClick={() => setProject({ ...project, metrics: project.metrics.filter(met => met.id !== m.id) })}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex gap-4 mb-8">
                            <div className="flex-1">
                              <label className="text-[8px] font-black uppercase opacity-30 mb-2 block">Number</label>
                              <input value={m.number} onChange={e => {
                                const newMetrics = [...project.metrics];
                                newMetrics[i].number = e.target.value;
                                setProject({ ...project, metrics: newMetrics });
                              }} className="w-full bg-transparent border-b border-black/10 py-2 text-4xl font-display font-black" />
                            </div>
                            <div className="w-20">
                              <label className="text-[8px] font-black uppercase opacity-30 mb-2 block">Symbol</label>
                              <input value={m.symbol} onChange={e => {
                                const newMetrics = [...project.metrics];
                                newMetrics[i].symbol = e.target.value;
                                setProject({ ...project, metrics: newMetrics });
                              }} className="w-full bg-transparent border-b border-black/10 py-2 text-4xl font-display font-black text-center" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <input value={m.title} onChange={e => {
                              const newMetrics = [...project.metrics];
                              newMetrics[i].title = e.target.value;
                              setProject({ ...project, metrics: newMetrics });
                            }} className="w-full bg-transparent border-b border-black/10 py-2 text-sm font-black uppercase tracking-widest" placeholder="TITLE" />
                            <textarea value={m.description} onChange={e => {
                              const newMetrics = [...project.metrics];
                              newMetrics[i].description = e.target.value;
                              setProject({ ...project, metrics: newMetrics });
                            }} className="w-full bg-transparent border-b border-black/10 py-2 text-[10px] uppercase font-medium h-20 resize-none" placeholder="DESCRIPTION" />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={addMetric}
                        className="h-full min-h-[200px] border-2 border-dashed border-black/5 flex flex-col items-center justify-center gap-4 hover:border-black/20 hover:bg-black/5 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">ADD METRIC CARD</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'shuffle' && (
                  <div className="max-w-[1000px] space-y-12">
                    <SectionTitle title="SHUFFLE SYSTEM" subtitle="IMAGE SEQUENCE" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <MediaUploader 
                        label="Primary Asset" 
                        value={project.shuffleImage1 || ""} 
                        onChange={v => setProject({ ...project, shuffleImage1: v })} 
                      />
                      <MediaUploader 
                        label="Secondary Asset" 
                        value={project.shuffleImage2 || ""} 
                        onChange={v => setProject({ ...project, shuffleImage2: v })} 
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'mission' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="MISSION STORY" subtitle="BRAND ESSENCE" />
                    <div className="space-y-12">
                      <InputField 
                        label="Mission Heading" 
                        value={project.universalTitle || ""} 
                        onChange={v => setProject({ ...project, universalTitle: v })} 
                      />
                      <InputField 
                        label="Sub-Section Label" 
                        value={project.missionLabel || "MISSION"} 
                        onChange={v => setProject({ ...project, missionLabel: v })} 
                      />
                      <div className="space-y-4">
                        <label className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Mission Statement / Narrative</label>
                        <textarea
                          value={project.description || ""}
                          onChange={e => setProject({ ...project, description: e.target.value })}
                          className="w-full bg-transparent border border-black/5 p-8 text-xl font-display uppercase outline-none focus:border-black transition-all h-[300px] resize-none leading-relaxed"
                          placeholder="CRAFT THE PROJECT MISSION..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'video' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="CINEMATIC REEL" subtitle="MOTION ENGINE" />
                    <div className="space-y-12">
                      <MediaUploader 
                        label="Cinematic Video (MP4 / WebM)" 
                        accept="video/*"
                        aspectRatio="video"
                        value={project.videoUrl || ""} 
                        onChange={v => setProject({ ...project, videoUrl: v })} 
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'mobile' && (
                  <div className="max-w-[1000px] space-y-12">
                    <SectionTitle title="MOBILE MOCKUPS" subtitle="RESPONSIVE SYSTEMS" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[0, 1, 2].map(idx => (
                        <MediaUploader
                          key={idx}
                          label={`Screen 0${idx + 1}`}
                          aspectRatio="portrait"
                          value={project.mobileViews[idx]?.url || ""}
                          onChange={v => {
                            const newViews = [...project.mobileViews];
                            if (!newViews[idx]) newViews[idx] = { id: Math.random().toString(), url: "" };
                            newViews[idx].url = v;
                            setProject({ ...project, mobileViews: newViews });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'milestones' && (
                  <div className="max-w-[800px] space-y-12">
                    <SectionTitle title="PROJECT CHRONOLOGY" subtitle="TIMELINE ENGINE" />
                    <div className="space-y-4">
                      {project.milestones.map((m, i) => (
                        <div key={m.id} className="grid grid-cols-12 gap-4 items-center group bg-[#fafafa] p-4 border border-black/5">
                          <div className="col-span-2">
                            <input
                              value={m.year}
                              onChange={e => {
                                const newMiles = [...project.milestones];
                                newMiles[i].year = e.target.value;
                                setProject({ ...project, milestones: newMiles });
                              }}
                              className="w-full bg-transparent border-b border-black/5 py-4 text-xl font-display font-black text-center"
                            />
                          </div>
                          <div className="col-span-6">
                            <input
                              value={m.title}
                              onChange={e => {
                                const newMiles = [...project.milestones];
                                newMiles[i].title = e.target.value;
                                setProject({ ...project, milestones: newMiles });
                              }}
                              className="w-full bg-transparent border-b border-black/5 py-4 text-sm font-black uppercase tracking-widest"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              value={m.category}
                              onChange={e => {
                                const newMiles = [...project.milestones];
                                newMiles[i].category = e.target.value;
                                setProject({ ...project, milestones: newMiles });
                              }}
                              className="w-full bg-transparent border-b border-black/5 py-4 text-[10px] font-medium uppercase opacity-40"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <button 
                              onClick={() => setProject({ ...project, milestones: project.milestones.filter(mile => mile.id !== m.id) })}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={addMilestone}
                        className="w-full py-6 border-2 border-dashed border-black/5 flex items-center justify-center gap-4 hover:border-black/20 hover:bg-black/5 transition-all text-[10px] font-black tracking-[0.2em] uppercase"
                      >
                        <Plus className="w-4 h-4" />
                        ADD CHRONOLOGY NODE
                      </button>
                    </div>
                  </div>
                )}



              </motion.div>
            </AnimatePresence>
          </div>
        </SmoothScrollProvider>

        <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none pointer-events-none">
          <h3 className="text-[20vw] font-display font-black uppercase leading-none tracking-tighter">STUDIO</h3>
        </div>
      </main>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 group-focus-within:opacity-100 transition-opacity">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-black/10 py-4 text-2xl font-display uppercase outline-none focus:border-black transition-all"
        placeholder={`ENTER ${label.toUpperCase()}...`}
      />
    </div>
  );
}
