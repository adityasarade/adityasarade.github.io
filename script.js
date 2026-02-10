/* ============================================================
   ADITYA SARADE - PORTFOLIO
   JavaScript: Interactivity, Particles, Chatbot, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ==================== BOOT SEQUENCE ====================
    initBootSequence();

    // ==================== PARTICLE SYSTEM ====================
    initParticles();

    // ==================== CUSTOM CURSOR ====================
    initCursor();

    // ==================== NAVIGATION ====================
    initNavigation();

    // ==================== TYPING EFFECT ====================
    initTypingEffect();

    // ==================== SCROLL ANIMATIONS ====================
    initScrollReveal();
    initScrollProgress();
    initStatCounters();

    // ==================== CHATBOT ====================
    initChatbot();
});

/* ==================== BOOT SEQUENCE ==================== */
function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLines = document.querySelectorAll('.boot-line');
    const progressBar = document.querySelector('.boot-progress-bar');

    if (!bootScreen) return;

    let delay = 300;
    bootLines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add('visible');
            const progress = ((i + 1) / bootLines.length) * 100;
            progressBar.style.width = progress + '%';
        }, delay);
        delay += 500;
    });

    setTimeout(() => {
        bootScreen.classList.add('hidden');
        document.body.classList.remove('loading');
    }, delay + 600);
}

/* ==================== PARTICLE SYSTEM ==================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animFrame;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const colors = [
        'rgba(0, 255, 136, 0.5)',
        'rgba(6, 182, 212, 0.4)',
        'rgba(168, 85, 247, 0.35)',
        'rgba(59, 130, 246, 0.3)'
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Adjust particle count based on screen size
    const count = Math.min(Math.floor((width * height) / 12000), 120);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animFrame = requestAnimationFrame(animate);
    }

    animate();
}

/* ==================== CUSTOM CURSOR ==================== */
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    // Check for touch device
    if ('ontouchstart' in window) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .contact-card, .nav-link');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/* ==================== NAVIGATION ==================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scroll;
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }

    // Active section tracking
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

/* ==================== TYPING EFFECT ==================== */
function initTypingEffect() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const strings = [
        'AI Engineer',
        'Multi-Agent Systems Architect',
        'RAG Pipeline Builder',
        'Memory Layer Developer',
        'Vector Search Specialist',
        'Open Source Contributor'
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
        const current = strings[stringIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            delay = 50;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            delay = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    // Start after boot sequence
    setTimeout(type, 3500);
}

/* ==================== SCROLL REVEAL ==================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ==================== SCROLL PROGRESS ==================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

/* ==================== STAT COUNTERS ==================== */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 30);
    }
}

/* ==================== CHATBOT ==================== */
function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window_ = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');
    const suggestions = document.getElementById('chatbot-suggestions');
    const badge = document.querySelector('.chatbot-badge');

    if (!toggle) return;

    let isOpen = false;
    let hasGreeted = false;

    // Toggle chatbot
    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            window_.classList.add('open');
            badge.style.display = 'none';
            if (!hasGreeted) {
                addBotMessage("Hey there! I'm Adi AI, Aditya's virtual assistant. Ask me anything about his skills, projects, experience, or just say hi!");
                hasGreeted = true;
            }
            input.focus();
        } else {
            window_.classList.remove('open');
        }
    });

    close.addEventListener('click', () => {
        isOpen = false;
        window_.classList.remove('open');
    });

    // Send message
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addUserMessage(text);
        input.value = '';

        // Show typing indicator
        showTyping();

        // Generate response
        setTimeout(() => {
            removeTyping();
            const response = generateResponse(text);
            addBotMessage(response);
        }, 600 + Math.random() * 800);
    }

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Suggestion chips
    const chips = document.querySelectorAll('.suggestion-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            addUserMessage(query);
            showTyping();
            setTimeout(() => {
                removeTyping();
                addBotMessage(generateResponse(query));
            }, 600 + Math.random() * 600);
        });
    });

    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `
            <div class="chat-message-avatar"><i class="fas fa-terminal"></i></div>
            <div class="chat-bubble">${text}</div>
        `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `
            <div class="chat-message-avatar"><i class="fas fa-user"></i></div>
            <div class="chat-bubble">${escapeHtml(text)}</div>
        `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-message bot typing-msg';
        typing.innerHTML = `
            <div class="chat-message-avatar"><i class="fas fa-terminal"></i></div>
            <div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
        `;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        const t = messages.querySelector('.typing-msg');
        if (t) t.remove();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== CHATBOT KNOWLEDGE BASE ====================
    function generateResponse(input) {
        const q = input.toLowerCase().trim();

        // Greetings
        if (/^(hi|hello|hey|sup|yo|howdy|hola|greetings)/i.test(q)) {
            return pickRandom([
                "Hey! Nice to meet you. I'm here to tell you all about Aditya. What would you like to know?",
                "Hello there! Welcome to Aditya's digital space. Feel free to ask me anything!",
                "Hey! Glad you stopped by. Want to know about Aditya's projects, skills, or experience?"
            ]);
        }

        // Who is Aditya
        if (/who (is|are)|about (aditya|him|you)|tell me about|introduce/i.test(q)) {
            return "Aditya Sarade is an <strong>AI Engineer</strong> specializing in building the Memory Layer for Agentic AI. He's pursuing AI & Data Science at AISSMS Institute of Information Technology. He works with multi-agent systems, RAG pipelines, and vector search. His motto? <em>\"Always trying to find harder problems to solve.\"</em>";
        }

        // Skills
        if (/skill|tech|stack|know|proficien|what (can|does) (he|aditya) (do|use)|technologies/i.test(q)) {
            return "Aditya's tech arsenal is packed:<br><br><strong>AI/LLMs:</strong> LangGraph, Multi-Agent Systems, RAG, Prompt Engineering<br><strong>ML/DL:</strong> TensorFlow, PyTorch, Scikit-learn, XGBoost<br><strong>Vector DBs:</strong> Qdrant, Pinecone, ChromaDB, FAISS<br><strong>Backend:</strong> FastAPI, Flask, Django, Node.js<br><strong>DevOps:</strong> Docker, Kubernetes, AWS, Azure<br><strong>Languages:</strong> Python, JavaScript, TypeScript, SQL, C/C++";
        }

        // Projects
        if (/project|built|build|portfolio|work|made|create/i.test(q)) {
            return "Here are some of Aditya's standout projects:<br><br><strong>OSCAR</strong> - An intelligent local copilot for devs using voice/typed commands<br><strong>Asterix</strong> - Python library for AI agent memory (published on PyPI!)<br><strong>QueryPilot</strong> - RAG-based SQL Copilot with 95%+ acceptance rate<br><strong>Document Researcher</strong> - Multi-PDF processing with FAISS semantic search<br><br>He has <strong>13+ projects</strong> in total. Check them out in the Projects section!";
        }

        // Experience
        if (/experience|work|job|intern|company|career|employ/i.test(q)) {
            return "Aditya's professional experience:<br><br><strong>AI Engineer Intern @ Wasserstoff Innovations</strong> (Jun 2025 - Present)<br>Building FastAPI backends, vector search workflows, multi-agent HR systems with LangGraph, and reduced query latency by 90%!<br><br><strong>Data Science Intern @ Adgama Digital</strong> (Feb - Apr 2025)<br>Fine-tuned 15+ ML/DL models and deployed 10+ models into production web apps.";
        }

        // Education
        if (/education|study|college|university|degree|school|learn/i.test(q)) {
            return "Aditya is pursuing <strong>Artificial Intelligence and Data Science</strong> at <strong>AISSMS Institute of Information Technology</strong>. He also has certifications from UC Berkeley, DeepLearning.AI, Microsoft, Databricks, and more!";
        }

        // Contact
        if (/contact|reach|email|connect|hire|get in touch|talk/i.test(q)) {
            return "You can reach Aditya through:<br><br>Email: <strong>aditya.sarade2003@gmail.com</strong><br>LinkedIn: <a href='https://www.linkedin.com/in/adityasarade' target='_blank' style='color: var(--accent-green)'>linkedin.com/in/adityasarade</a><br>GitHub: <a href='https://github.com/adityasarade' target='_blank' style='color: var(--accent-green)'>github.com/adityasarade</a><br><br>He's open to opportunities and collaborations!";
        }

        // Certifications
        if (/cert|certif|course|credential|badge/i.test(q)) {
            return "Aditya holds certifications from:<br><br>- <strong>AI Agents in LangGraph</strong> (DeepLearning.AI)<br>- <strong>LLMs as OS: Agent Memory</strong> (DeepLearning.AI)<br>- <strong>Large Language Model Agents</strong> (UC Berkeley)<br>- <strong>Neural Networks & Deep Learning</strong> (Coursera)<br>- <strong>Career Essentials in GenAI</strong> (Microsoft)<br>- <strong>Generative AI Fundamentals</strong> (Databricks)<br>...and more!";
        }

        // Hobbies
        if (/hobby|hobbies|interest|fun|free time|outside work|passion/i.test(q)) {
            return "Outside of coding, Aditya is into:<br><br>- <strong>Chess</strong> - sharpens his strategic thinking<br>- <strong>Astronomy</strong> - loves gazing at the cosmos<br>- <strong>Model United Nations</strong> - debates and diplomacy<br><br>He also leads AI events, speaker sessions, and coding competitions!";
        }

        // Specific projects
        if (/oscar/i.test(q)) {
            return "<strong>OSCAR</strong> is an intelligent local copilot for developers. It accepts trigger-based voice or typed instructions and decomposes high-level goals into structured action sequences using advanced AI. Think of it as your personal dev assistant! <a href='https://github.com/adityasarade/OSCAR' target='_blank' style='color: var(--accent-green)'>View on GitHub</a>";
        }

        if (/asterix/i.test(q)) {
            return "<strong>Asterix</strong> is a Python library that enables AI agents to read/write editable memory blocks, persist state across sessions via SQLite, and perform semantic retrieval with Qdrant Cloud. It's published on PyPI with 5 GitHub stars! <a href='https://pypi.org/project/asterix/' target='_blank' style='color: var(--accent-green)'>View on PyPI</a>";
        }

        if (/query.?pilot/i.test(q)) {
            return "<strong>QueryPilot</strong> is a RAG-based SQL Copilot using LLaMA 3 and Pinecone for real-time autocompletion. It achieved a 95%+ acceptance rate and 50% latency reduction. Fully Dockerized with MLflow integration! <a href='https://github.com/adityasarade/Query-Pilot' target='_blank' style='color: var(--accent-green)'>View on GitHub</a>";
        }

        // Easter eggs
        if (/sudo hire aditya/i.test(q)) {
            return "<span style='color: var(--accent-green); font-family: var(--font-mono);'>$ sudo hire aditya<br>[sudo] password confirmed<br>Processing... done.<br><br>HIRED SUCCESSFULLY.<br>Welcome aboard, you made a great choice!</span>";
        }

        if (/meaning of life|42/i.test(q)) {
            return "42. But if you're looking for a more practical answer, it's probably building AI agents that actually remember things.";
        }

        if (/joke/i.test(q)) {
            return pickRandom([
                "Why do programmers prefer dark mode? Because light attracts bugs!",
                "There are only 10 types of people in the world: those who understand binary, and those who don't.",
                "Why did the AI cross the road? Because it was in the training data.",
                "A SQL query walks into a bar, sees two tables and asks... 'Can I JOIN you?'"
            ]);
        }

        // Resume / availability
        if (/resume|cv|download|pdf|available|open to/i.test(q)) {
            return "Aditya is currently <strong>open to new opportunities</strong>! You can reach out to him at <strong>aditya.sarade2003@gmail.com</strong> or connect on <a href='https://www.linkedin.com/in/adityasarade' target='_blank' style='color: var(--accent-green)'>LinkedIn</a> to request his resume.";
        }

        // Location
        if (/where|location|based|live|city/i.test(q)) {
            return "Aditya is based in <strong>Pune, Maharashtra, India</strong>. He studied at AISSMS Institute of Information Technology and has worked remotely with companies in Gurugram as well.";
        }

        // AI / what does he do
        if (/what does he do|what.*speciali|focus|domain|field/i.test(q)) {
            return "Aditya specializes in building the <strong>Memory Layer for Agentic AI</strong>. This means enabling AI agents to have persistent context, long-term planning, and reliable multi-step behavior. His daily work involves multi-agent orchestration with LangGraph, RAG pipelines, vector search, and building developer tools.";
        }

        // LangGraph / RAG / specific tech
        if (/langgraph|multi.?agent/i.test(q)) {
            return "Aditya is deep into <strong>LangGraph</strong> and multi-agent systems. At Wasserstoff, he built a multi-agent HR automation system using LangGraph and MongoDB for candidate evaluation and behavioral analysis. He's also certified in AI Agents in LangGraph from DeepLearning.AI!";
        }

        if (/rag|retrieval/i.test(q)) {
            return "RAG (Retrieval-Augmented Generation) is one of Aditya's core specialties. He builds production-grade RAG pipelines using vector databases like Qdrant, Pinecone, ChromaDB, and FAISS. His QueryPilot project achieved 95%+ acceptance rate using RAG with LLaMA 3!";
        }

        // Thanks
        if (/thank|thanks|thx|appreciate/i.test(q)) {
            return pickRandom([
                "You're welcome! Let me know if there's anything else you'd like to know about Aditya.",
                "Happy to help! Feel free to explore the site or ask more questions.",
                "Anytime! If you're impressed, maybe drop Aditya a message!"
            ]);
        }

        // Bye
        if (/bye|goodbye|see ya|later|cya/i.test(q)) {
            return pickRandom([
                "See you later! Don't forget to check out Aditya's projects before you go!",
                "Goodbye! Hope you enjoyed exploring Aditya's portfolio.",
                "Catch you later! Feel free to come back anytime."
            ]);
        }

        // GitHub
        if (/github|repo|open source/i.test(q)) {
            return "Check out Aditya's GitHub: <a href='https://github.com/adityasarade' target='_blank' style='color: var(--accent-green)'>github.com/adityasarade</a><br><br>He has 13+ repos, 10+ stars, and 2 published PyPI packages. His most popular project Asterix has 5 stars!";
        }

        // PyPI
        if (/pypi|package|library|publish/i.test(q)) {
            return "Aditya has <strong>2 published PyPI packages</strong>:<br><br>1. <strong>Asterix</strong> - AI agent memory library<br>2. <strong>QMem</strong> - Vector search automation CLI<br><br>Check them on <a href='https://pypi.org/project/asterix/' target='_blank' style='color: var(--accent-green)'>PyPI</a>!";
        }

        // Fallback
        return pickRandom([
            "Hmm, I'm not sure about that one. Try asking about Aditya's <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, or <strong>education</strong>!",
            "Good question! I might not have the answer to that specific one. You can ask me about Aditya's work, tech stack, or how to contact him.",
            "I'm best at answering questions about Aditya's background. Try asking about his <strong>projects</strong>, <strong>skills</strong>, or <strong>experience</strong>!",
            "Not sure about that, but I can tell you about Aditya's AI projects, skills, certifications, or how to reach him. What interests you?"
        ]);
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
