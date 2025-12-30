document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const body = document.body;
    const mobileToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const expandBtn = document.getElementById('desktop-expand-btn');

    // --- Mobile Menu Logic ---
    if(mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // --- Desktop Collapse Logic ---
    
    // 1. Check LocalStorage for saved preference
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
        body.classList.add('collapsed');
    }

    // 2. Function to toggle sidebar
    function toggleSidebar() {
        body.classList.toggle('collapsed');
        
        // Save state
        const isCollapsed = body.classList.contains('collapsed');
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    }

    // 3. Add Event Listeners
    if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebar);
    if (expandBtn) expandBtn.addEventListener('click', toggleSidebar);

    // --- Dot Navigation Auto-Builder ---
    function buildDotNav() {
        // Respect pages that already declare their own dot nav
        if (document.getElementById('dot-nav')) return;
        const headings = document.querySelectorAll('h2[id]');
        if (!headings.length) return;

        const dotNav = document.createElement('div');
        dotNav.id = 'dot-nav';

        headings.forEach(h => {
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.className = 'dot-item';

            const circle = document.createElement('div');
            circle.className = 'dot-circle';
            const label = document.createElement('span');
            label.className = 'dot-label';
            label.textContent = h.textContent;

            a.appendChild(circle);
            a.appendChild(label);
            dotNav.appendChild(a);
        });

        const main = document.querySelector('main');
        if (main && main.parentNode) main.parentNode.insertBefore(dotNav, main);
    }

    // --- Scroll Spy (Dot Nav) Logic ---
    function initScrollSpy() {
        const sections = document.querySelectorAll('h2[id]');
        const navDots = document.querySelectorAll('.dot-item');
        if (navDots.length === 0 || sections.length === 0) return;

        function updateActive() {
            let current = '';
            // Build targets from the dot links (ensures we support h2, h3, divs, etc.)
            const targets = Array.from(navDots).map(dot => {
                const id = (dot.getAttribute('href') || '').replace('#','');
                const el = document.getElementById(id);
                return { id, el };
            }).filter(t => t.el);

            targets.forEach(t => {
                const sectionTop = t.el.getBoundingClientRect().top + window.scrollY;
                if (window.scrollY >= (sectionTop - 250)) {
                    current = t.id;
                }
            });

            navDots.forEach(dot => {
                dot.classList.toggle('active', dot.getAttribute('href') === '#' + current);
            });
        }

        window.addEventListener('scroll', updateActive);
        // Run once to set initial state
        updateActive();

        // Ensure clicks update the active state after jump
        navDots.forEach(dot => dot.addEventListener('click', () => setTimeout(updateActive, 100)));
    }

    // --- Table of Contents Auto-Generator ---
    function buildTOC() {
        const container = document.querySelector('.guide-container');
        if (!container) return;
        // If a TOC already exists, skip (respect pages that have a custom or manual TOC)
        if (container.querySelector('.toc-box')) return;

        const headings = container.querySelectorAll('h2[id]');
        if (!headings.length) return;

        const tocBox = document.createElement('div');
        tocBox.className = 'toc-box';

        const tocTitle = document.createElement('div');
        tocTitle.className = 'toc-title';
        tocTitle.textContent = 'Table of Contents';
        tocBox.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach(h => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        });

        tocBox.appendChild(tocList);

        // Insert after credits box if present, otherwise before first h2
        const credits = container.querySelector('.credits-box');
        if (credits && credits.parentNode === container) {
            container.insertBefore(tocBox, credits.nextSibling);
        } else {
            const firstH2 = container.querySelector('h2[id]');
            if (firstH2) container.insertBefore(tocBox, firstH2);
            else container.appendChild(tocBox);
        }
    }

    buildTOC();
    buildDotNav();
    initScrollSpy();
});