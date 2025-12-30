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

    // External Buttons (Wiki / Discord)
    function addExternalButtons() {
        if (!sidebar) return;
        if (sidebar.querySelector('.external-buttons')) return; // already added

        const container = document.createElement('div');
        container.className = 'external-buttons';

        const wiki = document.createElement('a');
        wiki.className = 'btn wiki';
        wiki.href = 'https://roblox-grass-cutting-incremental.fandom.com/wiki/Roblox_Grass_Cutting_Incremental_Wiki';
        wiki.target = '_blank';
        wiki.rel = 'noopener noreferrer';
        const wikiImg = document.createElement('img');
        wikiImg.src = 'assets/img/Main.ico';
        wikiImg.alt = 'Wiki';
        wikiImg.className = 'btn-icon';
        wiki.appendChild(wikiImg);
        wiki.appendChild(document.createTextNode(' Go to the GCI Wiki!'));

        const discord = document.createElement('a');
        discord.className = 'btn discord';
        discord.href = 'https://discord.gg/xk7CdTQt';
        discord.target = '_blank';
        discord.rel = 'noopener noreferrer';
        // Inline Discord SVG icon (created below to avoid escaping issues)

        // Create SVG manually to avoid escaping issues
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'btn-icon');
        svg.setAttribute('viewBox', '0 0 24 24');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('fill', '#FFFFFF');
        path.setAttribute('d', 'M20.317 4.369A19.791 19.791 0 0016.956 3c-.2.349-.435.806-.6 1.163-1.796-.269-3.555-.269-5.181 0-.165-.357-.4-.814-.6-1.163A19.736 19.736 0 003.683 4.37C.677 9.048-.3 13.57.066 18.03 3.0 19.712 6.0 20.9 9.2 21.318c.583-.797 1.104-1.63 1.55-2.47-2.67-.8-4.63-2.2-5.6-3.6 0 0 .47.32 1.27.87 2.3.97 4.8 1.59 7.4 1.9 2.6-.31 5.1-.93 7.4-1.9.8-.54 1.27-.87 1.27-.87-.98 1.39-2.95 2.8-5.62 3.6.45.84.97 1.67 1.55 2.47 3.2-.42 6.2-1.605 9.14-3.288C24.3 13.57 23.3 9.048 20.317 4.369zM8.02 14.8c-1.03 0-1.87-.95-1.87-2.12 0-1.17.83-2.12 1.87-2.12 1.05 0 1.9.95 1.87 2.12 0 1.17-.82 2.12-1.87 2.12zm7.96 0c-1.03 0-1.87-.95-1.87-2.12 0-1.17.83-2.12 1.87-2.12 1.05 0 1.9.95 1.87 2.12 0 1.17-.82 2.12-1.87 2.12z');
        svg.appendChild(path);
        discord.appendChild(svg);
        discord.appendChild(document.createTextNode(' Join The Discord!'));

        container.appendChild(wiki);
        container.appendChild(discord);

        const navEl = sidebar.querySelector('nav');
        if (navEl && navEl.parentNode) navEl.parentNode.insertBefore(container, navEl.nextSibling);
        else sidebar.appendChild(container);
    }

    buildTOC();
    buildDotNav();
    initScrollSpy();
    addExternalButtons();
});