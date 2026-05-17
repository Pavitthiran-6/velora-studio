import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit3, 
  X,
  Upload,
  Save,
  Monitor,
  Sparkles,
  Activity,
  Check,
  AlertCircle,
  ArrowRight,
  Layout as LayoutIcon,
  Image as ImageIcon,
  Zap,
  Globe,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "../../components/SmoothScrollProvider";
import { useRef, useEffect } from "react";

// Mock Data Structure
const INITIAL_CARDS = [
  { id: "1", title: "Sling Shot branding", tags: "Branding, Identity", slug: "/work/sling-shot", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", active: true, order: 1 },
  { id: "2", title: "Lumina App Design", tags: "UI/UX, Product", slug: "/work/lumina", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800", active: true, order: 2 },
  { id: "3", title: "Vertex Motion Clip", tags: "Motion, 3D", slug: "/work/vertex", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800", active: true, order: 3 },
];

import { cmsService } from "../../lib/cms-service";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export default function AdminHomeCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    slug: "",
    image: "",
    active: true
  });

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await cmsService.getHomeCards();
      setCards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const modalRootRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

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

  const handleOpenModal = (card: any = null) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title,
        tags: card.tags,
        slug: card.slug,
        image: card.image_url || card.image,
        active: card.is_active !== false
      });
    } else {
      setEditingCard(null);
      setFormData({
        title: "",
        tags: "",
        slug: "",
        image: "",
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await cmsService.uploadMedia(file, 'gallery-images');
        setFormData({ ...formData, image: url });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cmsService.saveHomeCard({ ...formData, order: editingCard?.order || cards.length + 1 }, editingCard?.id);
      await fetchCards();
      setIsModalOpen(false);
      window.dispatchEvent(new Event('cms-update'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this home card?")) return;
    try {
      await cmsService.deleteHomeCard(id);
      await fetchCards();
      window.dispatchEvent(new Event('cms-update'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-16 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ LANDING SEQUENCE ]</span>
            <h1 className="font-display text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              HOME CARDS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="px-10 h-16 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-4 shadow-2xl"
            >
              <Plus className="w-5 h-5" />
              ADD NEW CARD
            </motion.button>
          </div>
        </div>

        {/* CMS WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT PANEL: Editable List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-8 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-20">ACTIVE SEQUENCE</span>
                <div className="w-12 h-px bg-black/5" />
              </div>
              <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-20 flex items-center gap-2">
                <GripVertical className="w-3 h-3" /> DRAG TO REORDER
              </span>
            </div>

            <div className="space-y-4">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group bg-white border border-black/5 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-black transition-all duration-500 relative"
                >
                  <div className="flex flex-1 items-center gap-4 md:gap-8 min-w-0 w-full">
                    <div className="cursor-grab active:cursor-grabbing text-black/10 group-hover:text-black/30 transition-colors shrink-0">
                      <GripVertical className="w-6 h-6" />
                    </div>

                    <div className="w-24 h-16 sm:w-40 sm:h-24 bg-black/5 overflow-hidden rounded-sm shadow-sm relative shrink-0">
                      <img src={card.image_url || card.image} alt={card.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                      {card.is_active === false && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-[8px] font-black tracking-widest uppercase text-black/40">HIDDEN</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black tracking-[0.25em] text-[#ef4444] uppercase truncate">{card.tags}</span>
                        {card.is_active === false && <AlertCircle className="w-3 h-3 text-black/20 shrink-0" />}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tighter leading-none group-hover:tracking-normal transition-all duration-500 truncate">
                        {card.title}
                      </h3>
                      <p className="text-[9px] font-medium opacity-20 uppercase tracking-widest truncate">{card.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto ml-auto sm:ml-0">
                    <button 
                      onClick={() => handleOpenModal(card)}
                      className="w-12 h-12 border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all rounded-full group/btn shrink-0"
                    >
                      <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleDelete(card.id)}
                      className="w-12 h-12 border border-black/5 flex items-center justify-center hover:bg-[#ef4444] hover:text-white transition-all rounded-full group/btn shrink-0"
                    >
                      <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: Floating Global Config */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-black text-white p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div>
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-6 block">[ GLOBAL CONFIG ]</span>
                  <h3 className="font-display text-4xl font-black uppercase tracking-tighter leading-none">Content Engine</h3>
                </div>
                
                <div className="pt-8 border-t border-white/10">
                  <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed">
                    The homepage sequence is currently governed by the studio design lock. All content updates are broadcasted automatically.
                  </p>
                </div>
              </div>

              {/* Decorative Watermark */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.03]">
                <Monitor className="w-64 h-64" />
              </div>
            </div>

            <div className="mt-8 p-8 border border-black/5 bg-[#fafafa] flex items-center gap-6">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase mb-1">Live Connection</p>
                <p className="text-[9px] font-medium opacity-40 uppercase leading-none italic">Synced with Home Engine v2.0</p>
              </div>
            </div>
          </div>
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
                        [ CARD PREVIEW ]
                      </div>

                      {/* Homepage Card Mockup (Premium 320x400) */}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute bottom-8 left-8 right-8 space-y-2">
                          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#ef4444]">{formData.tags || "SERVICE TAGS"}</p>
                          <h4 className="text-3xl font-display font-black uppercase tracking-tighter text-white leading-none">
                            {formData.title || "PROJECT TITLE"}
                          </h4>
                        </div>
                        
                        <div className="absolute top-8 right-8 w-10 h-10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                          <ArrowRight className="w-4 h-4 text-white" />
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
                            <h3 className="font-display text-4xl lg:text-5xl font-black uppercase tracking-[-0.04em] leading-none">Content Meta</h3>
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
                              <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30">Main Cover Image</label>
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
                              <div className="space-y-3 group">
                                <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Project Title</label>
                                <input 
                                  type="text" 
                                  required
                                  value={formData.title}
                                  onChange={(e) => {
                                    const title = e.target.value;
                                    const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    setFormData({ 
                                      ...formData, 
                                      title: title,
                                      slug: formData.slug || !editingCard ? `/work/${slugify(title)}` : formData.slug
                                    });
                                  }}
                                  className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all" 
                                  placeholder="PROJECT NAME"
                                />
                              </div>
                              <div className="space-y-3 group">
                                <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Service Tags</label>
                                <input 
                                  type="text" 
                                  value={formData.tags}
                                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                  className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all" 
                                  placeholder="DESIGN, UI/UX, ETC"
                                />
                              </div>
                            </div>

                            <div className="space-y-3 group">
                              <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Slug Reference</label>
                              <input 
                                type="text" 
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all" 
                                placeholder="/WORK/PROJECT-ID"
                              />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-6 bg-[#fafafa] border border-black/5 hover:border-black/20 transition-all group cursor-pointer"
                              onClick={() => setFormData({ ...formData, active: !formData.active })}
                            >
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1">Live Status</p>
                                <p className="text-[7px] font-medium opacity-40 uppercase">Visible on Homepage Scroll</p>
                              </div>
                              <div className={cn(
                                "w-12 h-6 border-[1.5px] border-black flex items-center p-0.5 transition-all",
                                formData.active ? "bg-black shadow-[0_0_20px_rgba(0,0,0,0.15)]" : "bg-transparent"
                              )}>
                                <motion.div 
                                  animate={{ x: formData.active ? 24 : 0 }}
                                  className={cn("w-4 h-4 transition-colors", formData.active ? "bg-white" : "bg-black")} 
                                />
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
                            SAVE CONTENT DATA
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
