<template>
  <aside class="sidebar" data-sidebar>
    <div class="sidebar-info">
      <figure class="avatar-box">
        <img src="../assets/images/my-avatar.png" alt="Anuj Khurana" width="100" />
      </figure>

      <div class="info-content">
        <h1 class="name" title="Anuj Khurana">Anuj Khurana</h1>

        <p class="title">Full Stack developer</p>

        <a href="https://www.github.com/aanujkhurana" target="_blank"
          ><span class="link">
            <ion-icon class="git-icon" name="logo-github"></ion-icon>
            <p>github.com/aanujkhurana</p>
          </span>
        </a>
      </div>

      <button class="info_more-btn" data-sidebar-btn>
        <span>Show Contacts</span>

        <ion-icon name="chevron-down"></ion-icon>
      </button>
    </div>

    <div class="sidebar-info_more">
      <div class="separator"></div>

      <ul class="contacts-list">
        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="mail-outline"></ion-icon>
          </div>

          <div class="contact-info">
            <p class="contact-title">Email</p>

            <a href="mailto:aanujkhurana@gmail.com" class="contact-link"
              >aanujkhurana@gmail.com</a
            >
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="phone-portrait-outline"></ion-icon>
          </div>

          <div class="contact-info">
            <p class="contact-title">Phone</p>

            <a href="tel:+12133522795" class="contact-link">+61 (0) 4812-50988</a>
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="calendar-outline"></ion-icon>
          </div>
          <div class="contact-info">
            <p class="contact-title">Birthday</p>
            <time datetime="1982-06-23">March 14, 1997</time>
          </div>
        </li>

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="location-outline"></ion-icon>
          </div>

          <div class="contact-info">
            <p class="contact-title">Location</p>

            <address>GoldCoast, QLD, AU</address>
          </div>
        </li>
      </ul>

      <div class="separator"></div>

      <!-- <ul class="social-list">
        <li class="social-item">
          <a href="#" class="social-link">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
        </li>

        <li class="social-item">
          <a href="#" class="social-link">
            <ion-icon name="logo-twitter"></ion-icon>
          </a>
        </li>

        <li class="social-item">
          <a href="#" class="social-link">
            <ion-icon name="logo-instagram"></ion-icon>
          </a>
        </li>
      </ul> -->
    </div>
  </aside>
  <div class="main-content">
    <nav class="navbar">
      <ul class="navbar-list">
        <li class="navbar-item">
          <button class="navbar-link active" data-nav-link>About</button>
        </li>

        <li class="navbar-item">
          <button class="navbar-link" data-nav-link>Projects</button>
        </li>

        <li class="navbar-item">
          <button class="navbar-link" data-nav-link>Experience</button>
        </li>

        <!-- <li class="navbar-item">
          <button class="navbar-link" data-nav-link>Blog</button>
        </li> -->

        <li class="navbar-item">
          <button class="navbar-link" data-nav-link>Contact</button>
        </li>
      </ul>
    </nav>

    <article class="about active" data-page="about">
      <header>
        <h2 class="h2 article-title">About me</h2>
      </header>

      <section class="about-text">
        <p>
          Hi, I’m Anuj Khurana — a Full Stack Developer based in Queensland, Australia.
          With 2+ years of experience building modern web apps, I specialize in fast,
          responsive UIs and seamless fullstack integration.
        </p>

        <p>
          I’ve led frontend migrations, boosted performance, and crafted interfaces that
          feel as good as they look. I hold a Master’s in Software Development, love
          system design and clean architecture, and I’m always up for a new challenge —
          especially if it means learning something cool along the way.
        </p>
        <p>🚀 Let’s build something amazing.</p>
      </section>
      <!-- SERVICES -->
      <section class="service">
        <h3 class="h3 service-title">What i'm doing</h3>

        <ul class="service-list">
          <li class="service-item">
            <div class="service-icon-box">
              <img
                src="../assets/images/icon-design.svg
                "
                alt="design icon"
                width="40"
              />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">Database Architecture</h4>

              <p class="service-item-text">
                Designing agile and scalable databases, harmonizing relational and
                non-relational paradigms for optimal performance.
              </p>
            </div>
          </li>

          <li class="service-item">
            <div class="service-icon-box">
              <img
                src="../assets/images/icon-dev.svg"
                alt="Web development icon"
                width="40"
              />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">Full Stack Development</h4>

              <p class="service-item-text">
                Seamlessly blending front-end finesse & back-end brilliance to engineer
                captivating digital experiences.
              </p>
            </div>
          </li>

          <li class="service-item">
            <div class="service-icon-box">
              <img src="../assets/images/icon-app.svg" alt="mobile app icon" width="40" />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">UI-UX Design</h4>

              <p class="service-item-text">
                Enchanting users with interfaces that dazzle and guide, ensuring each
                interaction is a delightful journey.
              </p>
            </div>
          </li>

          <li class="service-item">
            <div class="service-icon-box">
              <img src="../assets/images/icon-photo.svg" alt="camera icon" width="40" />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">Collaborative Spirit</h4>

              <p class="service-item-text">
                Fostering a culture of open communication, mutual respect, and teamwork to
                drive innovation and excellence.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section class="testimonials">
        <Skills />
      </section>
    </article>

    <article class="resume" data-page="experience">
      <Experiences />
    </article>

    <article class="portfolio" data-page="projects">
      <header>
        <h2 class="h2 article-title">Project</h2>
      </header>
      <section class="projects">
        <Projects />
      </section>
    </article>

    <!-- <article class="blog" data-page="blog">
      <header>
        <h2 class="h2 article-title">Blog</h2>
      </header>

      <section class="blog-posts">
        <ul class="blog-posts-list">
          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-1.jpg"
                  alt="Design conferences in 2022"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">Design conferences in 2022</h3>

                <p class="blog-text">
                  Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.
                </p>
              </div>
            </a>
          </li>

          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-2.jpg"
                  alt="Best fonts every designer"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">Best fonts every designer</h3>

                <p class="blog-text">
                  Sed ut perspiciatis, nam libero tempore, cum soluta nobis est eligendi.
                </p>
              </div>
            </a>
          </li>

          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-3.jpg"
                  alt="Design digest #80"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">Design digest #80</h3>

                <p class="blog-text">
                  Excepteur sint occaecat cupidatat no proident, quis nostrum
                  exercitationem ullam corporis suscipit.
                </p>
              </div>
            </a>
          </li>

          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-4.jpg"
                  alt="UI interactions of the week"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">UI interactions of the week</h3>

                <p class="blog-text">
                  Enim ad minim veniam, consectetur adipiscing elit, quis nostrud
                  exercitation ullamco laboris nisi.
                </p>
              </div>
            </a>
          </li>

          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-5.jpg"
                  alt="The forgotten art of spacing"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">The forgotten art of spacing</h3>

                <p class="blog-text">
                  Maxime placeat, sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua.
                </p>
              </div>
            </a>
          </li>

          <li class="blog-post-item">
            <a href="#">
              <figure class="blog-banner-box">
                <img
                  src="../assets/images/blog-6.jpg"
                  alt="Design digest #79"
                  loading="lazy"
                />
              </figure>

              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">Design</p>

                  <span class="dot"></span>

                  <time datetime="2022-02-23">Fab 23, 2022</time>
                </div>

                <h3 class="h3 blog-item-title">Design digest #79</h3>

                <p class="blog-text">
                  Optio cumque nihil impedit uo minus quod maxime placeat, velit esse
                  cillum.
                </p>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </article> -->

    <article class="contact" data-page="contact">
      <Contact />
    </article>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import Projects from "./Projects.vue";
import Experiences from "./Experiences.vue";
import Skills from "./Skills.vue";
import Contact from "./Contact.vue";
import ThemeToggle from "./ThemeToggle.vue";

// Reactive refs for state management
const isLoading = ref(true);
const currentPage = ref("about");
const filterCategory = ref("all");
const formData = ref({
  fullname: "",
  email: "",
  message: "",
});

// DOM element refs
const sidebar = ref(null);
const modalContainer = ref(null);
const overlay = ref(null);
const form = ref(null);

// Event listener cleanup array
const eventListeners = [];

// Utility function to safely add event listeners with cleanup tracking
const addEventListenerSafe = (element, event, handler, options = false) => {
  if (element && typeof element.addEventListener === "function") {
    element.addEventListener(event, handler, options);
    eventListeners.push({ element, event, handler, options });
    return true;
  }
  return false;
};

// Utility function to safely query elements
const safeQuerySelector = (selector) => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
};

const safeQuerySelectorAll = (selector) => {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
};

// Element toggle function
const elementToggleFunc = (elem) => {
  if (elem && elem.classList) {
    elem.classList.toggle("active");
  }
};

// Modal functions
const testimonialsModalFunc = () => {
  const modalContainer = safeQuerySelector("[data-modal-container]");
  const overlay = safeQuerySelector("[data-overlay]");

  if (modalContainer) elementToggleFunc(modalContainer);
  if (overlay) elementToggleFunc(overlay);
};

// Filter function with error handling
const filterFunc = (selectedValue) => {
  const filterItems = safeQuerySelectorAll("[data-filter-item]");

  filterItems.forEach((item) => {
    if (!item || !item.classList) return;

    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  filterCategory.value = selectedValue;
};

// Form validation
const validateForm = () => {
  const formElement = safeQuerySelector("[data-form]");
  const formBtn = safeQuerySelector("[data-form-btn]");

  if (!formElement || !formBtn) return;

  const isValid = formElement.checkValidity();

  if (isValid) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
};

// Page navigation with error handling
const navigateToPage = (pageName) => {
  const pages = safeQuerySelectorAll("[data-page]");
  const navigationLinks = safeQuerySelectorAll("[data-nav-link]");

  pages.forEach((page) => {
    const pageDataName = page.dataset.page;
    page.classList.toggle("active", pageName === pageDataName);
  });

  navigationLinks.forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    const isActive = linkText === pageName.toLowerCase();

    link.classList.toggle("active", isActive);
    if (isActive) {
      currentPage.value = pageName;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
};

// Setup testimonials modal
const setupTestimonialsModal = () => {
  const testimonialsItems = safeQuerySelectorAll("[data-testimonials-item]");

  testimonialsItems.forEach((item) => {
    addEventListenerSafe(item, "click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      const modalImg = safeQuerySelector("[data-modal-img]");
      const modalTitle = safeQuerySelector("[data-modal-title]");
      const modalText = safeQuerySelector("[data-modal-text]");

      if (avatar && modalImg) {
        modalImg.src = avatar.src || "";
        modalImg.alt = avatar.alt || "";
      }

      if (title && modalTitle) {
        modalTitle.innerHTML = title.innerHTML || "";
      }

      if (text && modalText) {
        modalText.innerHTML = text.innerHTML || "";
      }

      testimonialsModalFunc();
    });
  });
};

// Setup filter buttons
const setupFilterButtons = () => {
  const filterBtns = safeQuerySelectorAll("[data-filter-btn]");
  let lastClickedBtn = filterBtns[0] || null;

  filterBtns.forEach((btn) => {
    addEventListenerSafe(btn, "click", function () {
      const selectedValue = this.innerText.toLowerCase().trim();
      const selectValue = safeQuerySelector("[data-selecct-value]");

      if (selectValue) {
        selectValue.innerText = this.innerText;
      }

      filterFunc(selectedValue);

      if (lastClickedBtn) {
        lastClickedBtn.classList.remove("active");
      }
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
};

// Setup form validation
const setupFormValidation = () => {
  const formInputs = safeQuerySelectorAll("[data-form-input]");

  formInputs.forEach((input) => {
    addEventListenerSafe(input, "input", validateForm);
    addEventListenerSafe(input, "blur", validateForm);
  });
};

// Setup select dropdown
const setupSelectDropdown = () => {
  const select = safeQuerySelector("[data-select]");
  const selectItems = safeQuerySelectorAll("[data-select-item]");
  const selectValue = safeQuerySelector("[data-selecct-value]");

  if (select) {
    addEventListenerSafe(select, "click", function () {
      elementToggleFunc(this);
    });
  }

  selectItems.forEach((item) => {
    addEventListenerSafe(item, "click", function () {
      const selectedValue = this.innerText.toLowerCase().trim();

      if (selectValue) {
        selectValue.innerText = this.innerText;
      }

      if (select) {
        elementToggleFunc(select);
      }

      filterFunc(selectedValue);
    });
  });
};

// Setup navigation
const setupNavigation = () => {
  const navigationLinks = safeQuerySelectorAll("[data-nav-link]");

  navigationLinks.forEach((link) => {
    addEventListenerSafe(link, "click", function () {
      const clickedPage = this.textContent.trim().toLowerCase();
      navigateToPage(clickedPage);
    });
  });
};

// Setup sidebar toggle
const setupSidebar = () => {
  const sidebarBtn = safeQuerySelector("[data-sidebar-btn]");
  const sidebarElement = safeQuerySelector("[data-sidebar]");

  if (sidebarBtn && sidebarElement) {
    addEventListenerSafe(sidebarBtn, "click", function () {
      elementToggleFunc(sidebarElement);
    });
  }
};

// Setup modal close functionality
const setupModalClose = () => {
  const modalCloseBtn = safeQuerySelector("[data-modal-close-btn]");
  const overlayElement = safeQuerySelector("[data-overlay]");

  if (modalCloseBtn) {
    addEventListenerSafe(modalCloseBtn, "click", testimonialsModalFunc);
  }

  if (overlayElement) {
    addEventListenerSafe(overlayElement, "click", testimonialsModalFunc);

    // Close modal on Escape key
    addEventListenerSafe(document, "keydown", function (e) {
      if (e.key === "Escape") {
        const modalContainer = safeQuerySelector("[data-modal-container]");
        if (modalContainer && modalContainer.classList.contains("active")) {
          testimonialsModalFunc();
        }
      }
    });
  }
};

// Form submission handler
const handleFormSubmit = (event) => {
  event.preventDefault();

  const formElement = event.target;
  if (!formElement.checkValidity()) {
    return;
  }

  // Get form data
  const formData = new FormData(formElement);
  const data = {
    fullname: formData.get("fullname"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  console.log("Form submitted:", data);

  // Here you would typically send the data to your backend
  // For now, we'll just show a success message
  alert("Message sent successfully!");

  // Reset form
  formElement.reset();
  validateForm();
};

// Setup form submission
const setupFormSubmission = () => {
  const formElement = safeQuerySelector("[data-form]");

  if (formElement) {
    addEventListenerSafe(formElement, "submit", handleFormSubmit);
  }
};

// Intersection Observer for animations (optional enhancement)
const setupIntersectionObserver = () => {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe elements that should animate in
    const animatableElements = safeQuerySelectorAll(
      ".service-item, .testimonials-item, .project-item, .blog-post-item"
    );
    animatableElements.forEach((el) => observer.observe(el));

    // Store observer for cleanup
    eventListeners.push({ type: "observer", observer });
  }
};

// Main initialization function
const initializePortfolio = async () => {
  try {
    // Wait for DOM to be fully ready
    await nextTick();

    // Setup all functionality
    setupSidebar();
    setupTestimonialsModal();
    setupModalClose();
    setupFilterButtons();
    setupSelectDropdown();
    setupFormValidation();
    setupFormSubmission();
    setupNavigation();
    setupIntersectionObserver();

    // Initial form validation
    validateForm();

    isLoading.value = false;
    console.log("Portfolio initialized successfully");
  } catch (error) {
    console.error("Error initializing portfolio:", error);
    isLoading.value = false;
  }
};

// Cleanup function
const cleanup = () => {
  eventListeners.forEach(({ element, event, handler, options, type, observer }) => {
    try {
      if (type === "observer" && observer) {
        observer.disconnect();
      } else if (element && typeof element.removeEventListener === "function") {
        element.removeEventListener(event, handler, options);
      }
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }
  });
  eventListeners.length = 0;
};

// Vue lifecycle hooks
onMounted(() => {
  initializePortfolio();
});

onBeforeUnmount(() => {
  cleanup();
});

// Error boundary for template errors
const handleImageError = (event) => {
  const img = event.target;
  img.style.display = "none";
  console.warn("Image failed to load:", img.src);
};

// Expose reactive data for template (optional)
defineExpose({
  currentPage,
  filterCategory,
  navigateToPage,
  filterFunc,
});
</script>
