gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1,
    delay: 3,
    onStart: function() {
      // Start navbar animation as soon as preloader starts fading out
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.style.visibility = 'visible';
        navbar.style.animation = 'nav-load 500ms ease-out forwards';
      }
    }
  }
);
gsap.fromTo(
  ".logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.5,
  }
);

$(function(){
    $("#nav-placeholder").load("./assets/placeholders/nav.html");
  });

$(function(){
    $("#footer-placeholder").load("./assets/placeholders/footer.html");
  });

// counter animation
const counts = document.querySelectorAll('.count');
const duration = 2000; // total animation duration in ms

function animateCounters() {
  counts.forEach((counter) => {
    const originalTarget = counter.getAttribute('data-target');
    const hasPlus = originalTarget.includes('+');
    const target = Number(originalTarget.replace(/[^\d]/g, '')); // Keep digits only

    const frameRate = 30; // ms between updates
    const steps = Math.ceil(duration / frameRate);
    const inc = Math.max(1, Math.ceil(target / steps));

    function upDate() {
      const count = Number(counter.innerText);

      if (count < target) {
        counter.innerText = count + inc > target ? target : count + inc;
        setTimeout(upDate, frameRate);
      } else {
        counter.innerText = hasPlus ? target + '+' : target;
      }
    }
    upDate();
  });
}

// Intersection Observer to trigger animation when visible
const counterWrapper = document.querySelector('.counter-wrapper');
let countersStarted = false;

if (counterWrapper) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
        observer.unobserve(counterWrapper); // Stop observing after animation starts
      }
    });
  }, { threshold: 0.3 }); // Adjust threshold as needed

  observer.observe(counterWrapper);
}

// end counter animation