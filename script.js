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

    // --- Scroll Spy (Dot Nav) Logic ---
    const sections = document.querySelectorAll('h2[id]');
    const navDots = document.querySelectorAll('.dot-item');

    if (navDots.length > 0 && sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Offset to highlight before reaching exact top
                if (window.scrollY >= (sectionTop - 250)) {
                    current = section.getAttribute('id');
                }
            });

            navDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === '#' + current) {
                    dot.classList.add('active');
                }
            });
        });
    }
});