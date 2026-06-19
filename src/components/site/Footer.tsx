import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-6 py-12 mt-12 border-t border-foreground/5 bg-white/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-3.5" />
            </span>
            <span className="font-extrabold tracking-tight text-lg">AgriAI Assist</span>
          </div>
          <p className="text-xs text-foreground/50">Empowering 20 million+ farmers across India.</p>
        </div>
        <div className="flex gap-6 md:gap-8 text-xs font-bold text-foreground/60">
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Help Desk</a>
          <a href="#" className="hover:text-primary">WhatsApp</a>
          <a href="#" className="hover:text-primary">Sitemap</a>
        </div>
        <div className="hidden md:flex gap-3 items-center text-[11px] text-foreground/50">
          <span className="uppercase font-bold tracking-widest">Offices:</span>
          <span>Chandigarh · Bangalore · Patna</span>
        </div>
      </div>
      <div className="text-center mt-10 text-[10px] text-foreground/30 font-mono">
        © 2026 AgriAI Assist Technologies Pvt. Ltd. · All Rights Reserved
      </div>
    </footer>
  );
}
