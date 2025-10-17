// =======================================================
// 1. EXISTING GSAP ANIMATIONS (Keep your original code here)
// =======================================================
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

// =======================================================
// 2. EXISTING JQUERY PLACEHOLDER LOADS (Keep your original code here)
// =======================================================
$(function(){
    $("#nav-placeholder").load("./assets/placeholders/nav.html");
});

$(function(){
    $("#footer-placeholder").load("./assets/placeholders/footer.html");
});

// =======================================================
// 3. EXISTING COUNTER ANIMATION (Keep your original code here)
// =======================================================
const counts = document.querySelectorAll('.count');
const duration = 2000; // total animation duration in ms

function animateCounters() {
  counts.forEach((counter) => {
    const originalTarget = counter.getAttribute('data-target');
    const hasPlus = originalTarget.includes('+');
    const target = parseFloat(originalTarget.replace('+', ''));
    
    if (isNaN(target)) return;

    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));

    const updateCount = () => {
      const remainingDuration = duration - (Date.now() - startTime);
      
      if (remainingDuration <= 0) {
        counter.innerText = originalTarget;
        return;
      }

      start = target - (target * remainingDuration / duration);
      let displayValue = Math.ceil(start);
      
      if (displayValue > target) displayValue = target;

      counter.innerText = displayValue + (hasPlus ? '+' : '');

      requestAnimationFrame(updateCount);
    };

    const startTime = Date.now();
    requestAnimationFrame(updateCount);
  });
}

const counterSection = document.querySelector('.counter-wrapper');
if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); 

    observer.observe(counterSection);
}


// =======================================================
// 4. NEWS CAROUSEL LOGIC (Final smooth scrolling with guaranteed alignment)
// =======================================================
$(document).ready(function () {
  
  const $newsCarouselTrack = $("#newsCarouselTrack");
  const $prevButton = $(".carousel-control-prev-custom");
  const $nextButton = $(".carousel-control-next-custom");

  let autoScrollInterval;
  const scrollDelay = 3000; 
  const scrollDuration = 500; 

  if ($newsCarouselTrack.length) {
    fetch("get_latest_news.php")
      .then((response) => response.json())
      .then((newsItems) => {
        if (newsItems && newsItems.length > 0) {
          
          // 1. Render all cards
          newsItems.forEach((item) => {
            const cardHTML = `
              <div class="news-card-wrapper">
                <div class="card mx-auto">
                  <img src="${item.image_path || "assets/img/default-news.jpg"}" 
                       class="card-img-top" 
                       alt="${item.title || "News image"}">
                  <div class="card-body">
                    <h5 class="card-title">${item.title || "Untitled"}</h5>
                    <p class="card-text">${
                      item.content
                        ? item.content.substring(0, 100) + "..."
                        : ""
                    }</p>
                    <a href="view_news.php?id=${item.id}" class="btn btn-primary">Read More</a>
                  </div>
                </div>
              </div>
            `;
            $newsCarouselTrack.append(cardHTML);
          });

          const $cards = $newsCarouselTrack.find(".news-card-wrapper");
          let currentCardIndex = 0;
          const totalCards = $cards.length;
          const visibleCards = 3; 
          
          if (totalCards === 0) return;

          function updateCarouselControls() {
            $prevButton.prop('disabled', currentCardIndex === 0);
            $nextButton.prop('disabled', currentCardIndex >= totalCards - visibleCards); 

            if (totalCards <= visibleCards) {
                $prevButton.hide();
                $nextButton.hide();
            } else {
                $prevButton.show();
                $nextButton.show();
            }
          }

// Core smooth scroll function using jQuery animate (No changes needed here from last step)
function scrollToCard(index, duration = scrollDuration) {
  if (totalCards <= visibleCards) return;

  // Clamp the index
  if (index < 0) {
    index = 0;
  } else if (index > totalCards - visibleCards) { 
    index = totalCards - visibleCards;
  }

  currentCardIndex = index;

  const $firstCard = $cards.eq(0); 
  
  if ($firstCard.length) {
      const cardStepWidth = $firstCard.outerWidth(true); 
      let scrollPos = currentCardIndex * cardStepWidth;
      scrollPos = Math.round(scrollPos);

      $newsCarouselTrack.animate({
          scrollLeft: scrollPos
      }, duration);
  }
  updateCarouselControls();
}

// Function to handle the manual loop jump (New)
function handleLoopJump() {
    // Instant jump to the start (scrollLeft: 0)
    $newsCarouselTrack.animate({ scrollLeft: 0 }, 0, function() {
        currentCardIndex = 0;
        updateCarouselControls();
    });
}

// ** Auto-Scroll Functionality ** (No changes needed here)
function initAutoScroll() {
  if (totalCards <= visibleCards) return; 

  autoScrollInterval = setInterval(() => {
    if (currentCardIndex >= totalCards - visibleCards) {
      
      // Auto-scroll loop: Wait for smooth scroll to finish, then jump instantly
      setTimeout(() => {
        $newsCarouselTrack.animate({ scrollLeft: 0 }, 0, function() {
            currentCardIndex = 0;
            updateCarouselControls();
        });
      }, scrollDuration + 50); 
      
    } else {
      // Normal smooth scroll
      scrollToCard(currentCardIndex + 1);
    }
  }, scrollDelay);
}
          
function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    initAutoScroll();
}

// Add event listeners for the navigation buttons (Modified Next Button)
$prevButton.on("click", () => {
  scrollToCard(currentCardIndex - 1);
  resetAutoScroll();
});

$nextButton.on("click", () => {
  // Check if we are at the last card
  if (currentCardIndex >= totalCards - visibleCards) {
    // If yes, handle the jump back to the first post
    handleLoopJump();
  } else {
    // If no, scroll to the next card normally
    scrollToCard(currentCardIndex + 1);
  }
  resetAutoScroll();
});

// Pause auto-scroll on hover
$newsCarouselTrack.on('mouseenter', () => clearInterval(autoScrollInterval));
$newsCarouselTrack.on('mouseleave', initAutoScroll);

// Initial setup
updateCarouselControls();
initAutoScroll();

        } else {
          $newsCarouselTrack.html("<p class='text-center w-100'>No news found.</p>");
        }
      })
      .catch((error) => console.error("Error fetching news:", error));
  }
});