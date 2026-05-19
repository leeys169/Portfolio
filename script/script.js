// ====================== 1. 타이핑 텍스트 로직 ======================
const lines = ["기록하고,", "만들고,", "개선합니다"];
const typingEl = document.getElementById("typing-text");
let lineIndex = 0;
let charIndex = 0;

function typing() {
    if (lineIndex < lines.length) {
        if (charIndex < lines[lineIndex].length) {
            typingEl.innerHTML += lines[lineIndex][charIndex];
            charIndex++;
            setTimeout(typing, 80);
        } else {
            if (lineIndex < lines.length - 1) {
                typingEl.innerHTML += "<br/>";
            }
            lineIndex++;
            charIndex = 0;
            setTimeout(typing, 300);
        }
    } else {
        setTimeout(startTransition, 800);
    }
}

// ====================== 2. 인트로 -> 본문 전환 ======================
function startTransition() {
    const intro = document.getElementById("intro");
    const main = document.getElementById("main-contents");
    const quickNav = document.querySelector(".quick-nav");

    if (main) main.style.display = "block";
    
    const tl = gsap.timeline();

    tl.to(intro, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
            intro.style.display = "none";
            document.body.style.overflow = "auto"; 
            window.scrollTo(0, 0);
            
            // 인트로 종료 후 퀵 네비게이션 표시
            if (quickNav) quickNav.classList.add("visible");
            
            initScrollAnimations();
        }
    });

    tl.to(main, {
        opacity: 1,
        visibility: "visible",
        duration: 1
    }, "-=0.5");
}

// ====================== 3. GSAP 스크롤 애니메이션 ======================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll(".reveal");

    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                opacity: 0, 
                y: 80 
            }, 
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power2.out(1.7)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
}

// ====================== 4. 퀵 네비게이션 로직 (추가) ======================
function initQuickNav() {
    const dots = document.querySelectorAll('.nav-dot');
    // 이동할 섹션들의 ID 리스트
    const sections = ['#profile', '#about', '#skills', '#works', '#footer'];

    // 1. 스크롤 시 해당 섹션 도트 활성화 (ScrollSpy)
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(id => {
            const section = document.querySelector(id);
            if (section) {
                const sectionTop = section.offsetTop;
                // 현재 스크롤 위치가 섹션 상단 근처에 오면 활성화
                if (window.pageYOffset >= sectionTop - 300) {
                    current = id;
                }
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === current) {
                dot.classList.add('active');
            }
        });
    });

    // 2. 도트 클릭 시 부드러운 이동 (GSAP ScrollToPlugin 활용)
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href');
            gsap.to(window, { 
                duration: 0.6, 
                scrollTo: targetId, 
                ease: "power3.inOut" 
            });
        });
    });
}

// ====================== 5. WORK TAB (페이드 전환) ======================
function initTabEvents() {
    const tabBtns = document.querySelectorAll(".works-tab-btn");
    const tabContents = document.querySelectorAll(".works-tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.tab;
            const targetContent = document.getElementById(targetId);
            const currentContent = document.querySelector(".works-tab-content.active");

            if (!targetContent || currentContent === targetContent) return;

            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tl = gsap.timeline();

            tl.to(currentContent, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    currentContent.classList.remove("active");
                    currentContent.style.display = "none";
                    targetContent.style.display = "block";
                    targetContent.style.opacity = "0";
                }
            });

            tl.fromTo(targetContent, 
                { opacity: 0, y: 10 }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.4, 
                    ease: "power2.out",
                    onStart: () => {
                        targetContent.classList.add("active");
                    },
                    onComplete: () => {
                        ScrollTrigger.refresh();
                    }
                }
            );
        });
    });
}

// const cursor = document.querySelector(".cursor-dot");
// const hoverElements = document.querySelectorAll("a, button, .works-tab-btn, .work-item");

// hoverElements.forEach(el => {
//     el.addEventListener("mouseenter", () => {
//         cursor.classList.add("on-focus");
//     });
//     el.addEventListener("mouseleave", () => {
//         cursor.classList.remove("on-focus");
//     });
// });


// window.addEventListener("mousemove", (e) => {
//     gsap.to(".cursor-dot", {
//         x: e.clientX,
//         y: e.clientY,
//         duration: 0
//     });
// });

// ====================== 6. DESIGN POPUP ======================
function initDesignPopup() {
    const popup = document.getElementById("designPopup");
    const popupImg = document.getElementById("designPopupImg");
    const popupTitle = document.getElementById("designPopupTitle");
    const openBtns = document.querySelectorAll(".design-open-btn");
    const closeBtns = document.querySelectorAll("[data-popup-close]");

    if (!popup || !popupImg || !popupTitle) return;

    function openPopup(imgSrc, title) {
        popupImg.src = imgSrc;
        popupImg.alt = `${title} 전체 디자인 이미지`;
        popupTitle.textContent = title;
        popup.classList.add("active");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("popup-open");
    }

    function closePopup() {
        popup.classList.remove("active");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("popup-open");
        popupImg.src = "";
    }

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const imgSrc = btn.dataset.popupImg;
            const title = btn.dataset.popupTitle || "Design Preview";
            if (!imgSrc) return;
            openPopup(imgSrc, title);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", closePopup);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
        }
    });
}

// ====================== 7. 최종 실행 명령 ======================
window.addEventListener("DOMContentLoaded", () => {
    initTabEvents();
    initQuickNav(); // 퀵 네비게이션 초기화 추가
    initDesignPopup(); // 디자인 팝업 초기화
    setTimeout(typing, 100);
});