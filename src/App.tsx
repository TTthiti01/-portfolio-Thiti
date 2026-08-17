import { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './index.css';

function App() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const formRef = useRef<HTMLFormElement>(null);
    const [githubStats, setGithubStats] = useState<{
        totalThisYear: number | string;
        totalLastYear: number | string;
        contribs: Array<{ date: string; count: number; level: number }>;
        months: string[];
    }>({
        totalThisYear: '...',
        totalLastYear: '...',
        contribs: [],
        months: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    });

    const [isDark, setIsDark] = useState<boolean>(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        const username = 'TTthiti01';
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
                    const today = new Date();
                    const todayStr = today.toISOString().split('T')[0];
                    const sorted = data.contributions.sort((a: any, b: any) => a.date.localeCompare(b.date));
                    const pastAndPresent = sorted.filter((item: any) => item.date <= todayStr);
                    const displayContribs = pastAndPresent.slice(-371);
                    const totalLastYear = displayContribs.reduce((sum: number, item: any) => sum + item.count, 0);

                    let totalThisYear: number = 0;
                    if (data.total) {
                        const currentYear = today.getFullYear().toString();
                        if (data.total[currentYear] !== undefined) {
                            totalThisYear = Number(data.total[currentYear]);
                        } else {
                            totalThisYear = Object.values(data.total).reduce((a: number, b: any) => a + Number(b), 0);
                        }
                    } else {
                        totalThisYear = totalLastYear;
                    }

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const firstDate = new Date(displayContribs[0].date);
                    const startMonth = firstDate.getMonth();
                    const monthList: string[] = [];
                    for (let i = 0; i <= 12; i++) {
                        const mIndex = (startMonth + i) % 12;
                        monthList.push(monthNames[mIndex]);
                    }

                    setGithubStats({
                        totalThisYear,
                        totalLastYear,
                        contribs: displayContribs,
                        months: monthList
                    });
                }
            })
            .catch(err => {
                console.warn('Failed to fetch GitHub contributions:', err);
            });
    }, []);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');

        if (!formRef.current) return;

        try {
            const serviceId = 'service_xfqxpug';
            const templateId = 'template_05pb6qs';
            const publicKey = '1Rog5VkgQSDsNLzdr';

            const formData = new FormData(formRef.current);
            const templateParams = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                message: formData.get('message') as string,
                from_name: formData.get('name') as string,
                from_email: formData.get('email') as string,
                reply_to: formData.get('email') as string,
            };

            const result = await emailjs.send(
                serviceId,
                templateId,
                templateParams,
                publicKey
            );

            if (result.status === 200) {
                setFormStatus('success');
                formRef.current.reset();
                setTimeout(() => setFormStatus('idle'), 5000);
            } else {
                setFormStatus('error');
                setTimeout(() => setFormStatus('idle'), 3000);
            }
        } catch (error: any) {
            console.error('EmailJS Error:', error);
            setFormStatus('error');
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

    useEffect(() => {
        if (document.querySelector('script[src="/script.js"]')) return;
        // Dynamically load the script to ensure DOM is ready
        const script = document.createElement('script');
        script.src = '/script.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            
    {/*  Background Glow Elements  */}
    <div className="bg-glow bg-glow-1"></div>
    <div className="bg-glow bg-glow-2"></div>
    <div className="bg-glow bg-glow-3"></div>
    <div className="bg-glow bg-glow-4"></div>

    {/*  Navigation Header  */}
    <header className="navbar" style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center'}}>
        <div className="logo-wrapper">
            <div className="logo">
                <img src="assets/logo.png" alt="Thitipong Songkasin" className="logo-img" />
            </div>
            <div className="circular-text">
                <svg viewBox="0 0 100 100">
                    <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                    <text>
                        <textPath href="#circlePath" startOffset="0" textLength="219.5">
                            WELCOME • WELCOME • WELCOME • 
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
        <button 
            id="theme-toggle" 
            className="theme-toggle" 
            aria-label="Toggle theme"
            onClick={() => setIsDark(prev => !prev)}
        >
            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
    </header>

    {/*  Floating Side Navigation  */}
    <nav className="side-nav">
        <a href="#about" className="nav-link" aria-label="About">
            <span className="nav-label">About</span>
            <span className="nav-icon"><i className="fa-solid fa-user"></i></span>
        </a>
        <a href="#experience" className="nav-link" aria-label="Education & Skills">
            <span className="nav-label">Education & Skills</span>
            <span className="nav-icon"><i className="fa-solid fa-graduation-cap"></i></span>
        </a>
        <a href="#skills" className="nav-link" aria-label="Stack">
            <span className="nav-label">Stack</span>
            <span className="nav-icon"><i className="fa-solid fa-layer-group"></i></span>
        </a>
        <a href="#projects" className="nav-link" aria-label="Projects">
            <span className="nav-label">Projects</span>
            <span className="nav-icon"><i className="fa-solid fa-briefcase"></i></span>
        </a>
        <a href="#contact" className="nav-link" aria-label="Contact">
            <span className="nav-label">Contact</span>
            <span className="nav-icon"><i className="fa-solid fa-envelope"></i></span>
        </a>
    </nav>

    {/*  Main Container  */}
    <main className="container">
        
        {/*  Hero Section  */}
        <section className="hero" id="about">
            <div className="hero-intro">
                <span className="hello-tag">Hello! I am <span className="highlight">Thitipong Songkasin (ฐิติพงษ์)</span></span>
            </div>
            
            <div className="profile-container">
                <div className="profile-glow"></div>
                <div className="profile-image-wrapper">
                    <img src="assets/avatar.jpg" alt="Thitipong Songkasin" className="profile-image" />
                </div>
            </div>

            <div className="hero-content">
                <div className="typewriter-container">
                    <span className="typewriter-prefix">I'm a </span>
                    <span className="typewriter-text" id="typewriter">Frontend Developer.</span>
                </div>
                
                <p className="company-status">Currently, I'm a Computer Science Student at <a href="#" className="company-link">@RMUTSB</a>.</p>
                
                <p className="hero-desc">
                    Computer Science student seeking an entry-level Frontend Developer or IT Support opportunity. Eager to apply React, TypeScript, responsive UI, and technical troubleshooting skills in real-world projects while continuing to grow in a collaborative software team.
                </p>
            </div>
        </section>

        {/*  Work Experience / Qualifications Section  */}
        <section className="experience" id="experience">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div className="resume-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
                    <button 
                        className="submit-btn" 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.6rem', 
                            textDecoration: 'none',
                            width: 'fit-content',
                            padding: '0.7rem 1.6rem',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="fa-solid fa-file-pdf"></i>
                        Resume
                        <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.8rem', marginLeft: '0.2rem' }}></i>
                    </button>

                    <div className="resume-dropdown-menu">
                        <a 
                            href="assets/resume-th.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resume-dropdown-item"
                        >
                            <i className="fa-solid fa-file-lines"></i>
                            <span>Resume (ภาษาไทย)</span>
                        </a>
                        <a 
                            href="assets/resume-en.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resume-dropdown-item"
                        >
                            <i className="fa-solid fa-file-lines"></i>
                            <span>Resume (English)</span>
                        </a>
                    </div>
                </div>
            </div>
            <h2 className="section-title">Education & Core Skills</h2>
            <div className="experience-grid">
                
                {/*  Card 1: Education  */}
                <div className="exp-card">
                    <div className="exp-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                    </div>
                    <div className="exp-info">
                        <h3>Bachelor of Computer Science</h3>
                        <p className="company-duration">RMUTSB &bull; GPA: 3.20 &bull; 2022 - Present</p>
                        <p className="exp-text">Rajamangala University of Technology Suvarnabhumi (Huntra Campus). Faculty of Science and Technology, majoring in Computer Science.</p>
                    </div>
                </div>

                {/*  Card 2: Web Dev  */}
                <div className="exp-card">
                    <div className="exp-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </div>
                    <div className="exp-info">
                        <h3>Front-end Development</h3>
                        <p className="company-duration">React &bull; TypeScript &bull; JavaScript</p>
                        <p className="exp-text">Frontend foundation in React, TypeScript, JavaScript, HTML, and CSS. Able to build responsive interfaces for different screen sizes with a focus on clear usability.</p>
                    </div>
                </div>

                {/*  Card 3: IT Support  */}
                <div className="exp-card">
                    <div className="exp-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <div className="exp-info">
                        <h3>Hardware & IT Support</h3>
                        <p className="company-duration">PC Assembly & Troubleshooting</p>
                        <p className="exp-text">Knowledge of PC assembly, hardware specification analysis, and technical troubleshooting. Hands-on use of Git, Postman, and VS Code for development and testing.</p>
                    </div>
                </div>

                {/*  Card 4: Specialized Subjects  */}
                <div className="exp-card">
                    <div className="exp-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <div className="exp-info">
                        <h3>Collaboration & UX</h3>
                        <p className="company-duration">Problem Solving & Teamwork</p>
                        <p className="exp-text">Collaborative project experience with Git/GitHub, including accessibility-aware UI, screen-reader support, and voice-based interactions.</p>
                    </div>
                </div>

            </div>
        </section>

        {/*  Tech Stack Connection Section  */}
        <section className="skills-section" id="skills">
            <h2 className="section-title" style={{'marginBottom': '4rem'}}>Core Stack</h2>

            <div className="connector-diagram">
                {/*  SVG Connector Lines  */}
                <svg className="connector-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
                    {/*  Definitions for gradients and glows  */}
                    <defs>
                        <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/*  Connection Lines (Bezier Curves)  */}
                    <path className="flow-line stretching-rope" style={{animationDelay: '0s'}} d="M 70 75 C 70 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-1.2s'}} d="M 135 75 C 135 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-2.4s'}} d="M 200 75 C 200 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-0.8s'}} d="M 265 75 C 265 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-2.0s'}} d="M 330 75 C 330 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-3.2s'}} d="M 395 75 C 395 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-1.6s'}} d="M 460 75 C 460 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-2.8s'}} d="M 525 75 C 525 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-0.4s'}} d="M 590 75 C 590 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-1.8s'}} d="M 655 75 C 655 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                    <path className="flow-line stretching-rope" style={{animationDelay: '-3.0s'}} d="M 720 75 C 720 160, 400 160, 400 250" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" filter="url(#line-glow)" />
                </svg>

                {/*  Icons positioned over SVG curve start points  */}
                <div className="tech-icons-row">
                    <div className="tech-icon-wrapper" data-name="HTML5" style={{'left': '8.75%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '0s'}}><div className="tech-icon"><i className="fa-brands fa-html5" style={{'color': '#e34c26'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="CSS3" style={{'left': '16.875%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-1.2s'}}><div className="tech-icon"><i className="fa-brands fa-css3-alt" style={{'color': '#264de4'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="JavaScript" style={{'left': '25%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-2.4s'}}><div className="tech-icon"><i className="fa-brands fa-js" style={{'color': '#f7df1e'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="TypeScript" style={{'left': '33.125%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-0.8s'}}><div className="tech-icon"><i className="fa-solid fa-code" style={{'color': '#3178c6'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="React" style={{'left': '41.25%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-2.0s'}}><div className="tech-icon"><i className="fa-brands fa-react" style={{'color': '#61dafb'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="Next.js" style={{'left': '49.375%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-3.2s'}}><div className="tech-icon"><i className="fa-solid fa-cube" style={{'color': '#999'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="Tailwind CSS" style={{'left': '57.5%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-1.6s'}}><div className="tech-icon"><i className="fa-solid fa-wind" style={{'color': '#38bdf8'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="Node.js" style={{'left': '65.625%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-2.8s'}}><div className="tech-icon"><i className="fa-brands fa-node-js" style={{'color': '#339933'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="TensorFlow AI" style={{'left': '73.75%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-0.4s'}}><div className="tech-icon"><i className="fa-solid fa-brain" style={{'color': '#ff6f00'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="Redis" style={{'left': '81.875%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-1.8s'}}><div className="tech-icon"><i className="fa-solid fa-database" style={{'color': '#dc382d'}}></i></div></div>
                    </div>
                    <div className="tech-icon-wrapper" data-name="Git" style={{'left': '90%'}}>
                        <div className="floating-wrapper" style={{animationDelay: '-3.0s'}}><div className="tech-icon"><i className="fa-brands fa-git-alt" style={{'color': '#f05032'}}></i></div></div>
                    </div>
                </div>

                {/*  Central Badge (Ending point of curves)  */}
                <div className="central-badge-container">
                    <div className="central-badge-glow"></div>
                    <div className="central-badge">
                        <img src="assets/logo.png" alt="Thitipong Songkasin" className="central-badge-img" />
                    </div>
                    {/*  Orbit Rings decoration  */}
                    <div className="orbit-ring orbit-1"></div>
                    <div className="orbit-ring orbit-2"></div>
                </div>
            </div>
        </section>

        {/*  GitHub Contributions Section  */}
        <section className="github-section" id="github-contributions">
            <h2 className="section-title">GitHub Activity</h2>
            <div className="github-card">
                <div className="custom-contrib-card">
                    <div className="cc-header">
                        <div className="cc-profile">
                            <div className="cc-avatar-box">
                                <i className="fa-brands fa-github"></i>
                            </div>
                            <div className="cc-user-info">
                                <a href="https://github.com/TTthiti01" target="_blank" rel="noopener noreferrer" className="cc-username">@TTthiti01</a>
                                <span className="cc-subtitle">Contribution Graph</span>
                            </div>
                        </div>
                        <div className="cc-stats">
                            <span className="cc-stat-num">{githubStats.totalThisYear}</span>
                            <span className="cc-stat-label">THIS YEAR TOTAL</span>
                        </div>
                    </div>
                    
                    <div className="cc-months-row">
                        {githubStats.months.map((m, idx) => (
                            <span key={idx}>{m}</span>
                        ))}
                    </div>

                    <div className="cc-grid-wrapper">
                        <div className="cc-grid">
                            {githubStats.contribs.map((day, idx) => (
                                <span 
                                    key={idx} 
                                    className="cc-square" 
                                    data-level={day.level} 
                                    title={`${day.count} contributions on ${day.date}`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="cc-footer">
                        <div className="cc-last-year-count">
                            <span>{githubStats.totalLastYear}</span> contributions in the last year
                        </div>
                        <div className="cc-legend">
                            <span>Less</span>
                            <span className="cc-legend-sq lvl-0"></span>
                            <span className="cc-legend-sq lvl-1"></span>
                            <span className="cc-legend-sq lvl-2"></span>
                            <span className="cc-legend-sq lvl-3"></span>
                            <span className="cc-legend-sq lvl-4"></span>
                            <span>More</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/*  Featured Projects Section  */}
        <section className="projects-section" id="projects">
            
            {/*  Project 1: Nyeta  */}
            <div className="project-item">
                <div className="project-content">
                    <span className="project-tag">Featured Project</span>
                    <h3 className="project-title">Nyeta - Visual Assistance Platform</h3>
                    <div className="project-description">
                        <p>Collaborated on a platform for blind and visually impaired users combining AI visual assistance, object detection, document/currency recognition, and live volunteer video calls. Contributed to eyes-free UX patterns using spoken feedback, TTS, haptics, and screen-reader-friendly interactions.</p>
                    </div>
                    <div className="project-tech-list">
                        <span>Next.js</span>
                        <span>React</span>
                        <span>TypeScript</span>
                        <span>Tailwind CSS</span>
                        <span>WebRTC</span>
                        <span>Gemini API</span>
                        <span>TensorFlow.js</span>
                        <span>Pusher</span>
                    </div>
                    <div className="project-links">
                        <a href="https://github.com/7sadakonr/Nyeta" target="_blank" className="proj-link" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
                        <a href="#" className="proj-link" aria-label="Live Demo"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
                <div className="project-image-container">
                    <div className="project-image-glow"></div>
                    <div className="project-img" style={{ backgroundColor: '#ffffff', aspectRatio: '16/9', borderRadius: '12px' }}></div>
                </div>
            </div>

            {/*  Project 2: TripShare  */}
            <div className="project-item project-reverse">
                <div className="project-content">
                    <span className="project-tag">Featured Project</span>
                    <h3 className="project-title">TripShare - Expense Calculator</h3>
                    <div className="project-description">
                        <p>Built a web app to manage trip members, record expenses, calculate fuel cost, and settle balances between participants. Added expense visualization and automatic settlement logic for an intuitive user experience.</p>
                    </div>
                    <div className="project-tech-list">
                        <span>React</span>
                        <span>TypeScript</span>
                        <span>Vite</span>
                    </div>
                    <div className="project-links">
                        <a href="https://github.com/TTthiti01/trip-share" target="_blank" rel="noopener noreferrer" className="proj-link" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
                        <a href="https://trip-share-phi.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link" aria-label="Live Demo"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
                <div className="project-image-container">
                    <a href="https://trip-share-phi.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <div className="project-image-glow"></div>
                        <img src="assets/trip.png" alt="TripShare App Dashboard" className="project-img" />
                    </a>
                </div>
            </div>

            {/*  Project 3: TodoList Website  */}
            <div className="project-item">
                <div className="project-content">
                    <span className="project-tag">Featured Project</span>
                    <h3 className="project-title">TodoList Website (2025)</h3>
                    <div className="project-description">
                        <p>Full-stack task management app with Pending / In Progress / Completed states, a dashboard, and authentication.</p>
                    </div>
                    <div className="project-tech-list">
                        <span>React</span>
                        <span>TypeScript</span>
                        <span>PostgreSQL</span>
                    </div>
                    <div className="project-links">
                        <a href="https://github.com/TTthiti01" target="_blank" className="proj-link" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
                        <a href="http://localhost:3000/backoffice/home/todo" target="_blank" className="proj-link" aria-label="Live Demo"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
                <div className="project-image-container">
                    <div className="project-image-glow"></div>
                    <img src="assets/Todolist.png" alt="TodoList Website Dashboard" className="project-img" />
                </div>
            </div>

        </section>

        {/*  Contact Section  */}
        <section className="contact-section" id="contact">
            <h2 className="section-title">Contact</h2>
            <div className="contact-card">
                <p className="contact-sub">Let's Connect and Create Impact!</p>
                <p className="contact-text">I am actively seeking an entry-level opportunity as a Frontend Developer or IT Support Specialist. I am eager to apply my technical skills, problem-solving mindset, and passion for technology to a collaborative team. Whether it's building user-friendly web applications or handling technical diagnostics, I'm ready to contribute. Feel free to reach out!</p>
                
                <div style={{'display': 'flex', 'justifyContent': 'center', 'gap': '2rem', 'marginBottom': '2rem', 'flexWrap': 'wrap'}}>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=job2547j@Gmail.com" target="_blank" rel="noopener noreferrer" style={{'color': 'var(--text-muted)', 'textDecoration': 'none', 'fontWeight': '600'}}>
                        <i className="fa-solid fa-envelope" style={{'marginRight': '8px', 'color': 'var(--accent-color)'}}></i>job2547j@Gmail.com
                    </a>
                    <span style={{'color': 'var(--text-muted)', 'fontWeight': '600'}}><i className="fa-solid fa-phone" style={{'marginRight': '8px', 'color': 'var(--accent-color)'}}></i>062-373-2491</span>
                </div>
                
                {/* Contact Form using EmailJS */}
                <form ref={formRef} className="contact-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Name <span className="asterisk">*</span></label>
                        <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email <span className="asterisk">*</span></label>
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope input-icon"></i>
                            <input type="email" id="email" name="email" className="form-input" placeholder="you@email.com" required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="message">Message <span className="asterisk">*</span></label>
                        <textarea id="message" name="message" className="form-textarea" placeholder="Tell me about your project or idea..." required></textarea>
                    </div>
                    
                    <button type="submit" className={`submit-btn ${formStatus === 'success' ? 'btn-success' : formStatus === 'error' ? 'btn-error' : ''}`} disabled={formStatus === 'submitting' || formStatus === 'success'}>
                        {formStatus === 'idle' && <><i className="fa-solid fa-paper-plane"></i> Send message</>}
                        {formStatus === 'submitting' && <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</>}
                        {formStatus === 'success' && <><i className="fa-solid fa-check"></i> Sent Successfully!</>}
                        {formStatus === 'error' && <><i className="fa-solid fa-circle-exclamation"></i> Error, try again</>}
                    </button>
                </form>

            </div>
        </section>

    </main>

    {/*  Footer with Giant Text  */}
    <footer className="footer-section">
        <h1 className="footer-giant-text">THITIPONG</h1>
    </footer>

    {/*  Generic Modal for Experience Details  */}
    <div id="exp-modal" className="modal-overlay">
        <div className="modal-content">
            <button className="modal-close"><i className="fa-solid fa-xmark"></i></button>
            <h3 id="modal-title">Title</h3>
            <p id="modal-subtitle" className="company-duration">Subtitle</p>
            <div id="modal-body" className="exp-details-modal">
                {/*  Content injected here  */}
            </div>
        </div>
    </div>

    {/*  Custom JS  */}
    
        </>
    );
}

export default App;
