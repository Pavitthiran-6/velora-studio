import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Star, 
  Trash2, 
  X, 
  Plus, 
  Search,
  Quote,
  Edit3,
  Check,
  ChevronRight,
  ArrowRight,
  Layout as LayoutIcon,
  Image as ImageIcon,
  Zap,
  Globe,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "../../components/SmoothScrollProvider";

const INITIAL_REVIEWS = [
  { id: "1", reviewer_name: "James Wilson", company_name: "Nexus Tech", review_text: "The level of cinematic detail Buzzworthy brings to the table is unmatched. They didn't just build a site; they built an experience.", rating: 5, avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", is_published: true, is_featured: true, date: "Oct 12, 2024", review_index: 1 },
  { id: "2", reviewer_name: "Elena Rossi", company_name: "Vogue Italia", review_text: "A brutalist masterpiece. Our digital presence has never felt more premium and cohesive.", rating: 5, avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", is_published: true, is_featured: false, date: "Sep 28, 2024", review_index: 2 },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("studio_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFTS">("ALL");
  const [formData, setFormData] = useState({
    reviewer_name: "",
    company_name: "",
    review_text: "",
    rating: 5,
    avatar_url: "",
    is_published: true,
    is_featured: false,
    review_index: 1
  });
  const modalRootRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("studio_reviews", JSON.stringify(reviews));
  }, [reviews]);

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

  // NATIVE EVENT BLOCKER: Prevents the smooth-scroll hook on the parent from catching events
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

  const handleOpenModal = (review: any = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({ ...review });
    } else {
      setEditingReview(null);
      setFormData({
        reviewer_name: "",
        company_name: "",
        review_text: "",
        rating: 5,
        avatar_url: "",
        is_published: true,
        is_featured: false,
        review_index: reviews.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      setReviews(reviews.map((r: any) => r.id === editingReview.id ? { ...r, ...formData } : r));
    } else {
      const newReview = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setReviews([newReview, ...reviews]);
    }
    setIsModalOpen(false);
  };

  const filteredReviews = reviews.filter((r: any) => {
    if (filter === "PUBLISHED") return r.is_published;
    if (filter === "DRAFTS") return !r.is_published;
    return true;
  });

  return (
    <AdminLayout>
      <div className="relative min-h-full">
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
                <div className="lg:w-[35%] bg-[#171c44] flex flex-col items-center justify-center relative p-8 lg:p-12 overflow-hidden border-r border-white/5 shrink-0 min-h-[300px] lg:min-h-0">
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_60%_40%,#ef44440a_0%,transparent_60%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-30" />
                  </div>
                  
                  <div className="absolute top-8 left-8 text-[9px] font-black tracking-[0.4em] uppercase text-white/30 z-10 flex items-center gap-4">
                    <LayoutIcon className="w-3 h-3" />
                    [ LIVE PREVIEW ]
                  </div>

                  {/* Floating Glass Card (Compact 300x360) */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full max-w-[300px] h-[360px] bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-2xl p-8 flex flex-col justify-between group shadow-2xl overflow-hidden mt-8 lg:mt-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                    <Quote className="absolute -top-6 -left-6 w-32 h-32 text-white/5 rotate-12 transition-transform group-hover:scale-110 duration-1000" />
                    
                    <div className="relative z-10 flex flex-col flex-1 min-h-0 pt-4">
                      <div className="flex gap-1.5 mb-6 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5 transition-all duration-300", i < formData.rating ? "fill-[#ef4444] text-[#ef4444] scale-110" : "text-white/10")} />
                        ))}
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar-light pr-2 min-h-0">
                        <p className="text-2xl font-display font-black uppercase italic leading-[1.05] tracking-tight text-white opacity-95 break-all">
                          "{formData.review_text || "ENTER REVIEW TEXT TO PREVIEW..."}"
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0 border border-white/10">
                        <img src={formData.avatar_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100"} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black tracking-[0.2em] text-white uppercase truncate">{formData.reviewer_name || "REVIEWER"}</p>
                        <p className="text-[8px] font-black tracking-[0.3em] text-[#ef4444] uppercase mt-1 truncate">{formData.company_name || "COMPANY"}</p>
                      </div>
                      <div className="text-[9px] font-black text-white/20 uppercase tracking-tighter shrink-0">0{formData.review_index}</div>
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
                        <h3 className="font-display text-4xl lg:text-5xl font-black uppercase tracking-[-0.04em] leading-none">Review Meta</h3>
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
                      {/* Grid Row 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-2">
                        <div className="space-y-3 group">
                          <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Reviewer Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.reviewer_name}
                            onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                            className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all" 
                            placeholder="FULL NAME"
                          />
                        </div>
                        <div className="space-y-3 group">
                          <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Company / Startup</label>
                          <input 
                            type="text" 
                            required
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full bg-transparent border-b border-black/10 py-2.5 text-lg font-display uppercase outline-none focus:border-black transition-all" 
                            placeholder="ORGANIZATION"
                          />
                        </div>
                      </div>

                      {/* Grid Row 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-end">
                        <div className="space-y-3 group">
                          <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Reviewer Avatar</label>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-black/5 border border-black/10 overflow-hidden shrink-0 flex items-center justify-center">
                              {formData.avatar_url ? (
                                <img src={formData.avatar_url} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <ImageIcon className="w-4 h-4 opacity-20" />
                              )}
                            </div>
                            <div className="flex-1 relative">
                              <input 
                                type="text" 
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                className="w-full bg-transparent border-b border-black/10 py-2.5 text-[10px] font-black tracking-widest uppercase outline-none focus:border-black transition-all pr-10" 
                                placeholder="PASTE URL OR UPLOAD →"
                              />
                              <label className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#ef4444] transition-colors p-2">
                                <Plus className="w-4 h-4" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30">Rating Selector</label>
                          <div className="flex items-center gap-3 pt-1">
                            {[1,2,3,4,5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={{ scale: 1.2, rotate: 12 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className="group/star p-1 transition-all"
                              >
                                <Star 
                                  className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    formData.rating >= star 
                                      ? "fill-black text-black" 
                                      : "text-black/10 group-hover/star:text-black/40"
                                  )} 
                                />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="space-y-3 group">
                        <label className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30 group-focus-within:opacity-100 transition-opacity">Review Testimony</label>
                        <textarea 
                          required
                          value={formData.review_text}
                          onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                          className="w-full h-[120px] bg-[#fafafa] border border-black/5 p-6 text-sm font-medium uppercase outline-none focus:border-black focus:bg-white transition-all resize-none leading-relaxed" 
                          placeholder="WRITE THE STORY..."
                        />
                      </div>

                      {/* Toggles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div 
                          onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                          className="flex items-center justify-between p-5 bg-[#fafafa] border border-black/5 hover:border-black/20 cursor-pointer transition-all group"
                        >
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Active Protocol</p>
                            <p className="text-[7px] font-medium opacity-40 uppercase">Visible on Live Site</p>
                          </div>
                          <div className={cn(
                            "w-10 h-5 border-[1.5px] border-black flex items-center p-0.5 transition-all shrink-0",
                            formData.is_published ? "bg-black shadow-[0_0_15px_rgba(0,0,0,0.1)]" : "bg-transparent"
                          )}>
                            <motion.div 
                              animate={{ x: formData.is_published ? 20 : 0 }}
                              className={cn("w-3 h-3 transition-colors", formData.is_published ? "bg-white" : "bg-black")} 
                            />
                          </div>
                        </div>
                        <div 
                          onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                          className="flex items-center justify-between p-5 bg-[#fafafa] border border-black/5 hover:border-black/20 cursor-pointer transition-all group"
                        >
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">Featured State</p>
                            <p className="text-[7px] font-medium opacity-40 uppercase">Promote in Carousel</p>
                          </div>
                          <div className={cn(
                            "w-10 h-5 border-[1.5px] border-[#ef4444] flex items-center p-0.5 transition-all shrink-0",
                            formData.is_featured ? "bg-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-transparent"
                          )}>
                            <motion.div 
                              animate={{ x: formData.is_featured ? 20 : 0 }}
                              className={cn("w-3 h-3 transition-colors", formData.is_featured ? "bg-white" : "bg-[#ef4444]")} 
                            />
                          </div>
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
                        SAVE REVIEW DATA
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

        {/* DASHBOARD CONTENT (STRICTLY UNTOUCHED LOGIC) */}
        <div className="space-y-16 pb-32 pt-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-8">
            <div>
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-30 mb-4 block">[ CMS / TESTIMONIALS ]</span>
              <h1 className="font-display text-[9vw] leading-[0.75] tracking-[-0.06em] uppercase font-black">
                REVIEWS
              </h1>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="px-12 h-20 bg-black text-white text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-5 shadow-2xl"
            >
              <Plus className="w-5 h-5" />
              ADD NEW STORY
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start px-8">
            <div className="lg:col-span-12 space-y-10">
              <div className="flex items-center justify-between border-b border-black/5 pb-10">
                <div className="flex items-center gap-16">
                  {['ALL', 'PUBLISHED', 'DRAFTS'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilter(f as any)}
                      className={cn(
                        "text-[10px] font-black tracking-widest uppercase transition-all relative pb-2",
                        filter === f ? "text-[#ef4444]" : "opacity-30 hover:opacity-100"
                      )}
                    >
                      {f}
                      {filter === f && <motion.div layoutId="filterUnderline" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ef4444]" />}
                    </button>
                  ))}
                </div>
                <div className="relative group hidden md:block border-l border-black/5 pl-10">
                  <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-20" />
                  <input type="text" placeholder="SEARCH FEEDBACK..." className="bg-transparent border-none pl-10 text-[10px] font-black tracking-widest outline-none opacity-40 focus:opacity-100 transition-all uppercase w-72 h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredReviews.map((review: any, i: number) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group bg-white border border-black/5 p-10 flex flex-col md:flex-row items-center gap-12 hover:border-black/20 hover:shadow-xl transition-all duration-500 relative"
                  >
                    <div className={cn(
                      "absolute top-0 left-0 w-[3px] h-full transition-all duration-500 group-hover:w-[6px]",
                      review.is_published ? "bg-green-500" : "bg-black/10"
                    )} />

                    <div className="w-20 h-20 bg-black/5 rounded-full overflow-hidden shrink-0 border-2 border-black/5 group-hover:scale-110 transition-transform duration-700">
                      <img src={review.avatar_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100"} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0" alt="" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-5">
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{review.reviewer_name}</h3>
                        <div className="px-3 py-1 bg-black/5 rounded-full text-[8px] font-black uppercase tracking-widest opacity-40">SQ-00{review.review_index}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#ef4444] uppercase">{review.company_name}</span>
                        <div className="w-1 h-1 bg-black/10 rounded-full" />
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-black text-black" : "text-black/10")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-medium opacity-40 uppercase line-clamp-1 italic pr-12 group-hover:opacity-100 transition-opacity">
                        "{review.review_text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-8 shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20">{review.date}</p>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em] mt-1.5",
                          review.is_published ? "text-green-500" : "text-black/20"
                        )}>{review.is_published ? "PUBLISHED" : "DRAFT"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(review)}
                          className="w-14 h-14 border border-black/5 flex items-center justify-center transition-all rounded-full group/btn"
                        >
                          <Edit3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: "#ef4444", color: "#fff" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (confirm("ARCHIVE THIS STORY?")) {
                              setReviews(reviews.filter((r: any) => r.id !== review.id));
                            }
                          }}
                          className="w-14 h-14 border border-black/5 flex items-center justify-center transition-all rounded-full group/btn shadow-none"
                        >
                          <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-8 pb-20">
            {[
              { label: "LIVE STORIES", val: reviews.filter((r: any) => r.is_published).length, icon: Globe },
              { label: "AVG RATING", val: "5.0", icon: Star },
              { label: "TOTAL SIGNALS", val: reviews.length, icon: Zap },
              { label: "FEATURED", val: reviews.filter((r: any) => r.is_featured).length, icon: Settings }
            ].map(m => (
              <div key={m.label} className="p-12 border border-black/5 bg-white flex flex-col group hover:border-black/20 transition-all cursor-default">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-20 group-hover:opacity-100 transition-opacity">{m.label}</span>
                  <m.icon className="w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-display text-6xl font-black leading-none">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
