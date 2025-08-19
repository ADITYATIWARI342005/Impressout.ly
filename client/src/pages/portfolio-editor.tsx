import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type Profile = {
	name: string;
	title: string;
	summary: string; // short tagline
	aboutDetailed: string; // long about, multi-paragraph supported via newlines
	skills: string; // CSV or newline
	experience: string; // newline items
	projects: string; // Each line: Title | Description | Tech1,Tech2 | LiveURL | GitHubURL (optional)
	contactEmail: string;
	location: string;
	websiteUrl: string;
	linkedinUrl: string;
	githubUrl: string;
	twitterUrl: string;
	avatarUrl: string;
	heroPrimaryCtaText: string;
	heroPrimaryCtaUrl: string;
	heroSecondaryCtaText: string;
	heroSecondaryCtaUrl: string;
};

const defaultProfile: Profile = {
	name: "John Doe",
	title: "Software Engineer",
	summary: "Passionate about building delightful developer experiences.",
	aboutDetailed: "I am a full-stack engineer focused on building scalable systems and delightful UIs.\nI enjoy working with TypeScript, React, Node.js and cloud-native tooling.",
	skills: "TypeScript, React, Node.js, GraphQL, AWS",
	experience: "Company A — Senior Engineer (2021–Present)\nCompany B — Engineer (2018–2021)",
	projects: "E-Commerce Platform | Full-stack shop with realtime inventory and analytics | React,Node.js,MongoDB,Stripe | https://live.example.com | https://github.com/me/ecommerce\nRealtime Chat | Scalable chat with E2E encryption | Next.js,Socket.io,Redis,AWS | https://chat.example.com | https://github.com/me/chat\nAI Analytics | ML platform for predictive analytics | Python,TensorFlow,D3.js,FastAPI | https://ai.example.com | https://github.com/me/ai",
	contactEmail: "john@example.com",
	location: "Remote",
	websiteUrl: "https://johndoe.dev",
	linkedinUrl: "https://linkedin.com/in/johndoe",
	githubUrl: "https://github.com/johndoe",
	twitterUrl: "https://x.com/johndoe",
	avatarUrl: "",
	heroPrimaryCtaText: "View My Work",
	heroPrimaryCtaUrl: "#projects",
	heroSecondaryCtaText: "Get In Touch",
	heroSecondaryCtaUrl: "#contact",
};

function generateTemplateHTML(templateId: string, data: Profile, options?: { enableParticles?: boolean }): string {
	const enableParticles = options?.enableParticles ?? true;
	const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
	const skills = data.skills.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
	const aboutParas = data.aboutDetailed.split(/\n/).map((s) => s.trim()).filter(Boolean);
	const experience = data.experience.split(/\n/).map((s) => s.trim()).filter(Boolean);
	const projectsRaw = data.projects.split(/\n/).map((s) => s.trim()).filter(Boolean);
	const projects = projectsRaw.map((line) => {
		const parts = line.split("|").map((p) => p.trim());
		return { title: parts[0] || "Project", desc: parts[1] || "", techs: (parts[2] || "").split(",").map((t) => t.trim()).filter(Boolean), live: parts[3] || "#", code: parts[4] || "#" };
	});
	const theme = (() => {
		switch (templateId) {
			case "dark-pro": return { bg1: "#0b1220", bg2: "#000000", accent1: "#60a5fa", accent2: "#a78bfa", accent3: "#f472b6", card: "#0b0f19", border: "#111827", text: "#e5e7eb" };
			case "glassmorphism": return { bg1: "#0f172a", bg2: "#020617", accent1: "#60a5fa", accent2: "#a78bfa", accent3: "#22d3ee", card: "rgba(255,255,255,.06)", border: "rgba(255,255,255,.08)", text: "#e2e8f0" };
			case "bold-gradient": return { bg1: "#1f2937", bg2: "#0f172a", accent1: "#d946ef", accent2: "#fb7185", accent3: "#f59e0b", card: "#111827", border: "#1f2937", text: "#e5e7eb" };
			case "neo-brutal": return { bg1: "#fef08a", bg2: "#fde68a", accent1: "#111827", accent2: "#111827", accent3: "#111827", card: "#ffffff", border: "#000000", text: "#111827" };
			case "terminal": return { bg1: "#000000", bg2: "#000000", accent1: "#22c55e", accent2: "#16a34a", accent3: "#10b981", card: "#052e2b", border: "#064e3b", text: "#22c55e" };
			case "parallax-hero": return { bg1: "#0f172a", bg2: "#1e293b", accent1: "#60a5fa", accent2: "#a78bfa", accent3: "#f472b6", card: "#1e293b", border: "#475569", text: "#e2e8f0" };
			default: return { bg1: "#ffffff", bg2: "#f8fafc", accent1: "#3b82f6", accent2: "#8b5cf6", accent3: "#22d3ee", card: "#ffffff", border: "#e5e7eb", text: "#0f172a" };
		}
	})();
	const head = `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>${esc(data.name)} - ${esc(data.title)}</title><link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap\" rel=\"stylesheet\" /><style>*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:Inter,ui-sans-serif,system-ui;line-height:1.6;color:${theme.text};background:linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 100%);overflow-x:hidden}.container{max-width:1200px;margin:0 auto;padding:0 2rem}nav{position:fixed;top:0;width:100%;background:rgba(15,23,42,0.95);backdrop-filter:blur(10px);z-index:1000;padding:1rem 0;transition:all .3s ease}nav.scrolled{background:rgba(15,23,42,.98);box-shadow:0 4px 20px rgba(0,0,0,.3)}.nav-inner{display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.25rem;font-weight:800;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent}.nav-links{list-style:none;display:flex;gap:2rem}.nav-links a{color:#cbd5e1;text-decoration:none;position:relative;transition:all .3s}.nav-links a:hover{color:${theme.accent1}}.nav-links a:after{content:'';position:absolute;bottom:-6px;left:0;width:0;height:2px;background:${theme.accent1};transition:width .3s}.nav-links a:hover:after{width:100%}section{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:6rem 0 4rem;opacity:0;transform:translateY(40px);animation:fadeInUp 1s ease forwards}@keyframes fadeInUp{to{opacity:1;transform:none}}.hero{position:relative;text-align:center;animation-delay:.15s;overflow:hidden}.hero h1{position:relative;z-index:2;font-size:clamp(2.5rem,6vw,4.25rem);font-weight:900;margin-bottom:.75rem;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2}, ${theme.accent3});-webkit-background-clip:text;-webkit-text-fill-color:transparent}.hero .hero-particles{position:absolute;inset:0;z-index:1;pointer-events:none}.hero .hero-particles canvas{width:100%;height:100%;display:block}.hero p{font-size:1.25rem;color:#94a3b8;margin-bottom:1.25rem;position:relative;z-index:2}.avatar{position:relative;z-index:2;width:104px;height:104px;border-radius:999px;margin:0 auto 1rem;border:2px solid ${theme.accent1};box-shadow:0 10px 30px rgba(0,0,0,.25);object-fit:cover}.cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1rem;position:relative;z-index:2}.btn{padding:1rem 1.5rem;border-radius:999px;text-decoration:none;font-weight:700;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}.btn-primary{color:white;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2});box-shadow:0 10px 30px rgba(59,130,246,.3)}.btn-secondary{color:${theme.accent1};border:2px solid ${theme.accent1}}.btn:before{content:'';position:absolute;inset:0;left:-100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transition:left .5s}.btn:hover:before{left:100%}.btn:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(59,130,246,.4)}.about{background:rgba(30,41,59,.45);animation-delay:.25s}.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}.about h2,.projects h2,.contact h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:1.5rem;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent}.about p{color:#cbd5e1;margin-bottom:1rem;line-height:1.8}.skills{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1rem;margin-top:1.25rem}.skill{background:linear-gradient(135deg, ${theme.card}, ${theme.card});padding:1rem;border-radius:14px;text-align:center;border:1px solid ${theme.border};transition:all .3s;transform:translateZ(0)}.skill:hover{transform:translateY(-6px) scale(1.03);box-shadow:0 12px 30px rgba(0,0,0,.25)}.projects{animation-delay:.35s}.project-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem}.card{border-radius:18px;border:1px solid ${theme.border};background:linear-gradient(135deg, ${theme.card}, ${theme.card});overflow:hidden}.project{position:relative;padding:1.5rem}.project:before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2}, ${theme.accent3})}.project h3{font-size:1.4rem;color:#f1f5f9;margin-bottom:.5rem}.project p{color:#94a3b8;margin-bottom:1rem}.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin:.75rem 0 1rem}.tag{background:${theme.accent1};color:white;padding:.25rem .6rem;border-radius:999px;font-size:.8rem}.links{display:flex;gap:1rem}.links a{color:${theme.accent1};text-decoration:none}.links a:hover{color:${theme.accent2}}.contact{background:rgba(30,41,59,.45);animation-delay:.45s}.contact p{color:#94a3b8;margin-bottom:1.25rem}.contact-form{max-width:620px;margin:0 auto;display:grid;gap:1rem}.form-group{display:grid;gap:.4rem}.form-group input,.form-group textarea{background:rgba(30,41,59,.8);border:1px solid ${theme.border};border-radius:12px;padding:1rem;color:${theme.text};transition:all .3s}.form-group input:focus,.form-group textarea:focus{outline:none;border-color:${theme.accent1};box-shadow:0 0 0 3px rgba(96,165,250,.15)}.social{display:flex;justify-content:center;gap:1.25rem;margin-top:2rem}.social a{width:56px;height:56px;border-radius:999px;background:linear-gradient(135deg, ${theme.accent1}, ${theme.accent2});display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;transition:all .3s}.social a:hover{transform:translateY(-5px) scale(1.06);box-shadow:0 10px 25px rgba(59,130,246,.35)}.bg-particles{position:fixed;inset:0;z-index:-1;opacity:.12}.particle{position:absolute;width:2px;height:2px;background:${theme.accent1};border-radius:50%;animation:float 6s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(180deg)}}@media (max-width:768px){.about-grid{grid-template-columns:1fr}.nav-links{display:none}section{padding:5rem 0 3rem}}</style>`;
	const heroAvatar = data.avatarUrl ? `<img class=\"avatar\" src=\"${esc(data.avatarUrl)}\" alt=\"${esc(data.name)} avatar\"/>` : '';
	const primaryText = data.heroPrimaryCtaText || 'View My Work';
	const primaryUrl = data.heroPrimaryCtaUrl || '#projects';
	const secondaryText = data.heroSecondaryCtaText || 'Get In Touch';
	const secondaryUrl = data.heroSecondaryCtaUrl || '#contact';
	const bodyStart = `<body><div class=\"bg-particles\" id=\"particles\"></div><nav id=\"navbar\"><div class=\"container nav-inner\"><div class=\"logo\">${esc((data.name || 'AC').slice(0,2).toUpperCase())}</div><ul class=\"nav-links\"><li><a href=\"#home\">Home</a></li><li><a href=\"#about\">About</a></li><li><a href=\"#projects\">Projects</a></li><li><a href=\"#contact\">Contact</a></li></ul></div></nav><section id=\"home\" class=\"hero\">${enableParticles ? '<div class=\"hero-particles\"><canvas id=\"heroParticles\"></canvas></div>' : ''}<div class=\"container\">${heroAvatar}<h1>${esc(data.name)}</h1><p>${esc(data.title)}</p><p style=\"font-size:1.05rem;color:#64748b;margin-bottom:2rem;\">${esc(data.summary)}</p><div class=\"cta\"><a class=\"btn btn-primary\" href=\"${esc(primaryUrl)}\">${esc(primaryText)}</a><a class=\"btn btn-secondary\" href=\"${esc(secondaryUrl)}\">${esc(secondaryText)}</a></div></div></section><section id=\"about\" class=\"about\"><div class=\"container\"><div class=\"about-grid\"><div><h2>About Me</h2>${aboutParas.map(p=>`<p>${esc(p)}</p>`).join('')}<p>I am ${esc(data.title)} based in ${esc(data.location)}.</p></div><div class=\"skills\">${skills.map((s)=>`<div class=\\\"skill\\\">${esc(s)}</div>`).join('')}</div></div></div></section><section id=\"projects\" class=\"projects\"><div class=\"container\"><h2>Featured Projects</h2><div class=\"project-grid\">${projects.map((p)=>`<div class=\\\"card project\\\"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><div class=\\\"tags\\\">${p.techs.map((t)=>`<span class=\\\"tag\\\">${esc(t)}</span>`).join('')}</div><div class=\\\"links\\\"><a href=\\\"${esc(p.live)}\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Live Demo</a><a href=\\\"${esc(p.code)}\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">GitHub</a></div></div>`).join('')}</div></div></section><section id=\"contact\" class=\"contact\"><div class=\"container\"><div style=\"text-align:center;max-width:760px;margin:0 auto;\"><h2>Let's Work Together</h2><p>Ready to bring your ideas to life? Let's connect and build something amazing.</p><form class=\"contact-form\" onsubmit=\"event.preventDefault(); var b=this.querySelector('button'); var t=b.textContent; b.textContent='Sending...'; b.style.background='linear-gradient(135deg,#10b981,#059669)'; setTimeout(()=>{b.textContent='Message Sent!'; setTimeout(()=>{b.textContent=t;b.style.background='linear-gradient(135deg, ${theme.accent1}, ${theme.accent2})'; this.reset && this.reset();},1600);},1200);\"><div class=\"form-group\"><label>Name</label><input required/></div><div class=\"form-group\"><label>Email</label><input type=\"email\" required/></div><div class=\"form-group\"><label>Message</label><textarea rows=\"5\" required></textarea></div><button class=\"btn btn-primary\" type=\"submit\">Send Message</button></form><div class=\"social\">${data.contactEmail ? `<a href=\"mailto:${esc(data.contactEmail)}\" aria-label=\"Email\">✉️</a>` : ''}${data.linkedinUrl ? `<a href=\"${esc(data.linkedinUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"LinkedIn\">💼</a>` : ''}${data.githubUrl ? `<a href=\"${esc(data.githubUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"GitHub\">🐙</a>` : ''}${data.twitterUrl ? `<a href=\"${esc(data.twitterUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"X\">🐦</a>` : ''}${data.websiteUrl ? `<a href=\"${esc(data.websiteUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Website\">🌐</a>` : ''}</div></div></div></section>`;
	const scripts = `<script>(function(){function createParticles(){var c=document.getElementById('particles');if(!c)return;for(var i=0;i<50;i++){var p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';p.style.animationDelay=(Math.random()*6)+'s';p.style.animationDuration=((Math.random()*3)+3)+'s';c.appendChild(p)}}function initHeroParticles(){${enableParticles ? "var canvas=document.getElementById('heroParticles');if(!canvas)return;var ctx=canvas.getContext('2d');var dpr=window.devicePixelRatio||1;function resize(){canvas.width=canvas.clientWidth*dpr;canvas.height=canvas.clientHeight*dpr}resize();var particles=[];var max=Math.min(120, Math.max(40, Math.floor((canvas.width*canvas.height)/(18000))));for(var i=0;i<max;i++){particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*0.3*dpr,vy:(Math.random()-0.5)*0.3*dpr,r:Math.random()*1.5+0.5});}var color1='${theme.accent1}';var color2='${theme.accent2}';function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(var i=0;i<particles.length;i++){var p=particles[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>canvas.width)p.vx*=-1;if(p.y<0||p.y>canvas.height)p.vy*=-1;var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,60);g.addColorStop(0,color1);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*2,0,Math.PI*2);ctx.fill();for(var j=i+1;j<particles.length;j++){var q=particles[j];var dx=p.x-q.x,dy=p.y-q.y;var dist=Math.sqrt(dx*dx+dy*dy);if(dist<120*dpr){ctx.strokeStyle='${theme.accent2}22';ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}}requestAnimationFrame(draw)}" : ""}window.addEventListener('resize',function(){var c=document.getElementById('heroParticles');if(!c)return;var dpr=window.devicePixelRatio||1;c.width=c.clientWidth*dpr;c.height=c.clientHeight*dpr});function onScroll(){var nav=document.getElementById('navbar');if(!nav)return; if(window.scrollY>100){nav.classList.add('scrolled')}else{nav.classList.remove('scrolled')}}var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible')}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});document.addEventListener('DOMContentLoaded',function(){createParticles();initHeroParticles();document.querySelectorAll('section').forEach(function(el){obs.observe(el)});document.querySelectorAll('a[href^=\"#\"]').forEach(function(a){a.addEventListener('click',function(e){var href=a.getAttribute('href');if(href&&href.startsWith('#')){e.preventDefault();var t=document.querySelector(href);t&&t.scrollIntoView({behavior:'smooth',block:'start'})}})})});window.addEventListener('scroll',onScroll);})();</script>`;
	return `${head}<body><div class=\"bg-particles\" id=\"particles\"></div><nav id=\"navbar\"><div class=\"container nav-inner\"><div class=\"logo\">${esc((data.name || 'AC').slice(0,2).toUpperCase())}</div><ul class=\"nav-links\"><li><a href=\"#home\">Home</a></li><li><a href=\"#about\">About</a></li><li><a href=\"#projects\">Projects</a></li><li><a href=\"#contact\">Contact</a></li></ul></div></nav>${bodyStart.replace('<body>', '')}${scripts}</body></html>`;
}

function IFramePreview({ html }: { html: string }) {
	return (
		<iframe title="portfolio-preview" srcDoc={html} sandbox="allow-same-origin allow-scripts" className="w-full h-[1400px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white" />
	);
}

export default function PortfolioEditor() {
	const [, params] = useRoute("/portfolio-editor/:templateId");
	const [, setLocation] = useLocation();
	const templateId = params?.templateId || "clean-tech";
	const [profile, setProfile] = useState<Profile>(defaultProfile);
	const [enableParticles, setEnableParticles] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		// Reserved for future enhancements (e.g., per-template runtime)
	}, []);

	const handleChange = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setProfile((prev) => ({ ...prev, [key]: e.target.value }));
	};

	const handleSave = () => {
		toast({ title: "Saved", description: "Template data saved (local session)" });
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<Navbar />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Website Editor</h1>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setLocation('/portfolio-templates')}>Back to Library</Button>
						<Button onClick={handleSave}>Save</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
					<div className="lg:col-span-4">
						<Card>
							<CardHeader>
								<CardTitle>Portfolio Information</CardTitle>
							</CardHeader>
							<CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<Label htmlFor="name">Name</Label>
									<Input id="name" placeholder="Your name" value={profile.name} onChange={handleChange('name')} />
								</div>
								<div>
									<Label htmlFor="title">Title</Label>
									<Input id="title" placeholder="Your title" value={profile.title} onChange={handleChange('title')} />
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="summary">Summary</Label>
									<Textarea id="summary" rows={3} placeholder="Short tagline" value={profile.summary} onChange={handleChange('summary')} />
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="aboutDetailed">About (detailed)</Label>
									<Textarea id="aboutDetailed" rows={5} placeholder="Multiple paragraphs supported via new lines" value={profile.aboutDetailed} onChange={handleChange('aboutDetailed')} />
								</div>
								<div>
									<Label htmlFor="skills">Skills</Label>
									<Textarea id="skills" rows={4} placeholder="comma separated or multiline" value={profile.skills} onChange={handleChange('skills')} />
								</div>
								<div>
									<Label htmlFor="experience">Experience</Label>
									<Textarea id="experience" rows={4} placeholder="One role per line" value={profile.experience} onChange={handleChange('experience')} />
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="projects">Projects</Label>
									<Textarea id="projects" rows={6} placeholder="Title | Description | Tech1,Tech2 | LiveURL | GitHubURL\nTitle | ..." value={profile.projects} onChange={handleChange('projects')} />
									<p className="text-xs text-gray-500 mt-1">Format: Title | Description | Tech1,Tech2 | LiveURL | GitHubURL (one per line)</p>
								</div>
								<div>
									<Label htmlFor="avatarUrl">Avatar URL</Label>
									<Input id="avatarUrl" placeholder="https://..." value={profile.avatarUrl} onChange={handleChange('avatarUrl')} />
								</div>
								<div>
									<Label htmlFor="websiteUrl">Website</Label>
									<Input id="websiteUrl" placeholder="https://yourdomain.com" value={profile.websiteUrl} onChange={handleChange('websiteUrl')} />
								</div>
								<div>
									<Label htmlFor="linkedinUrl">LinkedIn</Label>
									<Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." value={profile.linkedinUrl} onChange={handleChange('linkedinUrl')} />
								</div>
								<div>
									<Label htmlFor="githubUrl">GitHub</Label>
									<Input id="githubUrl" placeholder="https://github.com/..." value={profile.githubUrl} onChange={handleChange('githubUrl')} />
								</div>
								<div>
									<Label htmlFor="twitterUrl">X / Twitter</Label>
									<Input id="twitterUrl" placeholder="https://x.com/..." value={profile.twitterUrl} onChange={handleChange('twitterUrl')} />
								</div>
								<div>
									<Label htmlFor="heroPrimaryCtaText">Primary CTA Text</Label>
									<Input id="heroPrimaryCtaText" placeholder="View My Work" value={profile.heroPrimaryCtaText} onChange={handleChange('heroPrimaryCtaText')} />
								</div>
								<div>
									<Label htmlFor="heroPrimaryCtaUrl">Primary CTA URL</Label>
									<Input id="heroPrimaryCtaUrl" placeholder="#projects or https://..." value={profile.heroPrimaryCtaUrl} onChange={handleChange('heroPrimaryCtaUrl')} />
								</div>
								<div>
									<Label htmlFor="heroSecondaryCtaText">Secondary CTA Text</Label>
									<Input id="heroSecondaryCtaText" placeholder="Get In Touch" value={profile.heroSecondaryCtaText} onChange={handleChange('heroSecondaryCtaText')} />
								</div>
								<div>
									<Label htmlFor="heroSecondaryCtaUrl">Secondary CTA URL</Label>
									<Input id="heroSecondaryCtaUrl" placeholder="#contact or https://..." value={profile.heroSecondaryCtaUrl} onChange={handleChange('heroSecondaryCtaUrl')} />
								</div>
								<div>
									<Label htmlFor="email">Contact Email</Label>
									<Input id="email" type="email" value={profile.contactEmail} onChange={handleChange('contactEmail')} />
								</div>
								<div>
									<Label htmlFor="location">Location</Label>
									<Input id="location" value={profile.location} onChange={handleChange('location')} />
								</div>
								<div className="md:col-span-2 flex items-center gap-3 pt-2">
									<Switch id="particles" checked={enableParticles} onCheckedChange={setEnableParticles as any} />
									<Label htmlFor="particles">Enable hero particles</Label>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-3 lg:sticky lg:top-6 h-max">
						<Card>
							<CardHeader>
								<CardTitle>Live Preview</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<IFramePreview html={generateTemplateHTML(templateId, profile, { enableParticles })} />
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}


