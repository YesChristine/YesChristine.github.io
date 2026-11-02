const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const copyButton = document.querySelector("[data-copy]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Theme
function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#111714" : "#f3f1ea"
  );
}

setTheme(root.dataset.theme || "light");

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Mobile navigation
function closeMenu() {
  nav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  if (!nav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Sticky header state
function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);

  if (window.scrollY < 160) {
    document.querySelectorAll("#site-nav a").forEach((link) => {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });
  }
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Scroll reveal
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -9% 0px", threshold: 0.06 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Highlight the current navigation item
const navLinks = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNavigation(activeId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function updateActiveNavigation() {
  if (window.scrollY < 160) {
    setActiveNavigation(null);
    return;
  }

  const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 280);
  let activeId = null;

  navSections.forEach((section) => {
    if (section.offsetTop <= marker) activeId = section.id;
  });

  setActiveNavigation(activeId);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveNavigation(link.getAttribute("href").slice(1));
  });
});

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();

// Restore deep links after web fonts and fixed-size media finish affecting layout.
function restoreHashPosition() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  target.scrollIntoView({ block: "start" });
  updateActiveNavigation();
}

if (location.hash) {
  window.addEventListener("load", () => {
    window.requestAnimationFrame(restoreHashPosition);
    document.fonts?.ready.then(() => window.requestAnimationFrame(restoreHashPosition));
  });
}

// Subtle profile-card tilt on pointer devices
const tiltArea = document.querySelector("[data-tilt]");
const profileCard = tiltArea?.querySelector(".profile-card");
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)");

if (tiltArea && profileCard && canTilt.matches && !reduceMotion.matches) {
  tiltArea.addEventListener("pointermove", (event) => {
    const rect = tiltArea.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltArea.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    tiltArea.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
  });

  tiltArea.addEventListener("pointerleave", () => {
    tiltArea.style.setProperty("--rx", "0deg");
    tiltArea.style.setProperty("--ry", "0deg");
  });
}

// Copy email with a graceful fallback
copyButton?.addEventListener("click", async () => {
  const email = copyButton.dataset.copy;
  if (!email) return;

  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const input = document.createElement("textarea");
    input.value = email;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  const label = copyButton.querySelector("span");
  const originalText = label.textContent;
  label.textContent = "Copied";
  copyButton.setAttribute("aria-live", "polite");
  window.setTimeout(() => {
    label.textContent = originalText;
  }, 1800);
});

// Keep the copyright year current
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
