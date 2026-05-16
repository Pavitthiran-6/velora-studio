import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  MessageSquare, 
  Mail, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  ChevronRight,
  Filter,
  User,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cmsService } from "../../lib/cms-service";

export default function AdminNotifications() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "ARCHIVED">("ALL");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await cmsService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'read' | 'unread' | 'archived') => {
    try {
      await cmsService.updateMessageStatus(id, status);
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await cmsService.deleteMessage(id);
      await fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("🚨 BULK WIPE: Are you sure you want to delete ALL messages in your inbox?")) return;
    try {
      await cmsService.clearAllMessages();
      await fetchMessages();
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter((m: any) => {
    if (filter === "UNREAD") return m.status === 'unread';
    if (filter === "ARCHIVED") return m.status === 'archived';
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-4 block">[ INBOX PROTOCOL ]</span>
            <h1 className="font-display text-[8vw] lg:text-[6vw] leading-[0.8] tracking-[-0.06em] uppercase font-black">
              MESSAGES
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-12 border-b border-black/10 pb-4">
            <button 
              onClick={handleClearAll}
              className="text-[10px] font-black tracking-widest uppercase text-red-500/60 hover:text-red-500 transition-all mr-8"
            >
              Clear All Messages
            </button>
            <div className="h-4 w-px bg-black/20 mr-4" />
            {['ALL', 'UNREAD', 'ARCHIVED'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f as any)}
                className={cn(
                  "text-[10px] font-black tracking-widest uppercase transition-all relative pb-2",
                  filter === f ? "text-[#ef4444]" : "opacity-50 hover:opacity-100"
                )}
              >
                {f}
                {filter === f && <motion.div layoutId="notifFilter" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ef4444]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* List Section (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                placeholder="SEARCH INBOX..." 
                className="w-full bg-white border border-black/10 px-16 py-6 text-[10px] font-black tracking-widest uppercase outline-none focus:border-black transition-all"
              />
            </div>

            <div className="space-y-3">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-black/5 animate-pulse border border-black/5" />
                ))
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layoutId={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') handleStatusUpdate(msg.id, 'read');
                    }}
                    className={cn(
                      "group p-8 border cursor-pointer transition-all duration-500 relative flex items-start gap-6",
                      selectedMessage?.id === msg.id ? "bg-black text-white border-black" : "bg-white border-black/10 hover:border-black/40"
                    )}
                  >
                    {msg.status === 'unread' && (
                      <div className="absolute top-8 right-8 w-2 h-2 bg-[#ef4444] rounded-full" />
                    )}
                    
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                      selectedMessage?.id === msg.id ? "bg-white/10 border-white/20" : "bg-black/5 border-black/5"
                    )}>
                      <User className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn(
                          "text-[10px] font-black tracking-widest uppercase truncate pr-8",
                          selectedMessage?.id === msg.id ? "text-white" : "text-black"
                        )}>
                          {msg.name}
                        </p>
                      </div>
                      <p className={cn(
                        "text-[9px] font-black tracking-widest uppercase mb-3",
                        selectedMessage?.id === msg.id ? "text-[#ef4444]" : "text-[#ef4444]/60"
                      )}>
                        {msg.subject || "NO SUBJECT"}
                      </p>
                      <p className={cn(
                        "text-[11px] font-medium uppercase line-clamp-1",
                        selectedMessage?.id === msg.id ? "opacity-70" : "opacity-60"
                      )}>
                        {msg.message}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-black/10">
                  <p className="text-[10px] font-black tracking-widest opacity-20 uppercase">No Messages Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section (Right) */}
          <div className="lg:col-span-7 h-fit sticky top-32">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-black/5 p-12 lg:p-16 space-y-12 shadow-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#ef4444]">[ MESSAGE DATA ]</span>
                      <h2 className="text-4xl lg:text-5xl font-display font-black uppercase tracking-tight leading-none">
                        {selectedMessage.subject || "No Subject"}
                      </h2>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-black/5">
                    <div>
                      <p className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-2">Sender Identity</p>
                      <p className="text-sm font-black uppercase">{selectedMessage.name}</p>
                      <p className="text-[10px] font-medium opacity-40 lowercase">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black tracking-widest opacity-30 uppercase mb-2">Received At</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 opacity-30" />
                        <p className="text-sm font-black uppercase">
                          {new Date(selectedMessage.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[8px] font-black tracking-widest opacity-60 uppercase">Inquiry Content</p>
                    <div className="p-10 bg-[#fafafa] border border-black/10 text-sm font-medium uppercase leading-relaxed text-black whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      onClick={() => handleStatusUpdate(selectedMessage.id, selectedMessage.status === 'archived' ? 'unread' : 'archived')}
                      className="px-8 py-4 border border-black text-[10px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                    >
                      {selectedMessage.status === 'archived' ? 'UNARCHIVE' : 'ARCHIVE MESSAGE'}
                    </button>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="px-8 py-4 bg-[#ef4444] text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-3 hover:bg-black transition-all"
                    >
                      REPLY VIA EMAIL
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[600px] bg-black/5 border border-dashed border-black/10 flex flex-col items-center justify-center text-center p-20">
                  <Mail className="w-12 h-12 opacity-10 mb-6" />
                  <h3 className="text-[10px] font-black tracking-[0.5em] uppercase opacity-20">Select a message to view details</h3>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
