// script.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if(menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Scroll Spy for Dot Navigation
    const sections = document.querySelectorAll('h2[id]');
    const navDots = document.querySelectorAll('.dot-item');

    if (navDots.length > 0 && sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            // Highlight the section taking up the most screen space or near top
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // 200px offset to trigger highlight before the header hits the very top
                if (window.scrollY >= (sectionTop - 200)) {
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