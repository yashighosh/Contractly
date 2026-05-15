import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import VariableHighlight from '../utils/variableHighlight';
import {
  ArrowLeft, Save, Eye, Send, Bold, Italic, UnderlineIcon,
  Heading1, Heading2, Link2, Minus, List, ListOrdered,
  ChevronRight, X, Plus, Variable, PanelLeft, FileText, ShieldCheck, CheckCircle2, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/authStore';
import { contractService } from '../services/contractService';
import { useQueryClient } from '@tanstack/react-query';
import { WatermarkOverlay } from '../components/ui/WatermarkOverlay';

const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } };

const DEFAULT_CONTENT = `<h1 style="text-align: center; color: #111827; font-size: 2.25rem; margin-bottom: 2rem; font-family: 'Times New Roman', serif; text-transform: uppercase; letter-spacing: 0.05em;">Independent Contractor Agreement</h1>
<p style="text-align: right; color: #4B5563; margin-bottom: 3rem; font-size: 1.1rem;"><strong>Date:</strong> <span class="variable-highlight" data-var="start_date">{{start_date}}</span></p>

<p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">This Independent Contractor Agreement (this "Agreement") is entered into as of the date written above by and between <strong><span class="variable-highlight" data-var="client_name">{{client_name}}</span></strong> (the "Client") and <strong><span class="variable-highlight" data-var="freelancer_name">{{freelancer_name}}</span></strong> (the "Contractor").</p>

<h2 style="color: #1F2937; margin-top: 2rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">1. Services Provided</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">The Contractor agrees to perform the following services (the "Services"):</p>
<p style="padding: 1rem 1.5rem; background-color: #F9FAFB; border-left: 4px solid #C9A84C; border-radius: 4px; font-size: 1.05rem; margin-top: 1rem;"><span class="variable-highlight" data-var="scope_of_work">{{scope_of_work}}</span></p>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">2. Compensation</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">In consideration for the Services provided, the Client agrees to pay the Contractor the total sum of <strong><span class="variable-highlight" data-var="amount">{{amount}}</span></strong>. Payment shall be made according to the following schedule:</p>
<ul style="font-size: 1.05rem; line-height: 1.7;">
  <li>50% non-refundable deposit due upon signing of this Agreement.</li>
  <li>50% final payment due upon completion of the Services.</li>
</ul>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">3. Term and Timeline</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">This Agreement will become effective on <span class="variable-highlight" data-var="start_date">{{start_date}}</span> and will remain in effect until the Services are completed, which is estimated to be no later than <strong><span class="variable-highlight" data-var="end_date">{{end_date}}</span></strong>.</p>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">4. Independent Contractor Status</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">The Contractor is an independent contractor, not an employee of the Client. The Contractor is solely responsible for all taxes, withholdings, and other statutory or regulatory obligations.</p>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">5. Confidentiality</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">The Contractor acknowledges that during the engagement, they will have access to confidential information of the Client. The Contractor agrees not to disclose or use any confidential information except as necessary to perform the Services.</p>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">6. Intellectual Property</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">Upon full payment of the compensation described in Section 2, the Contractor agrees that all right, title, and interest in and to the work product developed under this Agreement shall belong exclusively to the Client.</p>

<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">7. Termination</h2>
<p style="font-size: 1.05rem; line-height: 1.7;">Either party may terminate this Agreement at any time with or without cause by providing 14 days written notice to the other party. Upon termination, the Client shall pay the Contractor for all Services performed up to the date of termination.</p>

<div style="margin-top: 5rem; display: flex; justify-content: space-between;">
  <div style="width: 45%;">
    <p style="font-size: 1.1rem; color: #4B5563;"><strong>Client:</strong></p>
    <div style="border-bottom: 1px solid #9CA3AF; height: 3.5rem; margin-bottom: 0.5rem;"></div>
    <p style="font-size: 1.1rem; font-weight: 600;"><span class="variable-highlight" data-var="client_name">{{client_name}}</span></p>
  </div>
  <div style="width: 45%;">
    <p style="font-size: 1.1rem; color: #4B5563;"><strong>Contractor:</strong></p>
    <div style="border-bottom: 1px solid #9CA3AF; height: 3.5rem; margin-bottom: 0.5rem;"></div>
    <p style="font-size: 1.1rem; font-weight: 600;"><span class="variable-highlight" data-var="freelancer_name">{{freelancer_name}}</span></p>
  </div>
</div>`;

const VARIABLES = [
  { key: 'client_name',      label: 'Client Name',      placeholder: 'e.g. Acme Corp' },
  { key: 'freelancer_name',  label: 'Freelancer Name',  placeholder: 'e.g. Jane Doe' },
  { key: 'amount',           label: 'Amount (₹)',        placeholder: 'e.g. 50,000' },
  { key: 'start_date',       label: 'Start Date',        placeholder: 'e.g. 01 Oct 2025', type: 'date' },
  { key: 'end_date',         label: 'End Date',          placeholder: 'e.g. 31 Dec 2025', type: 'date' },
  { key: 'scope_of_work',    label: 'Scope of Work',     placeholder: 'e.g. Website redesign and SEO' },
];

const CLAUSE_TEMPLATES = [
  { title: 'Payment Terms (30 Days)', content: 'Client agrees to pay the invoice within 30 days of receipt. Late payments will incur a 2% monthly interest charge.' },
  { title: 'Intellectual Property', content: 'Upon full payment, all intellectual property rights for the deliverables transfer to the Client.' },
  { title: 'Revision Policy', content: 'This agreement includes up to 3 rounds of revisions. Additional revisions will be billed at ₹2,000/hour.' },
  { title: 'Confidentiality NDA', content: 'Both parties agree to maintain strict confidentiality regarding all proprietary information shared during this engagement.' },
  { title: 'Governing Law', content: 'This Agreement shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law principles.' }
];

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-md text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900',
        active && 'bg-slate-200 text-slate-900 shadow-inner'
      )}
    >
      {children}
    </button>
  );
}

export default function ContractNew() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const userId    = user?.id;
  const [contractId, setContractId] = useState(null);
  const [title, setTitle] = useState('Untitled Contract');
  const [editingTitle, setEditingTitle] = useState(false);
  const queryClient = useQueryClient();
  const [varValues, setVarValues] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(true); // SIMULATED: Always true for testing watermark logic
  const [savedStatus, setSavedStatus] = useState('');
  const [showOutline, setShowOutline] = useState(true);
  const [showVarsPanel, setShowVarsPanel] = useState(true);
  const [logoUrl, setLogoUrl] = useState(null);
  const hasPremiumBranding = user?.plan === 'PRO' || user?.plan === 'AGENCY';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your contract… Type / for commands' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
      VariableHighlight,
    ],
    content: DEFAULT_CONTENT,
    editorProps: {
      attributes: { class: 'ProseMirror focus:outline-none min-h-[600px] text-slate-800' },
    },
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error('Logo must be under 2MB');
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setLogoUrl(base64);
        toast.success('Logo uploaded! It will appear at the top of your contract.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const payload = {
      title,
      content: editor?.getHTML() || '',
      recipientName: varValues.client_name || '',
      amount: varValues.amount ? Number(String(varValues.amount).replace(/[^0-9.]/g, '')) : null,
      variablesData: JSON.stringify(varValues),
      logoUrl: logoUrl || '',
    };

    try {
      if (contractId) {
        await contractService.update(contractId, payload);
      } else {
        const res = await contractService.create(payload);
        setContractId(res._id || res.id);
      }
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setSavedStatus('saved');
      setTimeout(() => setSavedStatus(''), 3000);
      toast.success('Draft saved successfully', { icon: '📝' });
    } catch (e) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const insertClause = (cl) => {
    if (!editor) return;
    const clauseHtml = `<h2 style="color: #1F2937; margin-top: 2.5rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 0.5rem; font-family: 'Times New Roman', serif;">${cl.title}</h2><p style="font-size: 1.05rem; line-height: 1.7;">${cl.content}</p>`;
    
    let insertPos = editor.state.doc.content.size;
    let found = false;
    editor.state.doc.content.forEach((node, offset) => {
      if (!found && node.textContent.toLowerCase().includes('client:')) {
        insertPos = offset;
        found = true;
      }
    });
    
    editor.chain().focus().insertContentAt(insertPos, clauseHtml).run();
  };

  const handleSaveAsPDF = async () => {
    setIsSaving(true);
    try {
      // Create a temporary element for PDF rendering
      const element = document.createElement('div');
      element.innerHTML = getPreviewContent();
      element.style.padding = '40px';
      element.style.fontFamily = 'Georgia, serif';
      element.style.color = '#1A202C';
      element.style.backgroundColor = '#FFFFFF';
      element.style.lineHeight = '1.8';

      const opt = {
        margin:       15,
        filename:     `${title || 'Contract'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(opt).save();
      
      // Auto-save draft in background
      const payload = {
        title,
        content: editor?.getHTML() || '',
        recipientName: varValues.client_name || '',
        amount: varValues.amount ? Number(String(varValues.amount).replace(/[^0-9.]/g, '')) : null,
        variablesData: JSON.stringify(varValues),
      };
      if (contractId) {
        await contractService.update(contractId, payload);
      } else {
        const res = await contractService.create(payload);
        setContractId(res._id || res.id);
      }
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      
      toast.success('Contract downloaded as PDF!', { icon: '📄' });
    } catch (e) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (key) => {
    editor?.chain().focus().insertVariable(key).run();
  };

  const editorStyles = {};
  VARIABLES.forEach(({ key }) => {
    editorStyles[`--var-${key}`] = varValues[key] ? `"${varValues[key]}"` : `"{{${key}}}"`;
  });

  const getPreviewContent = () => {
    let content = editor?.getHTML() || '';
    VARIABLES.forEach(({ key }) => {
      const val = varValues[key] || `[${key}]`;
      const regex = new RegExp(`<span[^>]*class="variable-highlight"[^>]*data-var="${key}"[^>]*>.*?</span>`, 'g');
      content = content.replace(regex, `<span style="background-color: #FEF3C7; padding: 0 4px; border-radius: 4px; border-bottom: 1px solid #F59E0B; font-weight: 600; color: #92600A; font-size: 1rem;">${val}</span>`);
      content = content.replaceAll(`{{${key}}}`, `<span style="background-color: #FEF3C7; padding: 0 4px; border-radius: 4px; border-bottom: 1px solid #F59E0B; font-weight: 600; color: #92600A; font-size: 1rem;">${val}</span>`);
    });
    if (isOverLimit) {
      const watermarkHtml = `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.05; display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; align-content: center; overflow: hidden; z-index: 1;">` +
        Array.from({ length: 12 }).map(() => `<span style="font-size: 72px; font-weight: 900; color: #000; transform: rotate(-30deg); white-space: nowrap; margin: 60px;">CONTRACTLY</span>`).join('') +
        `</div>`;
      content = `<div style="position: relative;">${watermarkHtml}<div>${content}</div></div>`;
    }
    return content;
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      className="flex flex-col h-full bg-[#0B1324] font-sans text-slate-300">

      {/* Modern Sub-topbar */}
      <div className="h-16 bg-[#111C32]/95 backdrop-blur-md border-b border-[#1E2D45] flex items-center justify-between px-6 shrink-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contracts')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A2642] hover:bg-[#233457] text-slate-400 hover:text-white transition-all shadow-inner"
            title="Back to Contracts"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="h-6 w-px bg-[#1E2D45]"></div>

          <div className="flex items-center gap-2 group">
            <FileText size={18} className="text-[#C9A84C]" />
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="bg-transparent border-b border-[#C9A84C] text-white text-base font-semibold outline-none min-w-[220px] px-1 pb-0.5"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="bg-transparent border-none cursor-pointer text-white text-base font-semibold tracking-wide hover:text-[#C9A84C] transition-colors px-1"
              >
                {title}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
              showPreview 
                ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]" 
                : "bg-[#1A2642] border-[#2A3B5C] text-slate-300 hover:bg-[#233457] hover:text-white hover:border-[#384B70]"
            )}
          >
            {showPreview ? <><Bold size={14} /> Editor Mode</> : <><Eye size={14} /> Preview Document</>}
          </button>
          
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#1A2642] border border-[#2A3B5C] text-slate-300 hover:bg-[#233457] hover:border-[#384B70] hover:text-white transition-all disabled:opacity-50"
          >
            {savedStatus === 'saved' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Save size={14} />} 
            {savedStatus === 'saved' ? 'Saved' : 'Save Draft'}
          </button>
          
          <button
            onClick={handleSaveAsPDF}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0A1121] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-[1px] border border-[#F3E5AB]/50 disabled:opacity-50"
          >
            <Download size={14} /> Save as PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left outline panel */}
        <AnimatePresence>
          {showOutline && !showPreview && (
            <motion.div 
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              className="hidden lg:flex flex-col w-[260px] shrink-0 bg-[#0B1324] border-r border-[#1E2D45] overflow-y-auto"
            >
              <div className="p-5 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Document Outline</span>
                <button onClick={() => setShowOutline(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Logo Section (Premium) */}
              {hasPremiumBranding ? (
                <div className="mb-8 px-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#C9A84C]" /> Contract Branding
                  </h3>
                  <div className="space-y-4">
                    <label className="block">
                      <div className="relative group cursor-pointer">
                        <input 
                          type="file" accept="image/png, image/svg+xml, image/jpeg" 
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-xl group-hover:border-[#C9A84C] transition-colors bg-[#111C32]">
                          {logoUrl ? (
                            <div className="relative">
                              <img src={logoUrl} alt="Logo" className="h-12 object-contain" />
                              <div className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-lg" onClick={(e) => { e.stopPropagation(); setLogoUrl(null); }}>
                                <X size={10} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Plus size={20} className="text-slate-400 group-hover:text-[#C9A84C] mb-2" />
                              <span className="text-xs text-slate-500 font-medium">Click to upload</span>
                            </>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mb-8 mx-5 p-4 rounded-xl bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)]">
                  <h3 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Zap size={14} /> Unlock Branding
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">Upgrade to Pro or Agency to add your custom logo to every contract.</p>
                  <button onClick={() => navigate('/settings?tab=billing')} className="w-full py-2 bg-[#C9A84C] text-[#0B1629] text-xs font-bold rounded-lg shadow-sm">Upgrade Now</button>
                </div>
              )}

              <div className="px-3 space-y-1">
                {['Scope of Work', 'Compensation', 'Term and Timeline', 'Confidentiality', 'Termination'].map((c) => (
                  <button key={c}
                    className="w-full text-left text-[13px] text-slate-400 bg-transparent border-none cursor-pointer py-2 px-3 rounded-md hover:bg-[#1A2642] hover:text-[#C9A84C] transition-all flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[#C9A84C] transition-colors" />
                    {c}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 mx-5 pt-5 border-t border-[#1E2D45]">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#C9A84C]" /> Clause Library
                </span>
              </div>
              <div className="p-3 space-y-1 mt-2">
                {CLAUSE_TEMPLATES.map((cl) => (
                  <button
                    key={cl.title}
                    onClick={() => insertClause(cl)}
                    className="w-full text-left text-xs text-slate-400 bg-transparent border border-transparent cursor-pointer py-3 px-3 rounded-md hover:bg-[#1A2642] hover:border-[#2A3B5C] hover:text-white transition-all flex flex-col gap-1.5"
                  >
                    <span className="font-medium text-[#C9A84C] flex items-center gap-1.5"><Plus size={12}/> {cl.title}</span>
                    <span className="truncate w-full text-slate-500 text-[10px] leading-relaxed">{cl.content}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center editor area */}
        <div className="flex-1 overflow-y-auto bg-[#070D18] p-6 lg:p-10 custom-scrollbar relative">
          {!showOutline && !showPreview && (
            <button 
              onClick={() => setShowOutline(true)}
              className="absolute left-6 top-8 z-10 w-9 h-9 rounded-full bg-[#1A2642] border border-[#2A3B5C] flex items-center justify-center text-slate-400 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105"
              title="Show Outline"
            >
              <PanelLeft size={16} />
            </button>
          )}
          
          {!showVarsPanel && !showPreview && (
            <button 
              onClick={() => setShowVarsPanel(true)}
              className="absolute right-6 top-8 z-10 w-9 h-9 rounded-full bg-[#1A2642] border border-[#2A3B5C] flex items-center justify-center text-slate-400 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105"
              title="Show Variables"
            >
              <Variable size={16} />
            </button>
          )}

          <div className="max-w-[850px] mx-auto transition-all duration-300 pb-12">
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FAFAFA] rounded-xl shadow-[0_25px_65px_-12px_rgba(0,0,0,0.65)] overflow-hidden border border-slate-200"
              >
                <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-6 py-3.5 flex items-center justify-center gap-2 text-[#92600A] text-sm font-medium shadow-sm">
                  <Eye size={16} /> Previewing Client View
                </div>
                <div className="p-12 lg:p-[4.5rem] min-h-[800px] contract-paper">
                  <div className="ProseMirror !max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FFFFFF] rounded-xl shadow-[0_25px_65px_-12px_rgba(0,0,0,0.65)] overflow-hidden border border-slate-200"
              >
                {/* Floating-style Toolbar */}
                {editor && (
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-1 sticky top-0 z-10 shadow-sm flex-wrap">
                    <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={16} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={16} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={16} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-2" />
                    <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1"><Heading1 size={16} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2"><Heading2 size={16} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-2" />
                    <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List"><List size={16} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List"><ListOrdered size={16} /></ToolbarButton>
                    <div className="w-px h-6 bg-slate-300 mx-2" />
                    <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><div className="bg-[#FEF08A] px-1 rounded text-xs font-bold text-slate-800">H</div></ToolbarButton>
                    <ToolbarButton active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={16} /></ToolbarButton>
                  </div>
                )}
                
                {/* Decorative Document Header */}
                <div className="h-2.5 w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" />
                
                {/* Editor Content Area */}
                <div className="editor-container bg-white shadow-2xl rounded-sm mx-auto relative overflow-hidden" style={{ width: '100%', minHeight: '1056px', padding: '4.5rem' }}>
                  {isOverLimit && <WatermarkOverlay />}
                  
                  {/* Dynamic Logo Header */}
                  {logoUrl && (
                    <div className="mb-8 flex justify-start">
                      <img src={logoUrl} alt="Company Logo" className="max-h-16 max-w-[200px] object-contain" />
                    </div>
                  )}

                  <div style={editorStyles}>
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Variables panel */}
        <AnimatePresence>
          {showVarsPanel && !showPreview && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="hidden xl:flex flex-col w-[300px] shrink-0 bg-[#0B1324] border-l border-[#1E2D45] overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.3)] z-10"
            >
              <div className="p-5 flex items-center justify-between border-b border-[#1E2D45] bg-[#0B1324]/90 sticky top-0 backdrop-blur-md z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#1A2642] flex items-center justify-center border border-[#2A3B5C]">
                    <Variable size={12} className="text-[#C9A84C]" />
                  </div>
                  Smart Variables
                </span>
                <button onClick={() => setShowVarsPanel(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-5 flex flex-col gap-6">
                <p className="text-[13px] text-slate-400 leading-relaxed border-l-2 border-[#C9A84C] pl-3 py-0.5 bg-[#1A2642]/30 rounded-r-md">
                  Fill in these fields to automatically populate them throughout your document.
                </p>
                {VARIABLES.map(({ key, label, placeholder, type }) => (
                  <div key={key} className="group">
                    <label className="text-xs font-semibold text-slate-400 mb-2 block group-focus-within:text-[#C9A84C] transition-colors tracking-wide uppercase">{label}</label>
                    <div className="flex gap-2">
                      <input
                        type={type || 'text'}
                        value={varValues[key] || ''}
                        onChange={(e) => setVarValues((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="flex-1 h-10 bg-[#1A2642] border border-[#2A3B5C] rounded-lg text-sm text-white px-3 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all placeholder:text-slate-600 shadow-inner"
                      />
                      <button
                        onClick={() => insertVariable(key)}
                        title="Insert variable into document"
                        className="w-10 h-10 rounded-lg bg-[#1A2642] border border-[#2A3B5C] text-slate-400 flex items-center justify-center hover:bg-[#C9A84C]/15 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all shrink-0 shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Removed Send Modal */}
    </motion.div>
  );
}
