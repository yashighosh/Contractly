import { useState, useEffect } from 'react';
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
  Heading1, Heading2, Minus, List, ListOrdered, AlertTriangle,
  ChevronRight, X, Plus, Variable, PanelLeft, FileText, ShieldCheck, CheckCircle2, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../services/contractService';

const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } };

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

export default function ContractEdit() {
  const navigate       = useNavigate();
  const { id }         = useParams();
  const { user }       = useAuthStore();
  const userId         = user?.id;

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractService.getById(id),
  });

  const queryClient = useQueryClient();

  const [title, setTitle]           = useState('Untitled Contract');
  const [editingTitle, setET]       = useState(false);
  const [varValues, setVarValues]   = useState({});
  const [showPreview, setPreview]   = useState(false);
  const [isSaving, setIsSaving]     = useState(false);
  const [savedStatus, setSaved]     = useState('');
  const [showVarsPanel, setVarsP]   = useState(true);
  const [showOutline, setShowOutline] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your contract…' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
      VariableHighlight,
    ],
    content: '<p></p>',
    editorProps: { attributes: { class: 'ProseMirror focus:outline-none min-h-[600px] text-slate-800' } },
  });

  useEffect(() => {
    if (contract && editor) {
      setTitle(contract.title || 'Untitled Contract');
      try {
        setVarValues(contract.variablesData ? JSON.parse(contract.variablesData) : {});
      } catch (e) {
        setVarValues({});
      }
      if (editor.getHTML() === '<p></p>' && contract.content) {
        editor.commands.setContent(contract.content);
      }
    }
  }, [contract, editor]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 bg-[#0B1324] h-full">Loading contract...</div>;
  }
  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#0B1324] h-full">
        <AlertTriangle size={48} className="text-amber-500" />
        <h2 className="text-xl font-semibold text-white">Contract not found</h2>
        <p className="text-sm text-slate-400">This contract doesn't exist or has been deleted.</p>
        <button 
          onClick={() => navigate('/contracts')}
          className="mt-4 px-6 py-2.5 rounded-lg bg-[#C9A84C] text-[#0A1121] font-semibold hover:bg-[#E2C87A] transition-colors"
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  const getPayload = () => ({
    title,
    content: editor?.getHTML() || '',
    recipientName: varValues.client_name || contract.recipientName || '',
    amount: varValues.amount ? Number(String(varValues.amount).replace(/[^0-9.]/g, '')) : contract.amount,
    variablesData: JSON.stringify(varValues),
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await contractService.update(id, getPayload());
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      setSaved('saved');
      setTimeout(() => setSaved(''), 3000);
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
    editor.state.doc.content.forEach((node, offset) => {
      if (node.textContent.includes('Client:') && node.textContent.includes('Contractor:')) {
        insertPos = offset;
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
      await contractService.update(id, getPayload());
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      
      toast.success('Contract downloaded as PDF!', { icon: '📄' });
    } catch (e) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (key) =>
    editor?.chain().focus().insertVariable(key).run();

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
                onBlur={() => setET(false)}
                onKeyDown={(e) => e.key === 'Enter' && setET(false)}
                className="bg-transparent border-b border-[#C9A84C] text-white text-base font-semibold outline-none min-w-[220px] px-1 pb-0.5"
              />
            ) : (
              <button
                onClick={() => setET(true)}
                className="bg-transparent border-none cursor-pointer text-white text-base font-semibold tracking-wide hover:text-[#C9A84C] transition-colors px-1"
              >
                {title}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!showPreview)}
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
              onClick={() => setVarsP(true)}
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
                <div className="p-12 lg:p-[4.5rem] contract-paper" style={editorStyles}>
                  <EditorContent editor={editor} />
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
                <button onClick={() => setVarsP(false)} className="text-slate-500 hover:text-white transition-colors">
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
