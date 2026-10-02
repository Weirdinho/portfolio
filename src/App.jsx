import { useEffect, useState } from 'react'
import { personal, projects, skills, otherProjects } from './data/siteData'

const ArrowUpRight = ({ small = false }) => <span className={small ? 'arrow arrow--small' : 'arrow'} aria-hidden="true">↗</span>

function Logo() { return <a className="logo" href="#home" aria-label="Umar Gusau home">{personal.shortName}</a> }

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [['About','about'],['Projects','projects'],['Skills','skills'],['Journey','journey'],['Contact','contact']]
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
    <div className="container nav-inner">
      <Logo />
      <nav className={`nav-links ${open ? 'nav-links--open' : ''}`} aria-label="Primary navigation">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Let's Talk <ArrowUpRight small /></a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Toggle navigation"><span></span><span></span></button>
    </div>
  </header>
}

function CodeWindow() {
  return <div className="code-window" aria-label="Developer profile visual">
    <div className="window-bar"><span></span><span></span><span></span><em>umar.dev</em></div>
    <div className="code-body">
      <div><i>const</i> developer = {'{'}</div>
      <div className="indent"><b>name:</b> <s>'Umar Gusau'</s>,</div>
      <div className="indent"><b>role:</b> <s>'Frontend Developer'</s>,</div>
      <div className="indent"><b>focus:</b> [<s>'React'</s>, <s>'JavaScript'</s>],</div>
      <div className="indent"><b>builds:</b> <s>'real products'</s>,</div>
      <div className="indent"><b>learning:</b> <s>'always'</s></div>
      <div>{'}'}</div>
      <div className="code-status"><span className="status-dot"></span> available for opportunities</div>
    </div>
  </div>
}

function Hero() {
  return <section className="hero" id="home">
    <div className="hero-grid"></div>
    <div className="container hero-inner">
      <div className="hero-copy reveal">
        <p className="eyebrow"><span className="eyebrow-dot"></span> Web Developer · React · JavaScript</p>
        <h1>I build digital products that <span>work beyond the screen.</span></h1>
        <p className="hero-description">I'm Umar Gusau, a Web Developer / Frontend Developer from Nigeria. I build clean interfaces with React and connect them to the APIs, databases, and systems behind them.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#projects">View my work <ArrowUpRight /></a>
          <a className="button button--ghost" href="#contact">Let's connect</a>
        </div>
        <div className="hero-meta"><span>Based in Nigeria</span><span className="meta-line"></span><span>Building since 2024</span></div>
      </div>
      <div className="hero-visual reveal reveal-delay"><CodeWindow /></div>
    </div>
    <div className="scroll-cue"><span>Scroll to explore</span><span className="scroll-line"></span></div>
  </section>
}

function SectionHeading({ kicker, title, text, id }) {
  return <div className="section-heading" id={id}>
    <p className="eyebrow">{kicker}</p><h2>{title}</h2>{text && <p className="section-intro">{text}</p>}
  </div>
}

function About() {
  return <section className="section about" id="about">
    <div className="container">
      <SectionHeading kicker="01 / About" title={<>A developer who likes to <em>build.</em></>} text="My work sits between thoughtful interfaces and the systems that make them useful." />
      <div className="about-grid">
        <div className="about-main">
          <p className="large-copy">I started learning web development around May 2024. Since then, I've gone from building interfaces to working on applications with authentication, APIs, databases, third-party services, and deployment.</p>
          <p>My primary focus is frontend development, especially React.js. But I also enjoy understanding what happens behind the interface — how data moves, how an API is structured, how authentication works, and how a product gets from a local machine to a deployed application.</p>
        </div>
        <div className="about-side">
          <div className="info-line"><span>01</span><strong>Frontend</strong><p>React, JavaScript, responsive interfaces and component-based UI.</p></div>
          <div className="info-line"><span>02</span><strong>Backend</strong><p>Node.js, Express, REST APIs, authentication and databases.</p></div>
          <div className="info-line"><span>03</span><strong>Mindset</strong><p>Understand the problem, build deliberately, test, deploy, improve.</p></div>
        </div>
      </div>
    </div>
  </section>
}

function Skills() {
  return <section className="section skills" id="skills">
    <div className="container">
      <SectionHeading kicker="02 / Toolkit" title={<>The tools behind the <em>work.</em></>} text="A practical stack built around frontend engineering, with enough backend experience to understand the full path from interface to data." />
      <div className="skills-grid">{Object.entries(skills).map(([group, items]) => <div className="skill-group" key={group}><p className="skill-label">{group}</p><div className="skill-list">{items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div>
    </div>
  </section>
}

function ProjectVisual({ project }) {
  return <div className={`project-visual ${project.visualClass}`}>
    <div className="mock-browser">
      <div className="browser-top"><span></span><span></span><span></span><div>project / {project.id}</div></div>
      <div className="mock-content">
        {project.id === 'gudali' && <><div className="mock-title">GUDALI</div><div className="mock-subtitle">Cattle knowledge, structured for learning.</div><div className="mock-panels"><span>BREEDS</span><span>DISEASES</span><span>COURSES</span></div></>}
        {project.id === 'barakah' && <><div className="mock-title">Go Barakah</div><div className="mock-subtitle">Give with purpose.</div><div className="mock-dashboard"><span></span><span></span><span></span></div></>}
        {project.id === 'electricity' && <><div className="mock-title">Usage Overview</div><div className="meter-value">284.6 <small>kWh</small></div><div className="mock-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div></>}
        {project.id === 'pink-kitchen' && <><div className="mock-title">The Pink Kitchen</div><div className="mock-subtitle">Freshly made. Easy to order.</div><div className="mock-dashboard pink-products"><span>2 BOX</span><span>4 BOX</span><span>6 BOX</span></div></>}
      </div>
    </div>
    <div className="visual-caption"><span>{project.label}</span><span>{project.number} / 04</span></div>
  </div>
}

function ProjectCaseStudy({ project, index }) {
  return <article className={`project-case ${index % 2 ? 'project-case--reverse' : ''}`}>
    <ProjectVisual project={project} />
    <div className="project-copy">
      <div className="project-top"><span>{project.number}</span><span>{project.category}</span></div>
      <h3>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="role-tag">{project.teamProject ? 'Team Project' : 'My Role'} · {project.role.replace('Team project · ', '')}</div>
      <div className="project-detail-grid">
        <div><span>Stack</span><p>{project.stack.join(' · ')}</p></div>
        <div><span>What I built / contributed</span><p>{project.features.slice(0, 3).join(' · ')}</p></div>
      </div>
      <div className="project-links"><a href={project.liveUrl === 'LIVE_URL_HERE' ? '#' : project.liveUrl} target={project.liveUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Live project <ArrowUpRight small /></a><a href={project.githubUrl === 'GITHUB_URL_HERE' ? '#' : project.githubUrl} target={project.githubUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer">Source code <ArrowUpRight small /></a></div>
      <details className="case-study"><summary>Read the case study <span>+</span></summary><div className="case-grid"><div><b>Challenge</b><p>{project.challenge}</p></div><div><b>Lesson</b><p>{project.lesson}</p></div></div></details>
    </div>
  </article>
}

function Projects() {
  return <section className="section projects" id="projects">
    <div className="container">
      <SectionHeading kicker="03 / Selected work" title={<>Projects with a story <em>behind them.</em></>} text="I don't want the portfolio to show only what an application looks like. These projects show what I was trying to solve, how I contributed, and what I learned along the way." />
      <div className="project-list">{projects.map((project, index) => <ProjectCaseStudy key={project.id} project={project} index={index} />)}</div>
      <div className="other-projects"><div><p className="eyebrow">More projects</p><h3>A few more things I've built.</h3></div><div className="other-grid">{otherProjects.map(([name, type]) => <div key={name} className="other-item"><span>{name}</span><small>{type}</small><ArrowUpRight small /></div>)}</div></div>
    </div>
  </section>
}

function Journey() {
  const steps = [
    ['2024', 'Started web development', 'Began the journey into building for the web, learning the fundamentals and turning small ideas into working pages.'],
    ['2024 — 2025', 'From interfaces to applications', 'Progressively moved into React, backend development, databases, APIs, authentication and deployment.'],
    ['2025', 'Collaborative software work', 'Worked on collaborative software projects and contributed backend functionality while learning how to build and integrate features within a larger system.'],
    ['Present', 'Building with more intention', 'Focused on React, JavaScript, frontend engineering, backend integration and stronger software engineering fundamentals.'],
  ]
  return <section className="section journey" id="journey">
    <div className="container">
      <SectionHeading kicker="04 / Journey" title={<>Still learning. Still <em>shipping.</em></>} text="The goal isn't to pretend I've finished learning. It's to show a clear progression in what I can build and how I approach the work." />
      <div className="timeline">{steps.map(([year, title, text], i) => <div className="timeline-item" key={year}><div className="timeline-marker">0{i + 1}</div><div className="timeline-year">{year}</div><div className="timeline-content"><h3>{title}</h3><p>{text}</p></div></div>)}</div>
    </div>
  </section>
}

function Approach() {
  const items = [['01','Think','Understand the problem and the people using the product.'],['02','Design','Plan the structure before turning requirements into UI.'],['03','Build','Create reusable components and a responsive interface.'],['04','Connect','Bring APIs, authentication and data into the experience.'],['05','Test','Debug, check edge cases and make the details work.'],['06','Deploy','Ship the application and learn from what happens next.']]
  return <section className="section approach"><div className="container approach-grid"><div><p className="eyebrow">05 / How I build</p><h2>Think clearly.<br/><em>Build deliberately.</em></h2><p className="section-intro">My process is simple enough to repeat and flexible enough to adapt to the project.</p></div><div className="approach-list">{items.map(([n,t,d]) => <div className="approach-item" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></section>
}

function Education() {
  return <section className="section education"><div className="container education-grid"><div><p className="eyebrow">06 / Education</p><h2>Cyber Security,<br/><em>software engineering.</em></h2></div><div className="education-card"><span className="education-mark">BSc</span><div><p className="skill-label">Academic background</p><h3>BSc Cyber Security</h3><p>My degree gives me another lens for thinking about software — particularly authentication, data, APIs and security-conscious development — while my professional direction remains firmly rooted in web and frontend development.</p></div></div></div></section>
}

function Contact() {
  return <section className="section contact" id="contact"><div className="container contact-inner"><div><p className="eyebrow">07 / Contact</p><h2>Have an opportunity,<br/><em>project, or idea?</em></h2><p className="contact-copy">I'm open to conversations about frontend development, software projects, collaborations and opportunities to keep growing as a developer.</p></div><div className="contact-actions"><a className="contact-email" href={personal.email.includes('YOUR_') ? '#' : `mailto:${personal.email}`}>{personal.email}</a><div className="socials"><a href={personal.github === 'GITHUB_URL_HERE' ? '#' : personal.github}>GitHub <ArrowUpRight small /></a><a href={personal.linkedin === 'LINKEDIN_URL_HERE' ? '#' : personal.linkedin}>LinkedIn <ArrowUpRight small /></a></div></div></div></section>
}

function Footer() { return <footer><div className="container footer-inner"><div><Logo /><p>{personal.role}</p></div><div className="footer-links"><a href="#home">Back to top ↑</a><span>© {new Date().getFullYear()} Umar Gusau</span></div></div></footer> }

export default function App() {
  useEffect(() => { document.documentElement.style.scrollBehavior = 'smooth'; return () => { document.documentElement.style.scrollBehavior = '' } }, [])
  return <><Navbar /><main><Hero /><About /><Skills /><Projects /><Journey /><Approach /><Education /><Contact /></main><Footer /></>
}
