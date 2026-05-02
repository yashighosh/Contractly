import { useState, useRef, useEffect } from 'react';
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
  Heading1, Heading2, Link2, Minus, List, ListOrdered,
  ChevronRight, X, Plus, Variable, PanelLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/authStore';
import { contractService } from '../services/contractService';
import { useQueryClient } from '@tanstack/react-query';

const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } };

const DEFAULT_CONTENT = `<h1>Contract Agreement</h1>
<p>This agreement is between <span class="variable-highlight">{{client_name}}</span> (the "Client") and <span class="variable-highlight">{{freelancer_name}}</span> (the "Freelancer"), effective from <span class="variable-highlight">{{start_date}}</span>.</p>
<h2>Scope of Work</h2>
<p>The Freelancer agrees to provide the following services: <span class="variable-highlight">{{scope_of_work}}</span></p>
<h2>Payment Terms</h2>
<p>The Client agrees to pay <span class="variable-highlight">{{amount}}</span> for the completion of the services described above.</p>
<h2>Timeline</h2>
<p>The project shall be completed by <span class="variable-highlight">{{end_date}}</span>.</p>
<h2>Confidentiality</h2>
<p>Both parties agree to keep confidential any proprietary information shared during the course of this engagement.</p>
<h2>Termination</h2>
<p>Either party may terminate this agreement with 14 days written notice.</p>`;

const VARIABLES = [
  { key: 'client_name',      label: 'Client Name',      placeholder: 'Priya Sharma' },
  { key: 'freelancer_name',  label: 'Freelancer Name',  placeholder: 'Your name' },
  { key: 'amount',           label: 'Amount (₹)',        placeholder: '35,000' },
  { key: 'start_date',       label: 'Start Date',        placeholder: '01 Jun 2025' },
  { key: 'end_date',         label: 'End Date',          placeholder: '30 Jun 2025' },
  { key: 'scope_of_work',    label: 'Scope of Work',     placeholder: 'Web design & development' },
];

const CLAUSE_TEMPLATES = [
  { title: 'Payment Terms (30 Days)', content: 'Client agrees to pay the invoice within 30 days of receipt. Late payments will incur a 2% monthly interest charge.' },
  { title: 'Intellectual Property', content: 'Upon full payment, all intellectual property rights for the deliverables transfer to the Client.' },
  { title: 'Revision Policy', content: 'This agreement includes up to 3 rounds of revisions. Additional revisions will be billed at ₹2,000/hour.' },
  { title: 'Confidentiality NDA', content: 'Both parties agree to maintain strict confidentiality regarding all proprietary information shared during this engagement.' },
];

function ToolbarButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn('editor-toolbar-btn', active && 'is-active')}
    >
      {children}
    </button>
  );
}

export default function ContractNew() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
  const userId    = user?.id;
  const [contractId, setContractId] = useState(null); // set after first save
  const [title, setTitle] = useState('Untitled Contract');
  const [editingTitle, setEditingTitle] = useState(false);
  const queryClient = useQueryClient();
  const [varValues, setVarValues] = useState({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sendData, setSendData] = useState({ email: '', subject: 'Your contract is ready to sign', message: '', expiryDays: 7 });
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');
  const [showOutline, setShowOutline] = useState(true);
  const [showVarsPanel, setShowVarsPanel] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your contract… Type / for commands' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
    ],
    content: DEFAULT_CONTENT,
    editorProps: {
      attributes: { class: 'ProseMirror focus:outline-none' },
    },
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const payload = {
      title,
      content: editor?.getHTML() || '',
      recipientName: varValues.client_name || '',
      amount: varValues.amount ? Number(String(varValues.amount).replace(/[^0-9.]/g, '')) : null,
      variablesData: JSON.stringify(varValues),
    };

    try {
      if (contractId) {
        await contractService.update(contractId, payload);
      } else {
        const res = await contractService.create(payload);
        setContractId(res.id);
      }
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setSavedStatus('saved');
      setTimeout(() => setSavedStatus(''), 3000);
      toast.success('Draft saved');
    } catch (e) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!sendData.email) { toast.error('Enter client email'); return; }
    
    const payload = {
      title,
      content: editor?.getHTML() || '',
      recipientName: varValues.client_name || sendData.email,
      recipientEmail: sendData.email,
      amount: varValues.amount ? Number(String(varValues.amount).replace(/[^0-9.]/g, '')) : null,
      variablesData: JSON.stringify(varValues),
    };

    try {
      let id = contractId;
      if (id) {
        await contractService.update(id, payload);
      } else {
        const res = await contractService.create(payload);
        id = res.id;
        setContractId(res.id);
      }
      
      await contractService.send(id);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success(`Contract sent to ${sendData.email}!`);
      setShowSendModal(false);
      navigate('/contracts');
    } catch (e) {
      toast.error('Failed to send contract');
    }
  };

  const insertVariable = (key) => {
    editor?.chain().focus().insertContent(`<span class="variable-highlight">{{${key}}}</span> `).run();
  };

  const getPreviewContent = () => {
    let content = editor?.getHTML() || '';
    VARIABLES.forEach(({ key }) => {
      const val = varValues[key];
      if (val) content = content.replaceAll(`{{${key}}}`, val);
    });
    return content;
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate"
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0F1A2E' }}>

      {/* ── Sub-topbar (Fix 5) ── */}
      <div style={{
        height: 52, background: '#111F38', borderBottom: '0.5px solid #1E2D45',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0,
      }}>
        {/* Left: breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/contracts')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#8896AD', fontSize: 13 }}
            onMouseEnter={e => e.currentTarget.style.color = '#EDF0F7'}
            onMouseLeave={e => e.currentTarget.style.color = '#8896AD'}
          >
            <ArrowLeft size={14} /> Contracts
          </button>
          <span style={{ color: '#4A5A72', fontSize: 13 }}>/</span>
          {editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              style={{
                background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.5)',
                color: '#EDF0F7', fontSize: 13, fontWeight: 500, outline: 'none', minWidth: 180,
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDF0F7', fontSize: 13, fontWeight: 500 }}
            >
              {title}
            </button>
          )}
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: 'none', border: '0.5px solid #1E2D45', borderRadius: 8,
              color: '#8896AD', fontSize: 13, padding: '5px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#EDF0F7'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8896AD'; e.currentTarget.style.borderColor = '#1E2D45'; }}
          >
            <Eye size={13} /> {showPreview ? 'Editor' : 'Preview'}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            style={{
              background: '#172035', border: '0.5px solid #1E2D45', borderRadius: 8,
              color: '#EDF0F7', fontSize: 13, padding: '5px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, sans-serif',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Save size={13} /> {savedStatus === 'saved' ? 'Saved ✓' : 'Save Draft'}
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            style={{
              background: '#C9A84C', border: 'none', borderRadius: 8,
              color: '#0B1629', fontSize: 13, fontWeight: 600, padding: '5px 14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E2C87A'}
            onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
          >
            <Send size={13} /> Send to Client
          </button>
        </div>
      </div>

      {/* ── Body (3-column) ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Fix 4 — Left outline panel */}
        {showOutline && !showPreview && (
          <div className="hidden lg:flex flex-col" style={{
            width: 220, flexShrink: 0, background: '#111F38',
            borderRight: '0.5px solid #1E2D45', overflowY: 'auto',
          }}>
            <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4A5A72' }}>Outline</span>
              <button onClick={() => setShowOutline(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5A72', fontSize: 16, lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = '#8896AD'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A5A72'}
              >×</button>
            </div>
            <div style={{ padding: '0 8px' }}>
              {['Scope of Work', 'Payment Terms', 'Timeline', 'Confidentiality', 'Termination'].map((c) => (
                <button key={c}
                  style={{ display: 'block', width: '100%', textAlign: 'left', fontSize: 13, color: '#8896AD', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px', borderRadius: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#8896AD'; e.currentTarget.style.background = 'none'; }}
                >{c}</button>
              ))}
            </div>
            <div style={{ margin: '12px 16px 8px', borderTop: '0.5px solid #1E2D45', paddingTop: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4A5A72' }}>Clause Library</span>
            </div>
            <div style={{ padding: '0 8px 12px' }}>
              {CLAUSE_TEMPLATES.map((cl) => (
                <button
                  key={cl.title}
                  onClick={() => editor?.chain().focus().insertContent(`<p>${cl.content}</p>`).run()}
                  style={{ display: 'block', width: '100%', textAlign: 'left', fontSize: 12, color: '#4A5A72', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4A5A72'; e.currentTarget.style.background = 'none'; }}
                >+ {cl.title}</button>
              ))}
            </div>
          </div>
        )}

        {/* Fix 1 — Center editor area — ALWAYS dark shell, white paper inside */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#0F1A2E', padding: '40px 32px' }}>
          {showPreview ? (
            <div
              data-theme="light"
              className="contract-paper mx-auto"
              style={{
                maxWidth: 760, background: '#FFFFFF', color: '#1A202C',
                borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                padding: '48px 64px',
              }}
            >
              <div style={{ fontSize: 12, color: '#92600A', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '8px 14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={13} /> This is how your client will see the contract
              </div>
              <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
            </div>
          ) : (
            // Fix 2 — Paper div with INLINE style (beats Tailwind dark variants)
            <div
              className="contract-paper mx-auto"
              style={{
                maxWidth: 760,
                background: '#FFFFFF',   // inline style always wins over dark mode
                color: '#1A202C',
                borderRadius: 10,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Fix 6 — Toolbar: light surface, inside paper */}
              {editor && (
                <div className="editor-toolbar">
                  <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={14} /></ToolbarButton>
                  <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={14} /></ToolbarButton>
                  <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
                  <div style={{ width: 1, height: 16, background: '#E2E8F0', margin: '0 4px' }} />
                  <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><Heading1 size={14} /></ToolbarButton>
                  <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><Heading2 size={14} /></ToolbarButton>
                  <div style={{ width: 1, height: 16, background: '#E2E8F0', margin: '0 4px' }} />
                  <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List size={14} /></ToolbarButton>
                  <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered size={14} /></ToolbarButton>
                  <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><span style={{ fontSize: 11, fontWeight: 700, background: '#FEF08A', padding: '0 2px', borderRadius: 2 }}>H</span></ToolbarButton>
                  <ToolbarButton active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolbarButton>
                </div>
              )}
              {/* Editor content */}
              <div style={{ padding: '48px 56px' }}>
                <EditorContent editor={editor} />
              </div>
            </div>
          )}
        </div>

        {/* Fix 3 — Right Variables panel */}
        {showVarsPanel && !showPreview && (
          <div className="hidden xl:flex flex-col" style={{
            width: 260, flexShrink: 0, background: '#111F38',
            borderLeft: '0.5px solid #1E2D45', overflowY: 'auto',
          }}>
            <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #1E2D45' }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4A5A72' }}>Variables</span>
              <button onClick={() => setShowVarsPanel(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5A72', fontSize: 18, lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = '#8896AD'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A5A72'}
              >×</button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {VARIABLES.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: '#8896AD', marginBottom: 6, display: 'block' }}>{label}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={varValues[key] || ''}
                      onChange={(e) => setVarValues((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{
                        flex: 1, height: 36,
                        background: '#172035', border: '0.5px solid #1E2D45', borderRadius: 8,
                        color: '#EDF0F7', fontSize: 13, padding: '0 10px', outline: 'none',
                        fontFamily: 'DM Sans, system-ui, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = '#1E2D45'}
                    />
                    <button
                      onClick={() => insertVariable(key)}
                      title="Insert into document"
                      style={{
                        width: 32, height: 36, background: 'rgba(201,168,76,0.1)',
                        border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 8,
                        color: '#C9A84C', fontSize: 16, cursor: 'pointer', flexShrink: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send Contract Modal */}
      <Modal isOpen={showSendModal} onClose={() => setShowSendModal(false)} title="Send Contract" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
            <input
              type="email"
              value={sendData.email}
              onChange={(e) => setSendData({ ...sendData, email: e.target.value })}
              placeholder="client@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
            <input
              type="text"
              value={sendData.subject}
              onChange={(e) => setSendData({ ...sendData, subject: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Message (optional)</label>
            <textarea
              rows={3}
              value={sendData.message}
              onChange={(e) => setSendData({ ...sendData, message: e.target.value })}
              placeholder="Hi, please find your contract attached…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Sign within</label>
            <select
              value={sendData.expiryDays}
              onChange={(e) => setSendData({ ...sendData, expiryDays: Number(e.target.value) })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
            >
              {[3, 5, 7, 14, 30].map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setShowSendModal(false)}>Cancel</Button>
            <Button variant="primary" fullWidth icon={<Send size={14} />} onClick={handleSend}>Send Contract</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
