/**
 * ContractEdit.jsx — Edit an existing contract from the per-user dataStore.
 * Loads by :id, pre-fills title + variables + content, saves back on draft/send.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import {
  ArrowLeft, Save, Eye, Send, Bold, Italic, UnderlineIcon,
  Heading1, Heading2, Minus, List, ListOrdered, AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../services/contractService';

const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } };

const VARIABLES = [
  { key: 'client_name',     label: 'Client Name',     placeholder: 'Priya Sharma' },
  { key: 'freelancer_name', label: 'Freelancer Name',  placeholder: 'Your name' },
  { key: 'amount',          label: 'Amount (₹)',       placeholder: '35,000' },
  { key: 'start_date',      label: 'Start Date',       placeholder: '01 Jun 2025' },
  { key: 'end_date',        label: 'End Date',         placeholder: '30 Jun 2025' },
  { key: 'scope_of_work',   label: 'Scope of Work',    placeholder: 'Web design & development' },
];

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={cn('p-1.5 rounded-md text-sm transition-colors',
        active
          ? 'text-[var(--accent-gold)] bg-[rgba(201,168,76,0.1)]'
          : 'text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary'
      )}>
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
  const [showSendModal, setSendM]   = useState(false);
  const [showPreview, setPreview]   = useState(false);
  const [sendData, setSendData]     = useState({ email: '', subject: 'Your contract is ready to sign', message: '', expiryDays: 7 });
  const [isSaving, setIsSaving]     = useState(false);
  const [savedStatus, setSaved]     = useState('');
  const [showVarsPanel, setVarsP]   = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your contract…' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
    ],
    content: '<p></p>',
    editorProps: { attributes: { class: 'ProseMirror focus:outline-none' } },
  });

  useEffect(() => {
    if (contract && editor) {
      setTitle(contract.title || 'Untitled Contract');
      try {
        setVarValues(contract.variablesData ? JSON.parse(contract.variablesData) : {});
      } catch (e) {
        setVarValues({});
      }
      editor.commands.setContent(contract.content || '');
      setSendData(prev => ({ ...prev, email: contract.recipientEmail || '' }));
    }
  }, [contract, editor]);

  if (isLoading) {
    return <div className="p-8 text-center text-fg-secondary">Loading contract...</div>;
  }
  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={40} className="text-amber-500" />
        <h2 className="text-lg font-semibold text-fg-primary">Contract not found</h2>
        <p className="text-sm text-fg-secondary">This contract doesn't exist or has been deleted.</p>
        <Button variant="primary" onClick={() => navigate('/contracts')}>Back to Contracts</Button>
      </div>
    );
  }

  const getPayload = () => ({
    title,
    content: editor?.getHTML() || '',
    recipientName: varValues.client_name || sendData.email || contract.recipientName || '',
    recipientEmail: sendData.email || contract.recipientEmail || '',
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
      toast.success('Draft saved');
    } catch (e) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!sendData.email) { toast.error('Enter client email'); return; }
    try {
      await contractService.update(id, getPayload());
      await contractService.send(id);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      toast.success(`Contract sent to ${sendData.email}!`);
      setSendM(false);
      navigate('/contracts');
    } catch (e) {
      toast.error('Failed to send contract');
    }
  };

  const insertVariable = (key) =>
    editor?.chain().focus().insertContent(`<span class="variable-highlight">{{${key}}}</span> `).run();

  const getPreviewContent = () => {
    let content = editor?.getHTML() || '';
    VARIABLES.forEach(({ key }) => {
      if (varValues[key]) content = content.replaceAll(`{{${key}}}`, varValues[key]);
    });
    return content;
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="h-full flex flex-col bg-gray-50">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 shrink-0">
        <button onClick={() => navigate('/contracts')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mr-1">
          <ArrowLeft size={16} /> Contracts
        </button>
        <div className="w-px h-5 bg-gray-200" />
        {editingTitle ? (
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setET(false)} onKeyDown={(e) => e.key === 'Enter' && setET(false)}
            className="text-sm font-medium text-gray-900 bg-transparent border-b border-brand-400 outline-none min-w-[200px] max-w-xs" />
        ) : (
          <button onClick={() => setET(true)} className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors truncate max-w-xs">
            {title}
          </button>
        )}
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setPreview(!showPreview)}>
          <Eye size={15} /> {showPreview ? 'Editor' : 'Preview'}
        </Button>
        <Button variant="secondary" size="sm" icon={<Save size={14} />} loading={isSaving} onClick={handleSaveDraft}>
          {savedStatus === 'saved' ? 'Saved ✓' : 'Save Draft'}
        </Button>
        <Button variant="primary" size="sm" icon={<Send size={14} />} onClick={() => setSendM(true)}>
          Send to Client
        </Button>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            {showPreview ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-6 flex items-center gap-2">
                  <Eye size={13} /> This is how your client will see the contract
                </div>
                <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
              </div>
            ) : (
              <div className="editor-surface rounded-xl border border-border-col shadow-sm p-8 min-h-[600px]">
                {editor && (
                  <div className="flex items-center gap-0.5 mb-4 pb-3 border-b border-border-col flex-wrap"
                    style={{ background: 'var(--bg-secondary)', margin: '-2rem -2rem 1rem', padding: '0.75rem 1.5rem', borderRadius: '12px 12px 0 0' }}>
                    <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={14} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={14} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
                    <div className="w-px h-4 bg-border-col mx-0.5" />
                    <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><Heading1 size={14} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><Heading2 size={14} /></ToolbarButton>
                    <div className="w-px h-4 bg-border-col mx-0.5" />
                    <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List size={14} /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered size={14} /></ToolbarButton>
                    <ToolbarButton active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolbarButton>
                  </div>
                )}
                <EditorContent editor={editor} />
              </div>
            )}
          </div>
        </div>

        {/* Variables panel */}
        {showVarsPanel && !showPreview && (
          <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 hidden xl:block">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Variables</span>
              <button onClick={() => setVarsP(false)} className="text-gray-400 hover:text-gray-600 text-xs">×</button>
            </div>
            <div className="space-y-3">
              {VARIABLES.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <div className="flex gap-1">
                    <input type="text" value={varValues[key] || ''}
                      onChange={(e) => setVarValues((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400" />
                    <button onClick={() => insertVariable(key)} title="Insert"
                      className="px-2 py-1.5 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors border border-brand-200 text-xs">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send modal */}
      <Modal isOpen={showSendModal} onClose={() => setSendM(false)} title="Send Contract" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
            <input type="email" value={sendData.email} onChange={(e) => setSendData({ ...sendData, email: e.target.value })}
              placeholder="client@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
            <input type="text" value={sendData.subject} onChange={(e) => setSendData({ ...sendData, subject: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Sign within</label>
            <select value={sendData.expiryDays} onChange={(e) => setSendData({ ...sendData, expiryDays: Number(e.target.value) })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white">
              {[3, 5, 7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setSendM(false)}>Cancel</Button>
            <Button variant="primary" fullWidth icon={<Send size={14} />} onClick={handleSend}>Send Contract</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
