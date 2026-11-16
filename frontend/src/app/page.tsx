'use client';

import Image from 'next/image';
import BusinessesPanel from "./components/BusinessesPanel";

import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, BadgeCheck, BarChart3, Bell, Bot,
  Check, ChevronDown, CircleHelp, Clock3, Globe2, LayoutDashboard, Megaphone,
  MessageCircle, MoreHorizontal, Package, Plus, Search, Settings, ShieldCheck,
  Sparkles, Store, Wallet, X
} from 'lucide-react';

type Product = { id: number; name: string; price: number; store: 'Social Media Store' | 'Website Store'; status: 'Active' | 'Draft' };
type Campaign = { id: number; name: string; store: string; platform: string; budget: number; status: 'Draft' | 'Pending approval' | 'Approved'; destination: string };

const initialProducts: Product[] = [
  { id: 1, name: 'Sample product — edit me', price: 1290, store: 'Social Media Store', status: 'Draft' },
  { id: 2, name: 'Website product — edit me', price: 1890, store: 'Website Store', status: 'Draft' },
];
const initialCampaigns: Campaign[] = [
  { id: 1, name: 'Welcome campaign (sample)', store: 'Social Media Store', platform: 'Meta', budget: 150, status: 'Draft', destination: 'Social inbox' },
  { id: 2, name: 'Website sales test (sample)', store: 'Website Store', platform: 'Meta', budget: 183, status: 'Pending approval', destination: 'Website' },
];
const money = (n: number) => `৳${n.toLocaleString('en-BD')}`;
const nav = [
  { label: 'Overview', icon: LayoutDashboard }, { label: 'Businesses', icon: Store },
  { label: 'Products', icon: Package }, { label: 'Campaigns', icon: Megaphone },
  { label: 'AI Assistant', icon: Bot }, { label: 'Approvals', icon: BadgeCheck },
  { label: 'Analytics', icon: BarChart3 }, { label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  const [section, setSection] = useState('Overview');
  const [products, setProducts] = useState(initialProducts);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showProduct, setShowProduct] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStore, setProductStore] = useState<Product['store']>('Social Media Store');
  const [campaignStore, setCampaignStore] = useState('Social Media Store');
  const [campaignProduct, setCampaignProduct] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('150');
  const [notice, setNotice] = useState('');
  const pending = campaigns.filter(c => c.status === 'Pending approval').length;
  const spentPlan = 0;
  const remaining = 10000 - spentPlan;
  const pageTitle = section === 'Overview' ? 'Business overview' : section;
  const selectedProducts = useMemo(() => products.filter(p => p.store === campaignStore), [products, campaignStore]);

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim() || Number(productPrice) <= 0) return;
    setProducts(p => [...p, { id: Date.now(), name: productName.trim(), price: Number(productPrice), store: productStore, status: 'Active' }]);
    setProductName(''); setProductPrice(''); setShowProduct(false); setNotice('Product added to demo workspace.');
  }
  function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    const budget = Number(campaignBudget);
    if (!campaignProduct || budget < 100 || budget > 333) { setNotice('Choose a product and set a daily budget between ৳100 and ৳333.'); return; }
    const p = products.find(x => x.id.toString() === campaignProduct);
    setCampaigns(c => [{ id: Date.now(), name: `${p?.name ?? 'Product'} — sales test`, store: campaignStore, platform: 'Meta', budget, status: 'Pending approval', destination: campaignStore === 'Website Store' ? 'Website' : 'Social inbox' }, ...c]);
    setShowCampaign(false); setNotice('Campaign draft created. It is waiting for your review; nothing was published.');
  }
  function approve(id: number) {
    setCampaigns(c => c.map(x => x.id === id ? { ...x, status: 'Approved' } : x));
    setNotice('Demo approval recorded locally. This does not publish an advertisement.');
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-logo"><Image src="/phoenix-orange.png" alt="Phoenix Framework" width={728} height={99} priority/><small>AI MARKETING WORKSPACE</small></div><div className="brand-mark"><Activity size={21}/></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><div className="workspace-avatar">S</div><span><b>My businesses</b><small>2 stores · Bangladesh</small></span><ChevronDown size={16}/></button>
      <div className="nav-label">MENU</div>
      <nav>{nav.map(({label, icon: Icon}) => <button key={label} onClick={() => setSection(label)} className={`nav-item ${section === label ? 'active' : ''}`}><Icon size={18}/><span>{label}</span>{label === 'Approvals' && pending > 0 && <i>{pending}</i>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a hand?</b><p>Explore the setup guide and learn how your AI workspace works.</p><button onClick={() => setNotice('Setup guide: add products, draft campaigns, review approvals, then connect ad accounts.')}>View guide <ArrowUpRight size={13}/></button></div><div className="profile"><div className="profile-avatar">U</div><div><b>Workspace owner</b><small>Admin account</small></div><MoreHorizontal size={18}/></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{section}</b></div><div className="top-actions"><div className="demo-pill"><span/> DEMO MODE</div><button className="icon-button" aria-label="Search"><Search size={18}/></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">U</div></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="eyebrow">THURSDAY, NOVEMBER 12, 2026 · DHAKA</div><h1>{pageTitle}</h1><p className="subheading">Here’s what’s happening across your business portfolio.</p></div><div className="header-buttons"><button className="button button-light" onClick={() => setShowProduct(true)}><Plus size={16}/> Add product</button><button className="button button-primary" onClick={() => { setCampaignProduct(''); setShowCampaign(true); }}><Sparkles size={16}/> Create campaign</button></div></div>
        {notice && <div className="notice"><Check size={16}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={15}/></button></div>}

        {section === 'Overview' && <>
          <div className="stats-grid">
            <Stat icon={<Wallet/>} label="Monthly ad budget" value={money(10000)} helper="Shared portfolio limit" tone="violet" trend="৳333/day planning cap"/>
            <Stat icon={<BarChart3/>} label="Ad spend recorded" value={money(spentPlan)} helper="Demo data · no live accounts" tone="blue" trend="No live spend"/>
            <Stat icon={<Megaphone/>} label="Campaign drafts" value={campaigns.length.toString()} helper="Across both stores" tone="orange" trend={`${pending} awaiting approval`}/>
            <Stat icon={<ShieldCheck/>} label="Budget remaining" value={money(remaining)} helper="Based on recorded spend" tone="green" trend="Within portfolio limit"/>
          </div>
          <div className="two-column">
            <section className="panel budget-panel"><div className="panel-heading"><div><h2>Portfolio budget</h2><p>One shared monthly limit across both stores</p></div><button className="text-button" onClick={() => setSection('Settings')}>Budget rules <ArrowUpRight size={14}/></button></div><div className="budget-numbers"><div><small>Monthly limit</small><strong>{money(10000)}</strong></div><div><small>Available</small><strong className="green-text">{money(remaining)}</strong></div></div><div className="progress-track"><div style={{width: '0%'}}/></div><div className="progress-foot"><span>৳0 spent</span><span>৳10,000 total</span></div><div className="budget-note"><ShieldCheck size={16}/><span>AI cannot increase budgets or publish campaigns without your approval.</span></div></section>
            <section className="panel activity-panel"><div className="panel-heading"><div><h2>Workspace activity</h2><p>Recent actions and pending work</p></div><button className="dots"><MoreHorizontal size={18}/></button></div><ActivityRow icon={<Package/>} title="Product workspace ready" detail={`${products.length} sample products available`} time="Just now"/><ActivityRow icon={<Clock3/>} title="Approval queue" detail={`${pending} campaign(s) need your review`} time="Today"/><ActivityRow icon={<ShieldCheck/>} title="Safety policy active" detail="Manual approval required for launch" time="Always on"/></section>
          </div>
          <section className="panel stores-panel"><div className="panel-heading"><div><h2>Your businesses</h2><p>Manage each sales destination separately</p></div><button className="text-button" onClick={() => setSection('Businesses')}>Manage businesses <ArrowUpRight size={14}/></button></div><div className="store-grid"><StoreCard icon={<MessageCircle/>} name="Social Media Store" desc="Messenger, Instagram or WhatsApp conversations" type="Messages & leads"/><StoreCard icon={<Globe2/>} name="Website Store" desc="Product pages, checkout and online purchases" type="Website sales"/></div></section>
          <div className="lower-grid"><section className="panel"><div className="panel-heading"><div><h2>Recent campaigns</h2><p>Drafts and review status</p></div><button className="text-button" onClick={() => setSection('Campaigns')}>View all <ArrowUpRight size={14}/></button></div><CampaignTable campaigns={campaigns.slice(0,3)} onApprove={approve}/></section><section className="panel ai-panel"><div className="ai-orb"><Sparkles size={22}/></div><div className="ai-copy"><span className="eyebrow">YOUR AI COPILOT</span><h2>Ready to plan your next campaign?</h2><p>Add a product and let AI prepare audience ideas, ad copy and a budget recommendation for your review.</p><button className="button button-primary" onClick={() => setShowCampaign(true)}>Start with a product <ArrowUpRight size={15}/></button></div></section></div>
        </>}
        {section === 'Businesses' && <BusinessesPanel />}
        {section === 'Products' && <section className="panel page-panel"><div className="panel-heading"><div><h2>Products</h2><p>Your product catalogue for campaign planning.</p></div><button className="button button-primary" onClick={() => setShowProduct(true)}><Plus size={16}/> Add product</button></div><ProductTable products={products}/></section>}
        {section === 'Campaigns' && <section className="panel page-panel"><div className="panel-heading"><div><h2>Campaign manager</h2><p>Create drafts and review proposed campaigns.</p></div><button className="button button-primary" onClick={() => setShowCampaign(true)}><Plus size={16}/> New campaign</button></div><CampaignTable campaigns={campaigns} onApprove={approve}/></section>}
        {section === 'Approvals' && <section className="panel page-panel"><div className="panel-heading"><div><h2>Approval centre</h2><p>Review AI proposals before any real-world action.</p></div><span className="status status-pending">{pending} pending</span></div><CampaignTable campaigns={campaigns.filter(c => c.status !== 'Draft')} onApprove={approve}/><div className="callout"><ShieldCheck size={18}/> Approving here only records a local demo decision. Live ad publishing is not connected.</div></section>}
        {section === 'AI Assistant' && <section className="panel page-panel ai-chat"><div className="ai-orb"><Bot size={23}/></div><h2>AI campaign copilot</h2><p>Start by adding a real product name, price, product details and store destination. The current workspace uses template drafts; connect an AI provider later for live generation.</p><button className="button button-primary" onClick={() => setShowCampaign(true)}>Create a campaign brief <Sparkles size={15}/></button></section>}
        {section === 'Analytics' && <section className="panel page-panel"><div className="panel-heading"><div><h2>Performance analytics</h2><p>Live metrics will appear after advertising and order integrations.</p></div><span className="status status-muted">Demo data</span></div><div className="empty-state"><BarChart3 size={34}/><h3>No live performance data yet</h3><p>Connect ad accounts and order tracking later. We will report spend, orders, revenue, refunds and estimated contribution margin.</p></div></section>}
        {section === 'Settings' && <section className="panel page-panel"><div className="panel-heading"><div><h2>Workspace settings</h2><p>Portfolio-wide safety and budget controls.</p></div></div><div className="setting-row"><div><b>Monthly portfolio budget</b><small>Shared across Social Media Store and Website Store</small></div><strong>৳10,000</strong></div><div className="setting-row"><div><b>Daily planning ceiling</b><small>Hard cap for the current MVP</small></div><strong>৳333</strong></div><div className="setting-row"><div><b>Campaign launch approval</b><small>Owner approval required</small></div><span className="status status-active">Required</span></div><div className="setting-row"><div><b>Automatic budget increases</b><small>Disabled for safety</small></div><span className="status status-active">Off</span></div><div className="callout"><ShieldCheck size={18}/> Platform credentials belong in backend environment secrets, never in browser storage.</div></section>}
      </div>
    </main>

    {showProduct && <Modal title="Add a product" subtitle="Add catalogue details for your first campaign." onClose={() => setShowProduct(false)}><form onSubmit={addProduct} className="form"><label>Product name<input required value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Premium cotton shirt"/></label><label>Selling price (BDT)<input required type="number" min="1" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="1290"/></label><label>Business destination<select value={productStore} onChange={e => setProductStore(e.target.value as Product['store'])}><option>Social Media Store</option><option>Website Store</option></select></label><div className="modal-actions"><button type="button" className="button button-light" onClick={() => setShowProduct(false)}>Cancel</button><button className="button button-primary" type="submit">Save product</button></div></form></Modal>}
    {showCampaign && <Modal title="Create campaign draft" subtitle="Prepare a proposal. Nothing will be published." onClose={() => setShowCampaign(false)}><form onSubmit={createCampaign} className="form"><label>Business destination<select value={campaignStore} onChange={e => { setCampaignStore(e.target.value); setCampaignProduct(''); }}><option>Social Media Store</option><option>Website Store</option></select></label><label>Product<select required value={campaignProduct} onChange={e => setCampaignProduct(e.target.value)}><option value="">Choose a product</option>{selectedProducts.map(p => <option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}</select></label><label>Platform<select defaultValue="Meta"><option>Meta</option><option>Google (later)</option><option>TikTok (later)</option></select></label><label>Proposed daily budget (BDT)<input type="number" min="100" max="333" value={campaignBudget} onChange={e => setCampaignBudget(e.target.value)}/><small>Allowed in this MVP: ৳100–৳333/day, shared portfolio cap.</small></label><div className="callout"><ShieldCheck size={17}/> Draft will enter the approval queue. No account connection or ad spend.</div><div className="modal-actions"><button type="button" className="button button-light" onClick={() => setShowCampaign(false)}>Cancel</button><button className="button button-primary" type="submit">Create draft <Sparkles size={15}/></button></div></form></Modal>}
  </div>;
}

function Stat({icon,label,value,helper,tone,trend}:{icon:React.ReactNode;label:string;value:string;helper:string;tone:string;trend:string}) { return <div className="stat-card"><div className="stat-top"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-trend"><ArrowUpRight size={13}/>{trend}</span></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-helper">{helper}</div></div>; }
function StoreCard({icon,name,desc,type}:{icon:React.ReactNode;name:string;desc:string;type:string}) { return <div className="store-card"><div className="store-icon">{icon}</div><div className="store-info"><div className="store-title">{name}</div><p>{desc}</p><span className="store-type">{type}</span></div><span className="status status-muted">Demo</span></div>; }
function ActivityRow({icon,title,detail,time}:{icon:React.ReactNode;title:string;detail:string;time:string}) { return <div className="activity-row"><div className="activity-icon">{icon}</div><div className="activity-copy"><b>{title}</b><small>{detail}</small></div><time>{time}</time></div>; }
function CampaignTable({campaigns,onApprove}:{campaigns:Campaign[];onApprove:(id:number)=>void}) { if (!campaigns.length) return <div className="empty-state compact"><p>No campaigns in this view yet.</p></div>; return <div className="table-wrap"><table><thead><tr><th>CAMPAIGN</th><th>STORE</th><th>PLATFORM</th><th>DAILY BUDGET</th><th>STATUS</th><th/></tr></thead><tbody>{campaigns.map(c => <tr key={c.id}><td><b>{c.name}</b><small>{c.destination}</small></td><td>{c.store}</td><td><span className="platform-dot">M</span> {c.platform}</td><td>{money(c.budget)}</td><td><span className={`status ${c.status === 'Approved' ? 'status-active' : c.status === 'Pending approval' ? 'status-pending' : 'status-muted'}`}>{c.status}</span></td><td>{c.status === 'Pending approval' && <button className="approve-button" onClick={() => onApprove(c.id)}>Review <ArrowUpRight size={13}/></button>}</td></tr>)}</tbody></table></div>; }
function ProductTable({products}:{products:Product[]}) { return <div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>BUSINESS</th><th>SELLING PRICE</th><th>STATUS</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><b>{p.name}</b></td><td>{p.store}</td><td>{money(p.price)}</td><td><span className="status status-muted">{p.status}</span></td></tr>)}</tbody></table></div>; }
function Modal({title,subtitle,onClose,children}:{title:string;subtitle:string;onClose:()=>void;children:React.ReactNode}) { return <div className="modal-backdrop" onMouseDown={e => { if(e.target === e.currentTarget) onClose(); }}><div className="modal"><div className="modal-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }

