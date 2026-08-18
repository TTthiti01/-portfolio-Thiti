// Start Theme Management & Interactions
setTimeout(() => {


// Interactive Parallax background glow based on mouse movements (Desktops only)
if (window.matchMedia('(pointer: fine)').matches) {
    let isGlowTicking = false;
    window.addEventListener('mousemove', (e) => {
        if (!isGlowTicking) {
            window.requestAnimationFrame(() => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const xRatio = (mouseX / window.innerWidth - 0.5) * 40;
                const yRatio = (mouseY / window.innerHeight - 0.5) * 40;
                
                const glow1 = document.querySelector('.bg-glow-1');
                const glow2 = document.querySelector('.bg-glow-2');
                const glow3 = document.querySelector('.bg-glow-3');
                const glow4 = document.querySelector('.bg-glow-4');
                
                if (glow1) glow1.style.transform = `translate(${xRatio}px, ${yRatio}px)`;
                if (glow2) glow2.style.transform = `translate(${-xRatio}px, ${-yRatio}px)`;
                if (glow3) glow3.style.transform = `translate(${xRatio * 0.5}px, ${yRatio * 0.5}px)`;
                if (glow4) glow4.style.transform = `translate(${-xRatio * 0.8}px, ${-yRatio * 0.8}px)`;
                
                isGlowTicking = false;
            });
            isGlowTicking = true;
        }
    });
}

// Navbar active link highlight on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
let isScrollTicking = false;

window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
            let current = '';
            const scrollPos = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollPos >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
            isScrollTicking = false;
        });
        isScrollTicking = true;
    }
});

// Fetch and Generate Custom Purple GitHub Contributions Grid
function initGitHubContributions() {
    const ccGrid = document.getElementById('cc-grid');
    const ccTotalCount = document.getElementById('cc-total-count');
    const ccYearCount = document.getElementById('cc-year-count');

    if (!ccGrid) {
        setTimeout(initGitHubContributions, 300);
        return;
    }

    const username = 'TTthiti01';

    function renderGrid(contributionsList, totalThisYear, totalLastYear) {
        ccGrid.innerHTML = '';
        if (ccTotalCount) ccTotalCount.textContent = totalThisYear;
        if (ccYearCount) ccYearCount.textContent = totalLastYear;

        contributionsList.forEach((day) => {
            const square = document.createElement('span');
            square.className = 'cc-square';
            square.setAttribute('data-level', day.level);
            square.setAttribute('title', `${day.count} contributions on ${day.date}`);
            ccGrid.appendChild(square);
        });
    }

    // Attempt to fetch actual live data from public Contributions API
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
        .then(res => res.json())
        .then(data => {
            if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                
                // Sort all contributions by date ascending
                const sorted = data.contributions.sort((a, b) => a.date.localeCompare(b.date));
                
                // Filter out future dates
                const pastAndPresent = sorted.filter(item => item.date <= todayStr);
                
                // Take the last 371 days (53 weeks * 7 days)
                const displayContribs = pastAndPresent.slice(-371);
                
                // Calculate total for last 365 days
                const totalLastYear = displayContribs.reduce((sum, item) => sum + item.count, 0);
                
                // Calculate total for current calendar year
                let totalThisYear = 0;
                if (data.total) {
                    const currentYear = today.getFullYear().toString();
                    if (data.total[currentYear] !== undefined) {
                        totalThisYear = data.total[currentYear];
                    } else {
                        totalThisYear = Object.values(data.total).reduce((a, b) => a + b, 0);
                    }
                } else {
                    totalThisYear = totalLastYear;
                }

                // Update month labels dynamically
                const monthsRow = document.querySelector('.cc-months-row');
                if (monthsRow && displayContribs.length > 0) {
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const firstDate = new Date(displayContribs[0].date);
                    const startMonth = firstDate.getMonth();
                    let html = '';
                    for (let i = 0; i <= 12; i++) {
                        const mIndex = (startMonth + i) % 12;
                        html += `<span>${monthNames[mIndex]}</span>`;
                    }
                    monthsRow.innerHTML = html;
                }

                renderGrid(displayContribs, totalThisYear, totalLastYear);
            } else {
                throw new Error("Invalid data format");
            }
        })
        .catch(err => {
            console.warn("GitHub Contributions API failed", err);
            renderGrid([], 23, 24);
        });
}

initGitHubContributions();

// --- Gimmicks & Playful Interactions ---
setTimeout(() => {
    // 1. Scroll Reveal Animations (Slide & Fade)
    const revealElements = document.querySelectorAll('.exp-card, .project-item, .contact-card, .github-card, .tech-icon-wrapper, .section-title');
    const isMobile = window.innerWidth <= 768;
    
    // On mobile, reveal all elements immediately without hiding
    if (isMobile) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px 50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    let projIndex = 0;
    let techIndex = 0;
    
    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        
        // Add directional slide effects
        if (el.classList.contains('project-item')) {
            if (projIndex % 2 === 0) el.classList.add('reveal-left');
            else el.classList.add('reveal-right');
            projIndex++;
        } else if (el.classList.contains('tech-icon-wrapper')) {
            el.classList.add('reveal-scale');
            el.style.transitionDelay = `${(techIndex % 11) * 80}ms`;
            techIndex++;
        } else if (el.classList.contains('exp-card')) {
            el.classList.add('reveal-scale');
        }
        
        revealObserver.observe(el);
    });

    // 2. 3D Tilt Effect for Experience & Project Cards
    const tiltCards = document.querySelectorAll('.exp-card, .project-item');
    tiltCards.forEach(card => {
        let isTiltTicking = false;
        card.addEventListener('mousemove', function(e) {
            if (!isTiltTicking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg tilt
                    const rotateY = ((x - centerX) / centerX) * 4;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    isTiltTicking = false;
                });
                isTiltTicking = true;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', function() {
            card.style.transition = 'none'; // Remove transition for instant tracking
        });
    });

    // Modal Logic for Experience Cards
    const modal = document.getElementById('exp-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBody = document.getElementById('modal-body');

    const expCards = document.querySelectorAll('.exp-card');
    expCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Extract data
            const title = this.querySelector('h3').innerText;
            const subtitle = this.querySelector('.company-duration').innerHTML;
            const detailsHTML = this.querySelector('.exp-text').innerHTML;
            
            // Populate modal
            modalTitle.innerText = title;
            modalSubtitle.innerHTML = subtitle;
            modalBody.innerHTML = detailsHTML;
            
            // Show modal
            modal.classList.add('active');
        });
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close when clicking outside content
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Stars removed
});

// 3. Night Sky Stars
function initStars() {
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    document.body.prepend(starsContainer);

    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random size, position, and animation duration
        const size = Math.random() * 2 + 1; // 1px to 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}
