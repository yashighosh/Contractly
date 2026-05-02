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
import { useDataStore } from '../store/dataStore';

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
      className={cn(
        'p-1.5 rounded-md text-sm transition-colors',
        active ? 'bg-brand-100 text-brand-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
  const addContract    = useDataStore((s) => s.addContract);
  const updateContract = useDataStore((s) => s.updateContract);
  const [contractId, setContractId] = useState(null); // set after first save
  const [title, setTitle] = useState('Untitled Contract');
  const [editingTitle, setEditingTitle] = useState(false);
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
    await new Promise((r) => setTimeout(r, 400));
    const payload = {
      title,
      status:  'draft',
      content: editor?.getHTML() || '',
      client:  varValues.client_name || '',
      amount:  varValues.amount ? String(varValues.amount).replace(/[^0-9.]/g, '') : '',
      variables: varValues,
    };
    if (contractId) {
      updateContract(userId, contractId, payload);
    } else {
      // addContract returns void; we need the new id — read it from store after add
      const before = Date.now();
      addContract(userId, payload);
      // The store prefixes ids with `c_${Date.now()}` — store the approximate id
      setContractId(`c_${before}`);
    }
    setIsSaving(false);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus(''), 3000);
    toast.success('Draft saved');
  };

  const handleSend = async () => {
    if (!sendData.email) { toast.error('Enter client email'); return; }
    const payload = {
      title,
      status:  'sent',
      content: editor?.getHTML() || '',
      client:  sendData.email,
      amount:  varValues.amount ? String(varValues.amount).replace(/[^0-9.]/g, '') : '',
      variables: varValues,
      sentAt: new Date().toISOString(),
    };
    if (contractId) {
      updateContract(userId, contractId, payload);
    } else {
      addContract(userId, payload);
    }
    toast.success(`Contract sent to ${sendData.email}!`);
    setShowSendModal(false);
    navigate('/contracts');
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
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="h-full flex flex-col bg-gray-50">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 shrink-0">
        <button onClick={() => navigate('/contracts')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mr-1">
          <ArrowLeft size={16} /> Contracts
        </button>
        <div className="w-px h-5 bg-gray-200" />

        {/* Editable title */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            className="text-sm font-medium text-gray-900 bg-transparent border-b border-brand-400 outline-none min-w-[200px] max-w-xs"
          />
        ) : (
          <button onClick={() => setEditingTitle(true)} className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors truncate max-w-xs">
            {title}
          </button>
        )}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
          <Eye size={15} /> {showPreview ? 'Editor' : 'Preview'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<Save size={14} />}
          loading={isSaving}
          onClick={handleSaveDraft}
        >
          {savedStatus === 'saved' ? 'Saved ✓' : 'Save Draft'}
        </Button>
        <Button variant="primary" size="sm" icon={<Send size={14} />} onClick={() => setShowSendModal(true)}>
          Send to Client
        </Button>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Outline panel */}
        {showOutline && !showPreview && (
          <div className="w-52 bg-white border-r border-gray-200 p-4 overflow-y-auto shrink-0 hidden lg:block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outline</span>
              <button onClick={() => setShowOutline(false)} className="text-gray-400 hover:text-gray-600 text-xs">×</button>
            </div>
            {['Scope of Work', 'Payment Terms', 'Timeline', 'Confidentiality', 'Termination'].map((c) => (
              <button key={c} className="block w-full text-left text-xs text-gray-600 hover:text-brand-600 py-1.5 px-2 rounded-md hover:bg-brand-50 transition-colors truncate">
                {c}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Clause Library</div>
              {CLAUSE_TEMPLATES.map((cl) => (
                <button
                  key={cl.title}
                  onClick={() => editor?.chain().focus().insertContent(`<p>${cl.content}</p>`).run()}
                  className="block w-full text-left text-xs text-gray-600 hover:text-brand-600 py-1.5 px-2 rounded-md hover:bg-brand-50 transition-colors mb-0.5 truncate"
                >
                  + {cl.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Center: Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            {showPreview ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-6 flex items-center gap-2">
                  <Eye size={13} /> This is how your client will see the contract
                </div>
                <div
                  className="ProseMirror"
                  dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[600px]">
                {/* Floating formatting toolbar */}
                {editor && (
                  <div className="flex items-center gap-0.5 mb-4 pb-3 border-b border-gray-100 flex-wrap">
                    <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                      <Bold size={14} />
                    </ToolbarButton>
                    <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                      <Italic size={14} />
                    </ToolbarButton>
                    <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                      <UnderlineIcon size={14} />
                    </ToolbarButton>
                    <div className="w-px h-4 bg-gray-200 mx-0.5" />
                    <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
                      <Heading1 size={14} />
                    </ToolbarButton>
                    <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
                      <Heading2 size={14} />
                    </ToolbarButton>
                    <div className="w-px h-4 bg-gray-200 mx-0.5" />
                    <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
                      <List size={14} />
                    </ToolbarButton>
                    <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
                      <ListOrdered size={14} />
                    </ToolbarButton>
                    <div className="w-px h-4 bg-gray-200 mx-0.5" />
                    <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">
                      <span className="text-xs font-bold bg-yellow-200 px-0.5 rounded">H</span>
                    </ToolbarButton>
                    <ToolbarButton active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
                      <Minus size={14} />
                    </ToolbarButton>
                  </div>
                )}
                <EditorContent editor={editor} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Variables panel */}
        {showVarsPanel && !showPreview && (
          <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 hidden xl:block">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Variables</span>
              <button onClick={() => setShowVarsPanel(false)} className="text-gray-400 hover:text-gray-600 text-xs">×</button>
            </div>
            <div className="space-y-3">
              {VARIABLES.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={varValues[key] || ''}
                      onChange={(e) => setVarValues((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400"
                    />
                    <button
                      onClick={() => insertVariable(key)}
                      title="Insert into document"
                      className="px-2 py-1.5 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors border border-brand-200 text-xs"
                    >
                      +
                    </button>
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
