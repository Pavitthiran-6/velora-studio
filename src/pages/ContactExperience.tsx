"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoveLeft, X, ArrowRight } from "lucide-react";
import { useTransition } from "../components/TransitionProvider";
import HexIcon from "../components/HexIcon";

type ContactStep = "intro" | "projectType" | "budget" | "hearAbout" | "form" | "success";

interface SelectionData {
  path: string;
  projectType: string;
  budget: string;
  hearAbout: string;
}

export const ContactExperience: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { triggerLogoTransition } = useTransition();
  const [step, setStep] = useState<ContactStep>("intro");
  const [selections, setSelections] = useState<SelectionData>({
    path: "",
    projectType: "",
    budget: "",
    hearAbout: ""
  });

  const nextStep = (next: ContactStep) => setStep(next);
  const prevStep = (prev: ContactStep) => setStep(prev);

  if (!isOpen) return null;

  const progress = step === "intro" ? 1 : step === "projectType" ? 2 : step === "budget" ? 3 : step === "hearAbout" ? 4 : 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[5000] bg-[#ef4444] p-2 md:p-3 lg:p-4 font-sans select-none overflow-hidden"
    >
      <div className="relative w-full h-full rounded-[16px] md:rounded-[28px] lg:rounded-[40px] overflow-hidden bg-[#1f2547] flex flex-col border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 md:p-12 lg:p-16 text-[#f4f4f4] selection:bg-[#ef3b5d] selection:text-white">
        {/* TOP LAYER: LOGO + TAGS + DECO */}
        <div className="flex justify-between items-start z-10">
          {/* Logo with Red Circle - Clickable (Global Transition) */}
          <button
            onClick={() => triggerLogoTransition()}
            className="flex items-center gap-4 group"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#ef3b5d] rounded-full flex items-center justify-center p-2 md:p-3 group-hover:scale-110 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm.75 12c-1.24 0-2.25-1.01-2.25-2.25v-4.5c0-.41.34-.75.75-.75s.75.34.75.75v4.5c0 .41.34.75.75.75h.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5z" />
              </svg>
            </div>
          </button>

          {/* Selected Tags Capsules */}
          <div className="flex gap-2">
            <AnimatePresence>
              {[selections.projectType, selections.budget, selections.hearAbout].map((tag, i) => tag && (
                  <motion.div
                    key={`${tag}-${i}`}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="px-5 py-2 md:py-3 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-display font-black tracking-[0.2em] uppercase text-white/40 whitespace-nowrap flex items-center gap-3"
                  >
                    <HexIcon className="w-2.5 h-2.5" fill="#ef3b5d" />
                    {tag}
                  </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Close Button */}
          <div className="flex items-center gap-8">
            <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity">
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </div>

        {/* MIDDLE LAYER: CENTERED CONTENT */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <StepContent
                key="intro"
                title={<>HOW CAN WE <span className="text-[#ef3b5d]">HELP?</span></>}
                options={["START A PROJECT", "JOIN OUR TEAM", "DROP US A LINE"]}
                onSelect={(val) => {
                  if (val === "START A PROJECT") {
                    setSelections(s => ({ ...s, path: val }));
                    nextStep("projectType");
                  } else {
                    window.location.href = "mailto:pavitthiran66@gmail.com";
                  }
                }}
              />
            )}
            {step === "projectType" && (
              <StepContent
                key="projectType"
                title={<>WHAT TYPE OF <span className="text-[#ef3b5d]">PROJECT?</span></>}
                options={["FULL WEBSITE", "UX/UI DESIGN", "WEB DEVELOPMENT", "BRANDING", "MARKETING"]}
                onSelect={(val) => { setSelections(s => ({ ...s, projectType: val })); nextStep("budget"); }}
              />
            )}
            {step === "budget" && (
              <StepContent
                key="budget"
                title={<>BUDGET <span className="text-[#ef3b5d]">RANGE</span></>}
                options={["15K–30K", "30K–50K", "50K–75K", "75K–100K", "100K+"]}
                onSelect={(val) => { setSelections(s => ({ ...s, budget: val })); nextStep("hearAbout"); }}
              />
            )}
            {step === "hearAbout" && (
              <StepContent
                key="hearAbout"
                title={<>HOW DID YOU <span className="text-[#ef3b5d]">HEAR ABOUT US?</span></>}
                options={["AWWWARDS", "FRIEND REFERRAL", "WE DID A PROJECT", "GOOGLE", "ARTICLE"]}
                onSelect={(val) => { setSelections(s => ({ ...s, hearAbout: val })); nextStep("form"); }}
              />
            )}
            {step === "form" && (
              <StepFinalForm
                onSelect={() => nextStep("success")}
                selections={selections}
              />
            )}
            {step === "success" && (
              <StepSuccess onClose={onClose} />
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM LAYER: BACK + PROGRESS */}
        <div className="flex justify-between items-center z-10 h-24">
          {step !== "intro" && step !== "success" ? (
            <button
              onClick={() => {
                if (step === "projectType") {
                  setSelections(s => ({ ...s, path: "" }));
                  prevStep("intro");
                } else if (step === "budget") {
                  setSelections(s => ({ ...s, projectType: "" }));
                  prevStep("projectType");
                } else if (step === "hearAbout") {
                  setSelections(s => ({ ...s, budget: "" }));
                  prevStep("budget");
                } else if (step === "form") {
                  setSelections(s => ({ ...s, hearAbout: "" }));
                  prevStep("hearAbout");
                }
              }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
            >
              <MoveLeft className="w-6 h-6 md:w-8 md:h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          ) : <div className="w-20" />}

          {/* PROGRESS INDICATOR */}
          <div className="flex flex-col items-center gap-6 w-full max-w-sm md:max-w-md mx-auto">
            <div className="flex justify-between items-center w-full px-2">
              <span className="text-[10px] md:text-xs font-black tracking-[0.2em] opacity-40">01</span>
              <span className="text-[10px] md:text-xs font-black tracking-[0.2em] opacity-40">05</span>
            </div>
            <div className="w-full h-0.5 bg-white/10 relative">
              <HexIcon className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3" fill="#ef3b5d" />
              <motion.div
                initial={{ width: "20%" }}
                animate={{ width: `${(progress / 5) * 100}%` }}
                className="absolute h-full bg-[#ef3b5d] left-0 top-0 transition-all duration-500"
              />
              <HexIcon className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3" fill="#1f2547" />
            </div>
          </div>

          <div className="w-20 hidden md:block" />
        </div>
      </div>
    </motion.div>
  );
};

/* --- SHARED STEP COMPONENT (CAPSULE STYLE) --- */

const StepContent: React.FC<{ title: React.ReactNode; options: string[]; onSelect: (val: string) => void }> = ({ title, options, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-5xl flex flex-col items-center"
  >
    <h1 className="text-4xl md:text-7xl lg:text-[7vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.8] mb-12 md:mb-20">
      {title}
    </h1>

    <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
      {options.map((opt, i) => (
        <motion.button
          key={opt}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(opt)}
          className="px-8 md:px-12 py-5 md:py-7 rounded-[4rem] bg-white/5 border border-white/10 flex items-center gap-4 group transition-colors duration-300"
        >
          <HexIcon className="w-3 h-3" fill={i === 0 ? "rgba(255,255,255,0.2)" : "currentColor"} />
          <span className="text-[10px] md:text-xs font-display font-black tracking-[0.2em] uppercase whitespace-nowrap">{opt}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

const StepFinalForm: React.FC<{ selections: SelectionData; onSelect: () => void }> = ({ selections, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-left"
  >
    <div className="flex flex-col justify-center">
      <h1 className="text-4xl md:text-6xl lg:text-[5.5vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.85] mb-8">
        READY TO <br /> CREATE <br /> <span className="text-[#ef3b5d]">MAGIC?</span>
      </h1>
      <p className="text-xs md:text-sm font-display font-black tracking-[0.3em] uppercase opacity-30">BUZZWORTHY STUDIO — PROJECT INTAKE</p>
    </div>

    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingInput label="FIRST NAME" placeholder="JOHN" />
        <FloatingInput label="LAST NAME" placeholder="DOE" />
      </div>
      <FloatingInput label="EMAIL" placeholder="HELLO@EXAMPLE.COM" />
      <FloatingInput label="TELL US ABOUT THE DREAM" placeholder="MY VISION IS..." textarea />

      <div className="pt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelect}
          className="w-full h-16 md:h-20 bg-[#ef3b5d] rounded-full flex items-center justify-center gap-4 text-[10px] md:text-xs font-display font-black tracking-[0.4em] uppercase hover:bg-[#ff4d6d] transition-all"
        >
          SEND MAGIC <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const StepSuccess: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center text-center max-w-4xl mx-auto"
  >
    <div className="w-24 h-24 rounded-full border-2 border-[#ef3b5d] flex items-center justify-center mb-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <HexIcon className="w-12 h-12" fill="#ef3b5d" />
      </motion.div>
    </div>
    <h1 className="text-4xl md:text-7xl lg:text-[8vw] font-display font-black tracking-[-0.04em] uppercase leading-[0.85] mb-8">
      MESSAGE <br /> <span className="text-[#ef3b5d]">RECEIVED.</span>
    </h1>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClose}
      className="px-12 py-6 rounded-full bg-white text-[#1f2547] text-xs font-display font-black tracking-[0.4em] uppercase"
    >
      BACK TO STUDIO
    </motion.button>
  </motion.div>
);

const FloatingInput: React.FC<{ label: string; placeholder: string; textarea?: boolean }> = ({ label, placeholder, textarea }) => (
  <div className="relative group w-full">
    <span className="block text-[8px] font-display font-black tracking-[0.3em] text-[#ef3b5d] mb-1 opacity-60">{label}</span>
    {textarea ? (
      <textarea
        className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-display font-black tracking-tight uppercase focus:border-[#ef3b5d] focus:outline-none placeholder:text-white/5 min-h-[80px] md:min-h-[100px]"
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        className="w-full bg-transparent border-b border-white/10 py-3 text-sm font-display font-black tracking-tight uppercase focus:border-[#ef3b5d] focus:outline-none placeholder:text-white/5"
        placeholder={placeholder}
      />
    )}
    <div className="absolute left-0 -bottom-px w-0 h-[1px] bg-[#ef3b5d] group-focus-within:w-full transition-all duration-500" />
  </div>
);
