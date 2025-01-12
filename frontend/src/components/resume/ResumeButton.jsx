import { FileDown } from 'lucide-react';

export const ResumeButton = () => (
  <a 
    href="public/assets/brian-resume.pdf" 
    download="Brian-Mutai-Resume.pdf"
    className="flex items-center gap-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-4 py-2 rounded transition-colors"
  >
    <FileDown size={20} />
    <span data-translate>Download Resume</span>
  </a>
);
