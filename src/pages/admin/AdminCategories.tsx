import React from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Plus, 
  Tag, 
  ChevronRight, 
  MoreVertical,
  Layers,
  Settings2,
  Trash2,
  FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Website Design", count: 24, description: "Full digital experience design and layouts." },
  { name: "Motion Design", count: 18, description: "Cinematic visual effects and transitions." },
  { name: "Branding", count: 32, description: "Visual identity and brand architecture." },
  { name: "Development", count: 12, description: "High-performance code and engineering." },
  { name: "UI/UX", count: 45, description: "User-centric interface optimization." },
  { name: "Marketing", count: 21, description: "Strategic digital growth campaigns." },
];

export default function AdminCategories() {
  return (
    <AdminLayout>
      <div className="space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ CLASSIFICATION ]</span>
            <h1 className="font-display text-[8vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              CATEGORIES
            </h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 h-14 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3"
          >
            <FolderPlus className="w-4 h-4" />
            CREATE CATEGORY
          </motion.button>
        </div>

        {/* Grid View of Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group bg-white border border-black/5 p-10 flex flex-col justify-between aspect-square cursor-pointer hover:bg-black transition-all duration-700"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Tag className="w-5 h-5 group-hover:text-white" />
                </div>
                <button className="text-black/10 group-hover:text-white/30 hover:!text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 group-hover:text-white/40 mb-4 block">
                  [ {cat.count} PROJECTS ]
                </span>
                <h3 className="font-display text-4xl font-black uppercase tracking-tighter group-hover:text-white mb-4">
                  {cat.name}
                </h3>
                <p className="text-xs font-medium opacity-40 group-hover:text-white/50 leading-relaxed uppercase">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-black/5 group-hover:border-white/10">
                <button className="text-[9px] font-black tracking-[0.2em] uppercase text-black/40 group-hover:text-white hover:underline underline-offset-8">
                  MANAGE ARCHIVE
                </button>
                <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories Analysis */}
        <section className="bg-black text-white p-12 lg:p-24 overflow-hidden relative">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="max-w-[400px]">
              <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-8 block">[ DENSITY MAP ]</span>
              <h2 className="font-display text-5xl font-black tracking-tighter uppercase mb-6 leading-none">Category Distribution</h2>
              <p className="text-sm font-medium opacity-40 uppercase leading-relaxed">
                Analyze the saturation of project categories across the studio portfolio to optimize creative focus.
              </p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: "Design", perc: "45%" },
                { label: "Dev", perc: "15%" },
                { label: "Motion", perc: "25%" },
                { label: "Other", perc: "15%" }
              ].map(stat => (
                <div key={stat.label} className="space-y-4">
                  <p className="text-5xl font-display font-black">{stat.perc}</p>
                  <p className="text-[9px] font-black tracking-[0.2em] uppercase opacity-40">{stat.label}</p>
                  <div className="h-1 bg-white/10 w-full relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: stat.perc }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute inset-0 bg-[#ef4444]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
