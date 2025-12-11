'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(30, 58, 138, 0.6)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const element = resumeRef.current;
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio, undefined, 'FAST');
    pdf.save('Alejandro_De_La_Mora_Resume.pdf');
  };

  return (
    <>
      <canvas ref={canvasRef} className="webgl-container" />
      <div className="relative min-h-screen">
        <div ref={resumeRef} className="resume-shell max-w-5xl mx-auto bg-white shadow-2xl my-8 p-12">
          {/* Header */}
          <header className="resume-header border-b-4 border-primary pb-6 mb-8">
            <h1 className="text-5xl font-bold text-primary mb-2">Alejandro De La Mora</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <a href="mailto:alex@seshwithfriends.org" className="hover:text-secondary">alex@seshwithfriends.org</a>
              <span>|</span>
              <span>+1 437 243 3693</span>
              <span>|</span>
              <a href="https://www.linkedin.com/in/amorac/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary">LinkedIn</a>
              <span>|</span>
              <a href="http://www.eloruga.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary">Website</a>
              <span>|</span>
              <a href="https://github.com/Oruga420" target="_blank" rel="noopener noreferrer" className="hover:text-secondary">GitHub</a>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="section-title text-3xl font-bold text-primary mb-4 border-l-4 border-secondary pl-4">Professional Summary</h2>
            <p className="text-gray-800 leading-relaxed">
              AI Solutions Architect and Engineer who thrives at the intersection of Generative AI, automation, and scalable delivery.
              I specialize in building &quot;GenAI that ships&quot;—architecting LLM workflows, agentic systems, and data pipelines that reach production
              and solve real business problems. With a background transitioning from Project Management to Salesforce Development and now deep
              AI Engineering, I bring a unique blend of technical rigor (GCP, AWS, Python) and product intuition. I have architected over 120
              GenAI applications, saved companies over $1M in operational costs, and driven AI adoption from 47% to 97% by building tools that
              people actually use.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="section-title text-3xl font-bold text-primary mb-4 border-l-4 border-secondary pl-4">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">AI & ML:</h3>
                <p className="text-gray-800">Generative AI, Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), Agentic Workflows, MCP Servers, Prompt Engineering, Model Fine-tuning.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">Cloud & Infrastructure:</h3>
                <p className="text-gray-800">Google Cloud Platform (GCP), AWS, Vercel, Next.js, API Integration.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">Languages & Data:</h3>
                <p className="text-gray-800">Python, SQL, JavaScript, Shell Scripting.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">Platforms:</h3>
                <p className="text-gray-800">Salesforce (Agentforce, Apex), Zapier, DBT (Data Build Tool concepts).</p>
              </div>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="section-title text-3xl font-bold text-primary mb-4 border-l-4 border-secondary pl-4">Professional Experience</h2>

            {/* Assent */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-secondary">Assent | AI Solutions Architect</h3>
                  <p className="text-gray-600 italic">February 2025 - Present | Canada (Remote)</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4">
                <li><strong>High-Impact AI Implementation:</strong> Architected and deployed a GenAI stack using OpenAI, Anthropic, and Gemini models, featuring live RAG connections and custom MCP servers to expose compliance data safely.</li>
                <li><strong>Scalable Efficiency:</strong> Achieved over <strong>20,000 man-hours saved</strong> in a single year by replacing repetitive manual tasks with autonomous agents and internal AI tools.</li>
                <li><strong>Adoption Drive:</strong> Increased internal AI tool adoption from 47% to <strong>97%</strong> by focusing on user-centric design and solving tangible friction points for employees.</li>
                <li><strong>Governance & Security:</strong> Established documentation and security frameworks to ensure all AI deployments are auditable, secure, and compliant with regulated industry standards.</li>
              </ul>
            </div>

            {/* Sesh */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-secondary">Sesh | AI Solutions Architect</h3>
                  <p className="text-gray-600 italic">November 2021 - Present | Toronto, Ontario</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4">
                <li><strong>Production Scale:</strong> Designed the architecture for <strong>120+ GenAI applications</strong> and <strong>90+ chatbots</strong> that solve day-to-day problems for over 30 clients.</li>
                <li><strong>Full-Stack AI:</strong> Built AI-ready websites and marketing engines using Next.js and Vercel, wired directly into automation backends for immediate customer conversion.</li>
                <li><strong>Community Leadership:</strong> Lead a 100+ person community, providing free classes and tutorials on GenAI workflows. Speaker for Latinas in Tech and Somos Latinos in Tech Ottawa.</li>
              </ul>
            </div>

            {/* Online Business Systems */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-secondary">Online Business Systems | Salesforce Consultant (AI & Agentforce)</h3>
                  <p className="text-gray-600 italic">June 2024 - November 2024 | Toronto, Ontario</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4">
                <li><strong>Agentic Design:</strong> Configured Salesforce Agentforce assistants, defining use cases, wiring data access safely, and setting up actions to create copilot-style experiences for enterprise clients.</li>
                <li><strong>Workflow Integration:</strong> Ensured AI agents fit seamlessly into existing sales and marketing operations (MCAE), preventing workflow disruption while enhancing productivity.</li>
              </ul>
            </div>

            {/* Globalization Partners */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-secondary">Globalization Partners | Salesforce Manager & AI Lead</h3>
                  <p className="text-gray-600 italic">November 2018 - November 2023 | Ontario, Canada</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4">
                <li><strong>AI Innovation:</strong> Pioneered the company&apos;s first internal AI tools, including &quot;GIA&quot; (an internal chatbot) and GenAI-powered Jira ticket handling systems.</li>
                <li><strong>Technical Leadership:</strong> Managed a Salesforce org with 1,000+ licenses, transitioning from Admin to Developer/Manager, and introduced &quot;vibe coding&quot; patterns to accelerate development cycles while maintaining governance.</li>
              </ul>
            </div>
          </section>

          {/* Projects & Open Source */}
          <section className="mb-8">
            <h2 className="section-title text-3xl font-bold text-primary mb-4 border-l-4 border-secondary pl-4">Projects & Open Source</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4">
              <li><strong>GenAI Portfolio:</strong> A collection of over 100 shipped projects demonstrating real-world application of LLMs and automation. Code and wiring available for inspection on GitHub.</li>
              <li><strong>Community Education:</strong> Active mentor and content creator, helping non-technical teams bridge the gap to becoming AI-proficient operators.</li>
            </ul>
          </section>

          {/* Education & Certifications */}
          <section className="mb-8">
            <h2 className="section-title text-3xl font-bold text-primary mb-4 border-l-4 border-secondary pl-4">Education & Certifications</h2>
            <ul className="space-y-2 text-gray-800">
              <li><strong>Salesforce Certified AI Associate</strong> | Salesforce</li>
              <li><strong>Salesforce Certified Administrator</strong> | Salesforce</li>
              <li><strong>Engineering in Systems (LISI)</strong> | Universidad Marista de Mérida (2004 - 2007)</li>
            </ul>
          </section>
        </div>

        {/* Download Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={downloadPDF}
            className="download-button bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}
