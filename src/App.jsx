import { useEffect, useRef, useState } from 'react'
import { personal, projects, skills, otherProjects } from './data/siteData'
import { Reveal, Stagger, ScrollLinked, ScrollText } from './motion'
import { subscribeScroll, prefersReducedMotion } from './motion/engine'

const ArrowUpRight = ({ small = false }) => <span className={small ? 'arrow arrow--small' : 'arrow'} aria-hidden="true">↗</span>

function Logo() { return <a className="logo" href="#home" aria-label="Umar Gusau home">{personal.shortName}</a> }

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const openRef = useRef(false)
  const barRef = useRef(null)
  const links = [['About','about'],['Projects','projects'],['Skills','skills'],['Journey','journey'],['Contact','contact']]

  // Keep the nav visible while the mobile menu is open
  useEffect(() => {
    openRef.current = open
    if (open) setHidden(false)
  }, [open])

  // Compact + hide-on-scroll-down / show-on-scroll-up, driven by the shared scroll loop
  useEffect(() => {
    let travelled = 0
    let direction = 0
    return subscribeScroll((y, dy) => {
      setScrolled(y > 24)

      // Page progress hairline (direct style write, no React re-render)
      if (barRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
        barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`
      }

      if (!dy || prefersReducedMotion()) return
      const dir = dy > 0 ? 1 : -1
      if (dir !== direction) { direction = dir; travelled = 0 }
      travelled += dy

      if (y < 120) setHidden(false)
      else if (travelled > 14 && !openRef.current) setHidden(true)
      else if (travelled < -6) setHidden(false)
    })
  }, [])

  return <header
    className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${hidden ? 'navbar--hidden' : ''}`}
    onFocusCapture={() => setHidden(false)}
  >
    <div className="container nav-inner">
      <Logo />
      <nav className={`nav-links ${open ? 'nav-links--open' : ''}`} aria-label="Primary navigation">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Let's Talk <ArrowUpRight small /></a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Toggle navigation"><span></span><span></span></button>
    </div>
    <span className="nav-progress" ref={barRef} aria-hidden="true"></span>
  </header>
}

function CodeWindow() {
  return <div className="code-window" aria-label="Developer profile visual">
    <div className="window-bar"><span></span><span></span><span></span><em>umar.dev</em></div>
    <Stagger className="code-body" base={950} step={85} y={10}>
      <div><i>const</i> developer = {'{'}</div>
      <div className="indent"><b>name:</b> <s>'Umar Gusau'</s>,</div>
      <div className="indent"><b>role:</b> <s>'Frontend Developer'</s>,</div>
      <div className="indent"><b>focus:</b> [<s>'React'</s>, <s>'JavaScript'</s>],</div>
      <div className="indent"><b>builds:</b> <s>'real products'</s>,</div>
      <div className="indent"><b>learning:</b> <s>'always'</s></div>
      <div>{'}'}</div>
      <div className="code-status"><span className="status-dot"></span> available for opportunities</div>
    </Stagger>
  </div>
}

function Hero() {
  return <ScrollLinked as="section" mode="hero" className="hero" id="home">
    <div className="hero-grid"></div>
    <div className="container hero-inner">
      <div className="hero-copy">
        <Reveal as="p" className="eyebrow" delay={140} y={18}><span className="eyebrow-dot"></span> Web Developer · React · JavaScript</Reveal>
        <Reveal as="h1" variant="blur" delay={240} y={46} duration={1250}>I build digital products that <span>work beyond the screen.</span></Reveal>
        <Reveal as="p" className="hero-description" delay={440} y={28}>I'm Umar Gusau, a Web Developer / Frontend Developer from Nigeria. I build clean interfaces with React and connect them to the APIs, databases, and systems behind them.</Reveal>
        <div className="hero-actions">
          <Reveal as="a" className="button button--primary" href="#projects" delay={600} y={22}>View my work <ArrowUpRight /></Reveal>
          <Reveal as="a" className="button button--ghost" href="#contact" delay={700} y={22}>Let's connect</Reveal>
        </div>
        <Reveal className="hero-meta" delay={820} y={14}><span>Based in Nigeria</span><span className="meta-line"></span><span>Building since 2024</span></Reveal>
      </div>
      <div className="hero-visual">
        <Reveal delay={420} y={64} scale={0.94} duration={1400}><CodeWindow /></Reveal>
      </div>
    </div>
    <Stagger className="scroll-cue" base={1600} y={10}><span>Scroll to explore</span><span className="scroll-line"></span></Stagger>
  </ScrollLinked>
}

function SectionHeading({ kicker, title, text, id }) {
  return <Stagger className="section-heading" id={id} step={110} y={28}>
    <p className="eyebrow">{kicker}</p><h2>{title}</h2>{text && <p className="section-intro">{text}</p>}
  </Stagger>
}

function About() {
  return <ScrollLinked as="section" mode="fade" className="section about" id="about">
    <div className="container">
      <SectionHeading kicker="01 / About" title={<>A developer who likes to <em>build.</em></>} text="My work sits between thoughtful interfaces and the systems that make them useful." />
      <div className="about-grid">
        <div className="about-main">
          <ScrollText className="large-copy">I started learning web development around May 2024. Since then, I've gone from building interfaces to working on applications with authentication, APIs, databases, third-party services, and deployment.</ScrollText>
          <Reveal as="p" y={26}>My primary focus is frontend development, especially React.js. But I also enjoy understanding what happens behind the interface — how data moves, how an API is structured, how authentication works, and how a product gets from a local machine to a deployed application.</Reveal>
        </div>
        <Stagger className="about-side" x={18} y={16} step={120} base={150}>
          <div className="info-line"><span>01</span><strong>Frontend</strong><p>React, JavaScript, responsive interfaces and component-based UI.</p></div>
          <div className="info-line"><span>02</span><strong>Backend</strong><p>Node.js, Express, REST APIs, authentication and databases.</p></div>
          <div className="info-line"><span>03</span><strong>Mindset</strong><p>Understand the problem, build deliberately, test, deploy, improve.</p></div>
        </Stagger>
      </div>
    </div>
  </ScrollLinked>
}

function Skills() {
  return <ScrollLinked as="section" mode="fade" className="section skills" id="skills">
    <div className="container">
      <SectionHeading kicker="02 / Toolkit" title={<>The tools behind the <em>work.</em></>} text="A practical stack built around frontend engineering, with enough backend experience to understand the full path from interface to data." />
      <Reveal className="skills-grid" y={44} scale={0.985} duration={1100}>
        {Object.entries(skills).map(([group, items], g) => <div className="skill-group" key={group} style={{ '--g': g }}>
          <p className="skill-label">{group}</p>
          <div className="skill-list">{items.map((item, i) => <span key={item} style={{ '--i': i }}>{item}</span>)}</div>
        </div>)}
      </Reveal>
    </div>
  </ScrollLinked>
}

function ProjectVisual({ project }) {
  return <ScrollLinked mode="visual" className={`project-visual ${project.visualClass}`}>
    <div className="mock-browser">
      <div className="browser-top"><span></span><span></span><span></span><div>project / {project.id}</div></div>
      <Stagger className="mock-content" base={380} step={110} y={18}>
        {project.id === 'gudali' && <><div className="mock-title">GUDALI</div><div className="mock-subtitle">Cattle knowledge, structured for learning.</div><div className="mock-panels"><span>BREEDS</span><span>DISEASES</span><span>COURSES</span></div></>}
        {project.id === 'barakah' && <><div className="mock-title">Go Barakah</div><div className="mock-subtitle">Give with purpose.</div><div className="mock-dashboard"><span></span><span></span><span></span></div></>}
        {project.id === 'electricity' && <><div className="mock-title">Usage Overview</div><div className="meter-value">284.6 <small>kWh</small></div><div className="mock-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div></>}
        {project.id === 'pink-kitchen' && <><div className="mock-title">The Pink Kitchen</div><div className="mock-subtitle">Freshly made. Easy to order.</div><div className="mock-dashboard pink-products"><span>2 BOX</span><span>4 BOX</span><span>6 BOX</span></div></>}
      </Stagger>
    </div>
    <div className="visual-caption"><span>{project.label}</span><span>{project.number} / 04</span></div>
  </ScrollLinked>
}

function ProjectCaseStudy({ project, index }) {
  const reverse = index % 2 === 1
  return <article className={`project-case ${reverse ? 'project-case--reverse' : ''}`}>
    <ProjectVisual project={project} />
    <Stagger className="project-copy" x={reverse ? -26 : 26} y={30} step={90}>
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
    </Stagger>
  </article>
}

function Projects() {
  return <ScrollLinked as="section" mode="enter" className="section projects" id="projects">
    <div className="container">
      <SectionHeading kicker="03 / Selected work" title={<>Projects with a story <em>behind them.</em></>} text="I don't want the portfolio to show only what an application looks like. These projects show what I was trying to solve, how I contributed, and what I learned along the way." />
      <div className="project-list">{projects.map((project, index) => <ProjectCaseStudy key={project.id} project={project} index={index} />)}</div>
      <div className="other-projects">
        <Stagger step={110} y={24}><p className="eyebrow">More projects</p><h3>A few more things I've built.</h3></Stagger>
        <div className="other-grid">{otherProjects.map(([name, type]) => <Reveal key={name} className="other-item" y={22}><span>{name}</span><small>{type}</small><ArrowUpRight small /></Reveal>)}</div>
      </div>
    </div>
  </ScrollLinked>
}

function Journey() {
  const steps = [
    ['2024', 'Started web development', 'Began the journey into building for the web, learning the fundamentals and turning small ideas into working pages.'],
    ['2024 — 2025', 'From interfaces to applications', 'Progressively moved into React, backend development, databases, APIs, authentication and deployment.'],
    ['2025', 'Collaborative software work', 'Worked on collaborative software projects and contributed backend functionality while learning how to build and integrate features within a larger system.'],
    ['Present', 'Building with more intention', 'Focused on React, JavaScript, frontend engineering, backend integration and stronger software engineering fundamentals.'],
  ]
  return <ScrollLinked as="section" mode="fade" className="section journey" id="journey">
    <div className="container">
      <SectionHeading kicker="04 / Journey" title={<>Still learning. Still <em>shipping.</em></>} text="The goal isn't to pretend I've finished learning. It's to show a clear progression in what I can build and how I approach the work." />
      <ScrollLinked mode="progress" className="timeline">{steps.map(([year, title, text], i) => <Reveal className="timeline-item" key={year} y={30}><div className="timeline-marker">0{i + 1}</div><div className="timeline-year">{year}</div><div className="timeline-content"><h3>{title}</h3><p>{text}</p></div></Reveal>)}</ScrollLinked>
    </div>
  </ScrollLinked>
}

function Approach() {
  const items = [['01','Think','Understand the problem and the people using the product.'],['02','Design','Plan the structure before turning requirements into UI.'],['03','Build','Create reusable components and a responsive interface.'],['04','Connect','Bring APIs, authentication and data into the experience.'],['05','Test','Debug, check edge cases and make the details work.'],['06','Deploy','Ship the application and learn from what happens next.']]
  return <ScrollLinked as="section" mode="fade" className="section approach">
    <div className="container approach-grid">
      <Stagger step={110} y={28}><p className="eyebrow">05 / How I build</p><h2>Think clearly.<br/><em>Build deliberately.</em></h2><p className="section-intro">My process is simple enough to repeat and flexible enough to adapt to the project.</p></Stagger>
      <div className="approach-list">{items.map(([n,t,d]) => <Reveal className="approach-item" key={n} y={22}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div>
    </div>
  </ScrollLinked>
}

function Education() {
  return <ScrollLinked as="section" mode="fade" className="section education">
    <div className="container education-grid">
      <Stagger step={110} y={28}><p className="eyebrow">06 / Education</p><h2>Cyber Security,<br/><em>software engineering.</em></h2></Stagger>
      <Reveal className="education-card" delay={220} y={36} scale={0.975} duration={1100}><span className="education-mark">BSc</span><div><p className="skill-label">Academic background</p><h3>BSc Cyber Security</h3><p>My degree gives me another lens for thinking about software — particularly authentication, data, APIs and security-conscious development — while my professional direction remains firmly rooted in web and frontend development.</p></div></Reveal>
    </div>
  </ScrollLinked>
}

function Contact() {
  return <ScrollLinked as="section" mode="enter" className="section contact" id="contact">
    <div className="container contact-inner">
      <Stagger step={110} y={28}><p className="eyebrow">07 / Contact</p><h2>Have an opportunity,<br/><em>project, or idea?</em></h2><p className="contact-copy">I'm open to conversations about frontend development, software projects, collaborations and opportunities to keep growing as a developer.</p></Stagger>
      <Reveal className="contact-actions" delay={280} y={30}><a className="contact-email" href={personal.email.includes('YOUR_') ? '#' : `mailto:${personal.email}`}>{personal.email}</a><div className="socials"><a href={personal.github === 'GITHUB_URL_HERE' ? '#' : personal.github}>GitHub <ArrowUpRight small /></a><a href={personal.linkedin === 'LINKEDIN_URL_HERE' ? '#' : personal.linkedin}>LinkedIn <ArrowUpRight small /></a></div></Reveal>
    </div>
  </ScrollLinked>
}

function Footer() {
  return <footer><Reveal className="container footer-inner" y={16}><div><Logo /><p>{personal.role}</p></div><div className="footer-links"><a href="#home">Back to top ↑</a><span>© {new Date().getFullYear()} Umar Gusau</span></div></Reveal></footer>
}

export default function App() {
  // Smooth anchor scrolling, but never when the visitor prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion()) return
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])
  return <><Navbar /><main><Hero /><About /><Skills /><Projects /><Journey /><Approach /><Education /><Contact /></main><Footer /></>
}