<template>
  <aside class="sidebar" data-sidebar>
    <div class="sidebar-info">
      <figure class="avatar-box">
        <img src="../assets/images/my-avatar.png" alt="Anuj Khurana" width="100" />
      </figure>

      <div class="info-content">
        <h1 class="name" title="Anuj Khurana">Anuj Khurana</h1>

        <p class="title">Full Stack developer</p>

        <a
          href="https://www.github.com/aanujkhurana"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="link">
            <ion-icon class="git-icon" name="logo-github"></ion-icon>
            <p>github.com/aanujkhurana</p>
          </span></a
        >
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

        <!-- <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="calendar-outline"></ion-icon>
          </div>

          <div class="contact-info">
            <p class="contact-title">Birthday</p>

            <time datetime="1982-06-23">June 23, 1982</time>
          </div>
        </li> -->

        <li class="contact-item">
          <div class="icon-box">
            <ion-icon name="location-outline"></ion-icon>
          </div>

          <div class="contact-info">
            <p class="contact-title">Location</p>

            <address>Gold Coast, Qld, Au</address>
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
          I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web
          development and print media. I enjoy turning complex problems into simple,
          beautiful and intuitive designs.
        </p>

        <p>
          My job is to build your website so that it is functional and user-friendly but
          at the same time attractive. Moreover, I add personal touch to your product and
          make sure that is eye-catching and easy to use. My aim is to bring across your
          message and identity in the most creative way. I created web design for many
          famous brand companies.
        </p>
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
              <h4 class="h4 service-item-title">Web design</h4>

              <p class="service-item-text">
                The most modern and high-quality design made at a professional level.
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
              <h4 class="h4 service-item-title">Web development</h4>

              <p class="service-item-text">
                High-quality development of sites at the professional level.
              </p>
            </div>
          </li>

          <li class="service-item">
            <div class="service-icon-box">
              <img src="../assets/images/icon-app.svg" alt="mobile app icon" width="40" />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">Mobile apps</h4>

              <p class="service-item-text">
                Professional development of applications for iOS and Android.
              </p>
            </div>
          </li>

          <li class="service-item">
            <div class="service-icon-box">
              <img src="../assets/images/icon-photo.svg" alt="camera icon" width="40" />
            </div>

            <div class="service-content-box">
              <h4 class="h4 service-item-title">Photography</h4>

              <p class="service-item-text">
                I make high-quality photos of any category at a professional level.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/*
      <!--
          - testimonials
        -->
      */}

      <section class="testimonials">
        <h3 class="h3 testimonials-title">Testimonials</h3>

        <ul class="testimonials-list has-scrollbar">
          <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
              <figure class="testimonials-avatar-box">
                <img
                  src="../assets/images/avatar-1.png"
                  alt="Daniel lewis"
                  width="60"
                  data-testimonials-avatar
                />
              </figure>

              <h4 class="h4 testimonials-item-title" data-testimonials-title>
                Daniel lewis
              </h4>

              <div class="testimonials-text" data-testimonials-text>
                <p>
                  Richard was hired to create a corporate identity. We were very pleased
                  with the work done. She has a lot of experience and is very concerned
                  about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                  consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut
                  laborels dolore magnarels alia.
                </p>
              </div>
            </div>
          </li>

          <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
              <figure class="testimonials-avatar-box">
                <img
                  src="../assets/images/avatar-2.png"
                  alt="Jessica miller"
                  width="60"
                  data-testimonials-avatar
                />
              </figure>

              <h4 class="h4 testimonials-item-title" data-testimonials-title>
                Jessica miller
              </h4>

              <div class="testimonials-text" data-testimonials-text>
                <p>
                  Richard was hired to create a corporate identity. We were very pleased
                  with the work done. She has a lot of experience and is very concerned
                  about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                  consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut
                  laborels dolore magnarels alia.
                </p>
              </div>
            </div>
          </li>

          <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
              <figure class="testimonials-avatar-box">
                <img
                  src="../assets/images/avatar-3.png"
                  alt="Emily evans"
                  width="60"
                  data-testimonials-avatar
                />
              </figure>

              <h4 class="h4 testimonials-item-title" data-testimonials-title>
                Emily evans
              </h4>

              <div class="testimonials-text" data-testimonials-text>
                <p>
                  Richard was hired to create a corporate identity. We were very pleased
                  with the work done. She has a lot of experience and is very concerned
                  about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                  consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut
                  laborels dolore magnarels alia.
                </p>
              </div>
            </div>
          </li>

          <li class="testimonials-item">
            <div class="content-card" data-testimonials-item>
              <figure class="testimonials-avatar-box">
                <img
                  src="../assets/images/avatar-4.png"
                  alt="Henry william"
                  width="60"
                  data-testimonials-avatar
                />
              </figure>

              <h4 class="h4 testimonials-item-title" data-testimonials-title>
                Henry william
              </h4>

              <div class="testimonials-text" data-testimonials-text>
                <p>
                  Richard was hired to create a corporate identity. We were very pleased
                  with the work done. She has a lot of experience and is very concerned
                  about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                  consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut
                  laborels dolore magnarels alia.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <!-- TESTIMONIALS -->
      <div class="modal-container" data-modal-container>
        <div class="overlay" data-overlay></div>

        <section class="testimonials-modal">
          <button class="modal-close-btn" data-modal-close-btn>
            <ion-icon name="close-outline"></ion-icon>
          </button>

          <div class="modal-img-wrapper">
            <figure class="modal-avatar-box">
              <img
                src="../assets/images/avatar-1.png"
                alt="Daniel lewis"
                width="80"
                data-modal-img
              />
            </figure>

            <img src="../assets/images/icon-quote.svg" alt="quote icon" />
          </div>

          <div class="modal-content">
            <h4 class="h3 modal-title" data-modal-title>Daniel lewis</h4>

            <time datetime="2021-06-14">14 June, 2021</time>

            <div data-modal-text>
              <p>
                Richard was hired to create a corporate identity. We were very pleased
                with the work done. She has a lot of experience and is very concerned
                about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut
                laborels dolore magnarels alia.
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- CLIENTS -->

      <section class="clients">
        <h3 class="h3 clients-title">Clients</h3>

        <ul class="clients-list has-scrollbar">
          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-1-color.png" alt="client logo" />
            </a>
          </li>

          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-2-color.png" alt="client logo" />
            </a>
          </li>

          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-3-color.png" alt="client logo" />
            </a>
          </li>

          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-4-color.png" alt="client logo" />
            </a>
          </li>

          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-5-color.png" alt="client logo" />
            </a>
          </li>

          <li class="clients-item">
            <a href="#">
              <img src="../assets/images/logo-6-color.png" alt="client logo" />
            </a>
          </li>
        </ul>
      </section>
    </article>

    <article class="resume" data-page="experience">
      <header>
        <h2 class="h2 article-title">Resume</h2>
      </header>

      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box">
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3 class="h3">Experience</h3>
        </div>
        <Experiences />
      </section>

      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box">
            <ion-icon name="book-outline"></ion-icon>
          </div>

          <h3 class="h3">Education</h3>
        </div>

        <ol class="timeline-list">
          <li class="timeline-item">
            <h4 class="h4 timeline-item-title">University school of the arts</h4>

            <span>2007 — 2008</span>

            <p class="timeline-text">
              Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque
              corrupti, quos dolores et quas molestias exceptur.
            </p>
          </li>
        </ol>
      </section>

      <section class="timeline">
        <div class="title-wrapper">
          <div class="icon-box">
            <ion-icon name="book-outline"></ion-icon>
          </div>

          <h3 class="h3">Certificates</h3>
        </div>

        <ol class="timeline-list">
          <li class="timeline-item">
            <span>Python</span>
            <p class="timeline-text">FreeCodeCamp</p>
          </li>
          <li class="timeline-item">
            <span>Python</span>
            <p class="timeline-text">FreeCodeCamp</p>
          </li>
          <li class="timeline-item">
            <span>Python</span>
            <p class="timeline-text">FreeCodeCamp</p>
          </li>
        </ol>
      </section>

      <!-- <section class="skill">
        <h3 class="h3 skills-title">My skills</h3>

        <ul class="skills-list content-card">
          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">Web design</h5>
              <data value="80">80%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 80%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">Graphic design</h5>
              <data value="70">70%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 70%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">Branding</h5>
              <data value="90">90%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 90%"></div>
            </div>
          </li>

          <li class="skills-item">
            <div class="title-wrapper">
              <h5 class="h5">WordPress</h5>
              <data value="50">50%</data>
            </div>

            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: 50%"></div>
            </div>
          </li>
        </ul>
      </section> -->
    </article>

    <article class="portfolio" data-page="projects">
      <header>
        <h2 class="h2 article-title">Portfolio</h2>
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
      <header>
        <h2 class="h2 article-title">Contact</h2>
      </header>

      <section class="contact-form">
        <form action="#" class="form" data-form>
          <div class="input-wrapper">
            <input
              type="text"
              name="fullname"
              class="form-input"
              placeholder="Full name"
              required
              data-form-input
            />

            <input
              type="email"
              name="email"
              class="form-input"
              placeholder="Email address"
              required
              data-form-input
            />
          </div>

          <textarea
            name="message"
            class="form-input"
            placeholder="Your Message"
            required
            data-form-input
          ></textarea>

          <button class="form-btn" type="submit" disabled data-form-btn>
            <ion-icon name="paper-plane"></ion-icon>
            <span>Send Message</span>
          </button>
        </form>
      </section>

      <header>
        <h2 class="h2 article-title">Location</h2>
      </header>
      <section class="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed/v1/place?q=parkwood&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="400"
            height="300"
            loading="lazy"
          ></iframe>
        </figure>
      </section>
    </article>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import Projects from "./Projects.vue";
import Experiences from "./Experiences.vue";

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

  pages.forEach((page, index) => {
    if (!page || !page.dataset) return;

    const pageDataName = page.dataset.page;
    const navLink = navigationLinks[index];

    if (pageName === pageDataName) {
      page.classList.add("active");
      if (navLink) navLink.classList.add("active");
      currentPage.value = pageName;
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      page.classList.remove("active");
      if (navLink) navLink.classList.remove("active");
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
