"use client";
import { useState, useEffect, useRef, FormEvent, ChangeEvent, MutableRefObject } from "react";





// Types for provider and docs
type Doc = { label: string; status: "verified" | "needed" };
type Provider = {
  name: string;
  status: string;
  statusColor: string;
  progress: number;
  stats: { done: number; active: number; todo: number };
  docs: Doc[];
  activeDoc: string;
};

const initialProvider: Provider = {
  name: "Dr. Jane Smith",
  status: "Next: Upload 1 remaining document",
  statusColor: "text-blue-600",
  progress: 86,
  stats: { done: 6, active: 0, todo: 1 },
  docs: [
    { label: "State Dental License", status: "verified" },
    { label: "DEA Certificate", status: "verified" },
    { label: "Malpractice Insurance", status: "verified" },
    { label: "Curriculum Vitae", status: "verified" },
    { label: "Board Certification", status: "needed" },
    { label: "NPI Confirmation Letter", status: "verified" },
    { label: "W-9 Form", status: "verified" },
  ],
  activeDoc: "Board Certification"
};




function InteractiveDemo() {
  // view: 'dashboard' | 'profile' | 'ai' | 'success'
  const [view, setView] = useState<'dashboard' | 'profile' | 'ai' | 'success'>('dashboard');
  const [provider, setProvider] = useState<Provider>(() => JSON.parse(JSON.stringify(initialProvider)));
  const [aiStatus, setAIStatus] = useState<string>('AI Analyzing Document...');

  // In-place AI simulation state for upload card
  // Only declare these once at the top
  // Only one set of state declarations at the top
  // Only one set of state declarations at the top
  const [uploadState, setUploadState] = useState<'idle' | 'ai' | 'success'>('idle');
  const [aiStep, setAIStep] = useState(0);
  const aiSteps = [
    'AI Analyzing Document...',
    'Cross-Referencing Sources...',
    'Populating Provider Profile...',
    'Success!'
  ];

  // Simulate AI steps for full view
  useEffect(() => {
    if (view === 'ai') {
      const statuses = ["Cross-Referencing Sources...", "Populating Provider Profile...", "Success!"];
      let idx = 0;
      setAIStatus('AI Analyzing Document...');
      const interval = setInterval(() => {
        if (idx < statuses.length) {
          setAIStatus(statuses[idx]);
          idx++;
        } else {
          clearInterval(interval);
          // Mark doc as verified
          setProvider((prev: Provider) => {
            const updated: Provider = { ...prev };
            const doc = updated.docs.find((d: Doc) => d.label === updated.activeDoc);
            if (doc) doc.status = 'verified';
            updated.status = "Credentialing complete! Provider is billable.";
            updated.statusColor = "text-green-600";
            updated.progress = 100;
            updated.stats = { done: 7, active: 0, todo: 0 };
            updated.activeDoc = "";
            return updated;
          });
          setTimeout(() => setView('success'), 900);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [view]);

  // Simulate AI steps for upload card
  useEffect(() => {
    if (uploadState === 'ai') {
      if (aiStep < aiSteps.length - 1) {
        const t = setTimeout(() => setAIStep(aiStep + 1), 1200);
        return () => clearTimeout(t);
      } else {
        setTimeout(() => setUploadState('success'), 900);
      }
    }
  }, [uploadState, aiStep]);

  // Dashboard view
  if (view === 'dashboard') {
    return (
      <div className="mt-12 w-full max-w-[1200px] mx-auto rounded-xl shadow-2xl border border-gray-200 bg-white p-2 reveal visible" style={{maxWidth: '1200px', borderRadius: '20px', padding: '8px'}}>
        <div className="bg-gray-100 rounded-t-lg h-8 flex items-center px-4" style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '32px', paddingLeft: '16px', paddingRight: '16px'}}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <div className="bg-gray-50 font-sans rounded-b-lg" style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
          <div className="px-12 py-3" style={{padding: '12px 48px'}}>
            <div className="mb-3" style={{marginBottom: '12px'}}>
              <h1 className="font-bold text-xl text-gray-800" style={{fontSize: '1.5rem', marginBottom: '4px'}}>Credentialing Dashboard</h1>
              <p className="text-sm text-gray-500" style={{fontSize: '0.875rem'}}>Monitor all provider credentialing progress at a glance.</p>
            </div>
            <div className="space-y-2" style={{gap: '8px'}}>
              <div className="bg-white hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-lg shadow-sm cursor-pointer transition-all" data-provider="jane_smith" onClick={() => setView('profile')} style={{padding: '12px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(60,80,120,0.08)'}}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3" style={{gap: '12px'}}>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base text-gray-800 truncate" style={{fontSize: '1rem'}}>Dr. Jane Smith</h2>
                    <p className="text-xs font-medium text-blue-600 mt-1" style={{fontSize: '0.75rem', marginTop: '2px'}}>Next: Upload 1 remaining document</p>
                  </div>
                  <div className="w-full lg:w-64" style={{maxWidth: '256px'}}>
                    <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-200" style={{height: '8px', borderRadius: '4px'}}>
                      <div className="bg-green-500" style={{ width: '86%', borderRadius: '4px' }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500" style={{fontSize: '0.65rem', marginTop: '4px'}}>
                      <span>6 Done</span>
                      <span>0 Active</span>
                      <span>1 Todo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Provider profile view
  if (view === 'profile') {

    return (
      <div className="flex items-center justify-center min-h-[400px] font-sans">
        <div className="w-full max-w-[900px]">
          <div className="bg-white rounded-[16px] shadow-[0_8px_32px_0_rgba(60,80,120,0.12)] border border-gray-200">
            <div className="bg-gray-100 rounded-t-xl h-8 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="p-8">
              <button className="text-sm font-medium text-blue-600 hover:underline flex items-center mb-4" onClick={() => setView('dashboard')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Dashboard
              </button>
              <h1 className="font-bold text-2xl text-gray-800 mb-6">{provider.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="md:col-span-1">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 h-fit shadow-sm" style={{minHeight: '320px'}}>
                    <h2 className="font-bold text-lg mb-4 text-gray-800" style={{fontFamily: 'Sora, sans-serif', fontWeight: 600}}>Document Checklist</h2>
                    <div className="space-y-1 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {provider.docs.map((doc: Doc) => (
                        <div key={doc.label} className={`flex items-center p-3 rounded-md transition-colors ${doc.label === provider.activeDoc ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 mr-3 ${doc.status === 'verified' ? 'text-green-500' : 'text-gray-400'}`}>
                            {doc.status === 'verified' ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> : <circle cx="12" cy="12" r="10"/>}
                          </svg>
                          <p className="text-sm font-medium text-gray-700" style={{fontFamily: 'Inter, sans-serif', fontWeight: 500}}>{doc.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 flex flex-col justify-center">
                  <h2 className="font-bold text-xl text-gray-800 mb-4" style={{fontFamily: 'Sora, sans-serif', fontWeight: 600}}>{provider.activeDoc}</h2>
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-400 border-gray-300 flex flex-col items-center justify-center min-h-[220px]"
                    onClick={() => uploadState === 'idle' && setUploadState('ai')}
                  >
                    {uploadState === 'idle' && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-gray-400"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><path d="M18 21v-7a4 4 0 0 0-4-4H6"/></svg>
                        <p className="text-gray-500" style={{fontFamily: 'Inter, sans-serif', fontWeight: 500}}>Drag & Drop PDF or JPG here, or click to upload.</p>
                        <p className="text-xs text-gray-400 mt-1" style={{fontFamily: 'Inter, sans-serif', fontWeight: 400}}>This is a demo. Clicking will simulate AI verification.</p>
                      </>
                    )}
                    {uploadState === 'ai' && (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="font-semibold text-gray-700 mb-2">{aiSteps[aiStep]}</p>
                        <p className="text-xs text-gray-400">This process is automated in the real product.</p>
                      </>
                    )}
                    {uploadState === 'success' && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <p className="font-bold text-lg text-green-600 mb-2" style={{fontFamily: 'Sora, sans-serif', fontWeight: 700}}>Document Verified!</p>
                        <p className="text-xs text-gray-400">AI-powered verification complete.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI working view
  if (view === 'ai') {
    return (
      <div className="flex items-center justify-center min-h-[400px] font-sans">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200">
            <div className="bg-gray-100 rounded-t-xl h-8 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 font-semibold text-gray-700">{aiStatus}</p>
              <p className="text-sm text-gray-500">This process is automated in the real product.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ...existing code...
}
export default function Home() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", location: "" });
  const [submitMessage, setSubmitMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute("href")!);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => link.addEventListener("click", handleAnchorClick));
    return () => {
      links.forEach((link) => link.removeEventListener("click", handleAnchorClick));
    };
  }, []);

  useEffect(() => {
    // Reveal animation on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current && formRef.current.checkValidity()) {
      setSubmitMessage("Thank you! We've received your request and will be in touch shortly to schedule your demo.");
      setFormData({ firstName: "", lastName: "", email: "", location: "" });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="antialiased">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-200/80">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>Cloux</div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="font-medium text-gray-600 hover:text-blue-700 transition-colors">How It Works</a>
            <a href="#ai-advantage" className="font-medium text-gray-600 hover:text-blue-700 transition-colors">Our AI Advantage</a>
            <a href="#pricing" className="font-medium text-gray-600 hover:text-blue-700 transition-colors">Pricing</a>
          </div>
          <a href="#book-demo" className="primary-cta-btn text-sm">Book a Demo</a>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="aurora-bg pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="container mx-auto px-6 text-center relative z-10">
                <h1 id="hero-headline" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  <div className="hero-headline-word visible"><span><span className="gradient-text">Automate</span> Credentialing.</span></div>
        <div className="hero-headline-word visible" style={{ display: "block", marginTop: 0 }}>
                    <span><span className="gradient-text">Accelerate</span> Revenue.</span>
                  </div>
                </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mt-6 reveal" style={{ transitionDelay: '0.3s' }}>
              Cloux is the <span className="highlight-gradient">AI native</span> platform for small dental practices that turns credentialing into a fast, automated workflow, helping get providers billable faster.
            </p>
            <div className="mt-10 flex justify-center items-center space-x-4 reveal" style={{ transitionDelay: '0.4s' }}>
              <a href="#book-demo" className="primary-cta-btn text-lg">Book a Demo</a>
              <a href="#how-it-works" className="secondary-cta-btn text-lg">See The Workflow</a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto reveal">
              <h2 className="text-3xl md:text-4xl font-bold">Your Credentialing Command Center</h2>
              <p className="text-gray-600 mt-4 text-lg">Cloux transforms credentialing from a scattered, manual process into a centralized, <span className="highlight-gradient">intelligent system</span>.</p>
            </div>
            <div className="mt-20 max-w-3xl mx-auto">
              {/* Timeline steps ported from Figma HTML */}
              <div className="timeline-step reveal">
                <div className="timeline-icon-wrapper">
                  {/* SVG icon 1 */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Reduce Administrative Work</h3>
                <p className="mt-2 text-gray-600">Our <span className="highlight-gradient">AI ingestion system</span> securely processes provider documents via drag-and-drop. Providers can also use the Provider Self-Service Compliance Portal to upload their documents and manage their compliance status, reducing administrative workload and speeding up the process.</p>
              </div>
              <div className="timeline-step reveal">
                <div className="timeline-icon-wrapper">
                  {/* SVG icon 2 */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ensure Accuracy</h3>
                <p className="mt-2 text-gray-600"><span className="highlight-gradient">Automated verification</span> cross-checks key fields against primary sources like state license boards, NPI registries, and CAQH, and flags ambiguities for review.</p>
              </div>
              <div className="timeline-step reveal">
                <div className="timeline-icon-wrapper">
                  {/* SVG icon 3 */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Accelerate Revenue</h3>
                <p className="mt-2 text-gray-600"><span className="highlight-gradient">Intelligent automation</span> uses verified data to auto-populate payer application packets, reducing turnaround time from months to as little as a week in pilot settings.</p>
              </div>
              <div className="timeline-step reveal">
                <div className="timeline-icon-wrapper">
                  {/* SVG icon 4 */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Stay Compliant</h3>
                <p className="mt-2 text-gray-600"><span className="highlight-gradient">Continuous monitoring</span> tracks expiration dates and compliance events, automatically triggering follow-ups and providing one-click, audit-ready reports so you're always prepared.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive App Demo Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto reveal">
              <h2 className="text-3xl md:text-4xl font-bold">Experience the Workflow</h2>
              <p className="text-gray-600 mt-4 text-lg">Click on the provider in the interactive demo below to see how our AI-powered system automates your workflow.</p>
            </div>
            <div className="mt-12 flex justify-center items-center">
              <div className="w-full max-w-[600px] px-2">
                <InteractiveDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Our AI Advantage Section */}
        <section id="ai-advantage" className="py-24 aurora-bg">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto reveal">
              <h2 className="text-3xl md:text-4xl font-bold">Our AI-Native Advantage</h2>
              <p className="text-gray-600 mt-4 text-lg">Our platform is designed for automation from the ground up, resulting in a faster and more accurate workflow.</p>
            </div>
            <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-lg advantage-card reveal">
                <h4 className="font-bold text-gray-800 text-lg">Specialized Automation Modules</h4>
                <p className="text-gray-600 mt-2 text-sm">We use a set of specialized automation modules, each designed for a specific task—from document ingestion and data extraction to cross-verification and payer form population.</p>
              </div>
              <div className="p-8 rounded-lg advantage-card reveal" style={{ transitionDelay: '0.1s' }}>
                <h4 className="font-bold text-gray-800 text-lg">Built From the Ground Up</h4>
                <p className="text-gray-600 mt-2 text-sm">Our entire system was designed around automation. This deep integration allows for a seamless, efficient workflow that is difficult for legacy systems to replicate.</p>
              </div>
              <div className="p-8 rounded-lg advantage-card reveal" style={{ transitionDelay: '0.2s' }}>
                <h4 className="font-bold text-gray-800 text-lg">Data Integrity at the Core</h4>
                <p className="text-gray-600 mt-2 text-sm">Verification is built into every step, so credentialing data stays accurate and compliant throughout the process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto reveal">
              <h2 className="text-3xl font-bold">What Dental Practices Are Saying</h2>
              <p className="text-gray-600 mt-4 text-lg">Feedback from our early interviews with over 20 practice leaders.</p>
            </div>
            <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="testimonial-card reveal">
                <p className="text-gray-700 italic relative z-10">"We use a spreadsheet and it's a mess. Knowing where every provider stands on one simple dashboard would be a game-changer."</p>
                <p className="mt-4 font-semibold text-blue-800">- Michael T., Clinic Owner</p>
              </div>
              <div className="testimonial-card reveal" style={{ transitionDelay: '0.1s' }}>
                <p className="text-gray-700 italic relative z-10">"This process is a constant headache. A tool that automates follow-ups would save me at least 10 hours a month."</p>
                <p className="mt-4 font-semibold text-blue-800">- Brenda E., Office Manager</p>
              </div>
              <div className="testimonial-card reveal" style={{ transitionDelay: '0.2s' }}>
                <p className="text-gray-700 italic relative z-10">"Getting a new dentist approved by payers is the single biggest bottleneck to our revenue. This can't come soon enough."</p>
                <p className="mt-4 font-semibold text-blue-800">- Sarah P., Practice Administrator</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Plans that grow with you. No hidden fees, no enterprise contracts.</p>
            <div className="mt-8">
              <a href="#book-demo" className="primary-cta-btn text-lg">Book a Demo for Pricing Details</a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="book-demo" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-blue-800 text-white p-8 md:p-12 rounded-xl shadow-2xl text-center overflow-hidden relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-16 -right-5 w-48 h-48 bg-white/10 rounded-full"></div>
              <div className="relative z-10 reveal">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to See Cloux in Action?</h2>
                <p className="mt-4 text-lg max-w-3xl mx-auto text-blue-100">Stop losing revenue to credentialing delays. Schedule a demo to see how our AI-native platform can help get your providers billable faster.</p>
                <div className="mt-8 max-w-lg mx-auto">
                  {submitMessage ? (
                    <div className="text-lg text-white">{submitMessage}</div>
                  ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg" required />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg" required />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Work Email" className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg" required />
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Practice Name" className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg" required />
                      <button type="submit" className="w-full bg-white text-blue-800 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 text-lg !mt-6">Book My Demo</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p className="font-semibold text-gray-600 text-xl" style={{ fontFamily: 'var(--font-heading)' }}>Cloux</p>
          <p className="text-sm mt-2 max-w-2xl mx-auto font-medium text-gray-600">Our mission is to build the back-office engine for the 154,000 U.S. small-practice healthcare providers, eliminating the friction of credentialing so they can focus on patient care.</p>
          <p className="text-xs mt-4">&copy; 2025 Cloux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}