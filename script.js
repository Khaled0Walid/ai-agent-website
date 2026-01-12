document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.card, .step, .use-case-item, .feature, .hero-title, .hero-subtitle, .hero-buttons, .section-title');

    // Add fade-in class to all elements we want to animate
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Stagger animations for grids
    const grids = document.querySelectorAll('.grid-3, .grid-2, .steps');
    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            // cycle through 1, 2, 3 delay classes
            const delay = (index % 3) + 1;
            child.classList.add(`stagger-${delay}`);
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    /* =========================================
       CHAT DEMO FUNCTIONALITY
       ========================================= */
    const demoModal = document.getElementById('demo-modal');
    const startDemoBtn = document.getElementById('start-demo-btn');
    const closeDemoBtn = document.getElementById('close-demo');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickRepliesContainer = document.getElementById('quick-replies');

    // Real n8n webhook URL
    const N8N_WEBHOOK_URL = 'https://n8n-service-e5pk.onrender.com/webhook/chat';

    // Toggle Modal
    if (startDemoBtn) {
        startDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            demoModal.classList.add('active');
            // Add initial greeting if empty
            if (chatMessages.children.length === 0) {
                addAgentMessage("Hi there! I'm an AI agent designed to help automate your business. How can I help you today?");
                showQuickReplies(['Book a Demo', 'Qualification', 'Support']);
            }
        });
    }

    if (closeDemoBtn) {
        closeDemoBtn.addEventListener('click', () => {
            demoModal.classList.remove('active');
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            demoModal.classList.remove('active');
        }
    });

    // Chat Logic
    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.innerHTML = `${text}<span class="message-time">${getCurrentTime()}</span>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addAgentMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message agent';
        msgDiv.innerHTML = `${text}<span class="message-time">${getCurrentTime()}</span>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.style.display = 'flex'; // Force display
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    async function sendMessage(text) {
        if (!text.trim()) return;

        // UI Updates
        addUserMessage(text);
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;
        quickRepliesContainer.innerHTML = ''; // Clear quick replies

        showTypingIndicator();

        try {
            // Actual Webhook Call
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Extract response - supports 'output' or 'text' properties
            const aiResponse = data.output || data.text || "I received your message but the AI response was empty.";

            removeTypingIndicator();
            addAgentMessage(aiResponse);

        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            // Show the actual error for debugging
            addAgentMessage(`Connection Error: ${error.message}. <br> <small>Check console (F12) for CORS details.</small>`);
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    // Event Listeners for Input
    sendBtn.addEventListener('click', () => sendMessage(userInput.value));

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(userInput.value);
    });

    // Quick Replies
    function showQuickReplies(options) {
        quickRepliesContainer.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => sendMessage(option));
            quickRepliesContainer.appendChild(btn);
        });
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enable inputs initially
    userInput.disabled = false;
    sendBtn.disabled = false;
});
