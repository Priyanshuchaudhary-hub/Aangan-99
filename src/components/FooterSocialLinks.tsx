/* =========================================================================
   AANGAN '99 — RETRO FOOTER & SOCIAL CONNECT SECTION
   Nostalgic 1990s Terminal / CRT-styled personal connection links.
   Provides direct, accessible, high-contrast links to Email, LinkedIn & Instagram.
   ========================================================================= */

import React, { useState } from 'react';
import { Linkedin, Instagram, Mail, ExternalLink, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export interface FooterSocialLinksProps {
  email?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
}

export const FooterSocialLinks: React.FC<FooterSocialLinksProps> = ({
  email = 'priyanshuchaudhary07it@gmail.com',
  linkedInUrl = 'https://www.linkedin.com/in/priyanshu-bharangar?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  instagramUrl = 'https://www.instagram.com/chaudhary_priyanshuu?utm_source=qr&igsi=enptcGt4c3puY25k'
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleLinkClick = () => {
    audioSynthesizer.playClick('switch');
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    audioSynthesizer.playClick('soft');
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 select-none">
      {/* Decorative Retro Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#5c4331] to-transparent flex-1" />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a120c] border border-[#4a3628] rounded-full text-[10px] font-pixel text-[#f59e0b] uppercase tracking-widest shadow-sm">
          <Terminal className="w-3 h-3 text-[#f59e0b]" />
          <span>CONNECT & DISPATCH</span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#5c4331] to-transparent flex-1" />
      </div>

      {/* Social & Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-2xl mx-auto">
        {/* Email Direct Contact Card */}
        <a
          href={`mailto:${email}`}
          onClick={handleLinkClick}
          aria-label={`Send email to ${email}`}
          className="group relative flex flex-col items-center justify-center p-4 sm:p-4.5 rounded-xl bg-[#1c130d]/90 hover:bg-[#281b13] border border-[#4d3728] hover:border-[#f59e0b] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:ring-offset-2 focus:ring-offset-[#140e0b]"
        >
          {/* Subtle CRT corner highlights */}
          <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#f59e0b] rounded-full transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#f59e0b] rounded-full transition-colors" />

          {/* Icon Container */}
          <div className="w-11 h-11 rounded-lg bg-[#251912] group-hover:bg-[#f59e0b]/15 border border-[#4a3425] group-hover:border-[#f59e0b]/60 flex items-center justify-center mb-2 transition-all duration-200 shadow-inner">
            <Mail className="w-5 h-5 text-[#c7b299] group-hover:text-[#fcd34d] group-hover:scale-110 transition-all duration-200" />
          </div>

          {/* Typography */}
          <span className="font-pixel text-[11px] text-[#fcd34d] group-hover:text-white uppercase tracking-wider mb-0.5">
            Email Me
          </span>
          <span className="text-[10px] font-mono text-[#a3907c] group-hover:text-[#fcd34d] truncate max-w-[170px] mb-1.5 text-center">
            {email}
          </span>

          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#150d08] hover:bg-[#332014] border border-[#523c2c] hover:border-[#f59e0b] text-[9px] font-mono text-[#c7b299] hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-2.5 h-2.5 text-[#a3907c]" />
                <span>Copy Mail</span>
              </>
            )}
          </button>
        </a>

        {/* LinkedIn Connection Card */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          aria-label="LinkedIn Profile"
          className="group relative flex flex-col items-center justify-center p-4 sm:p-4.5 rounded-xl bg-[#1c130d]/90 hover:bg-[#281b13] border border-[#4d3728] hover:border-[#0077b5] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,119,181,0.25)] transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#0077b5] focus:ring-offset-2 focus:ring-offset-[#140e0b]"
        >
          {/* Subtle CRT corner highlights */}
          <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#0077b5] rounded-full transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#0077b5] rounded-full transition-colors" />

          {/* Icon Container */}
          <div className="w-11 h-11 rounded-lg bg-[#251912] group-hover:bg-[#0077b5]/15 border border-[#4a3425] group-hover:border-[#0077b5]/60 flex items-center justify-center mb-2 transition-all duration-200 shadow-inner">
            <Linkedin className="w-5 h-5 text-[#c7b299] group-hover:text-[#38bdf8] group-hover:scale-110 transition-all duration-200" />
          </div>

          {/* Typography */}
          <span className="font-pixel text-[11px] text-[#fcd34d] group-hover:text-white uppercase tracking-wider mb-0.5">
            LinkedIn
          </span>
          <span className="text-[10px] font-mono text-[#8a7663] group-hover:text-[#38bdf8] flex items-center gap-1 mt-auto">
            <span>Profile</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
          </span>
        </a>

        {/* Instagram Connection Card */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          aria-label="Instagram Profile"
          className="group relative flex flex-col items-center justify-center p-4 sm:p-4.5 rounded-xl bg-[#1c130d]/90 hover:bg-[#281b13] border border-[#4d3728] hover:border-[#e1306c] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(225,48,108,0.25)] transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#e1306c] focus:ring-offset-2 focus:ring-offset-[#140e0b]"
        >
          {/* Subtle CRT corner highlights */}
          <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#e1306c] rounded-full transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#5c4331] group-hover:bg-[#e1306c] rounded-full transition-colors" />

          {/* Icon Container */}
          <div className="w-11 h-11 rounded-lg bg-[#251912] group-hover:bg-[#e1306c]/15 border border-[#4a3425] group-hover:border-[#e1306c]/60 flex items-center justify-center mb-2 transition-all duration-200 shadow-inner">
            <Instagram className="w-5 h-5 text-[#c7b299] group-hover:text-[#f43f5e] group-hover:scale-110 transition-all duration-200" />
          </div>

          {/* Typography */}
          <span className="font-pixel text-[11px] text-[#fcd34d] group-hover:text-white uppercase tracking-wider mb-0.5">
            Instagram
          </span>
          <span className="text-[10px] font-mono text-[#8a7663] group-hover:text-[#f43f5e] flex items-center gap-1 mt-auto">
            <span>Profile</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
          </span>
        </a>
      </div>

      {/* Retro system signature */}
      <div className="mt-5 text-center text-[10px] font-mono text-[#6b5847] flex items-center justify-center gap-2">
        <Sparkles className="w-2.5 h-2.5 text-[#f59e0b]" />
        <span>LET'S TALK RETRO TECH & TIME CAPSULES</span>
        <Sparkles className="w-2.5 h-2.5 text-[#f59e0b]" />
      </div>
    </div>
  );
};
