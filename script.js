'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelectorAll('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContaier = document.querySelector('.dots');

// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Buttton Scrolling

btnScrollTo.addEventListener('click', function(e){
  section1.scrollIntoView({behavior: 'smooth'})
})

// Page Navigation ( Using Event Delegation)
// 1. Add event listener t common parent element
// 2. Determine what element originated the event (using event.target)

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  //console.log(e.target);
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})

// Tabbed component

tabsContainer.addEventListener('click', function(e) {
  //e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  if(!clicked) return;                                        // Guard Element

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

// Menu Fade Animation

const handleHover = function(e){
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if(el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));             // Pasing "arguments" into handler
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function() {
//   if(window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//     debugger
//   }
//   else 
//     nav.classList.remove('sticky');
// })

// Sticky Navigation (Intersection Observer API)

const navHeight =nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else  nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
})
headerObserver.observe(header);

// Reveal Sections

const revealSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
const loading = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-loading');
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0
});
imgTargets.forEach(img => imgObserver.observe(img));


// Slide Movement

const maxSlide = slides.length;

const createDots = function(){
  slides.forEach(function(_, i){
    dotContaier.insertAdjacentHTML(
      'beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide) {
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
}

// Next Slide

let currSlide = 0;

const nextSlide = function() {
  debugger
  if(currSlide === maxSlide - 1){
    currSlide = 0;
  } else {
    debugger
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

const prevSlide = function() {
  if(currSlide === 0){
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
}

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
})

dotContaier.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')){
    //const slide = e.target.dataset.slide;
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})





 


