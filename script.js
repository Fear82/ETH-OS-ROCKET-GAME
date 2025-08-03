// ETH OS ROCKET Game by Fear82, Copyright 2025. All rights reserved.
const plane = document.getElementById('plane');
const multiplierDisplay = document.getElementById('multiplier');
const messageDisplay = document.getElementById('message');
const takeoffBtn = document.getElementById('takeoff-btn');
const cashoutBtn = document.getElementById('cashout-btn');
const candleLine = document.getElementById('candle-line');
const cashDisplay = document.getElementById('cash-display');
const betBtn = document.getElementById('bet-btn');
const particleEffects = document.getElementById('particle-effects');
const autoCashoutInput = document.getElementById('auto-cashout');
const themeSelect = document.getElementById('theme');
const takeoffSound = document.getElementById('takeoff-sound');
const cashoutSound = document.getElementById('cashout-sound');
const crashSound = document.getElementById('crash-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

let multiplier = 1;
let isFlying = false;
let gameInterval;
let crashMultiplier;
let cash = 10;
let betAmount = 1;

// Update cash display
function updateCash() {
  cashDisplay.textContent = `Cash: ${cash.toFixed(2)} ETH`;
}

// Create particle effect
function createParticles(count, color) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.left = `${50 + Math.random() * 500}px`;
    particle.style.top = `${Math.random() * 400}px`;
    particle.style.opacity = 1;
    particleEffects.appendChild(particle);

    const animation = particle.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${Math.random() * 100 - 50}px, -100px)`, opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    });

    animation.onfinish = () => particle.remove();
  }
}

// Bet button to cycle through amounts
betBtn.addEventListener('click', () => {
  if (!isFlying) {
    const betOptions = [1, 2, 5];
    const currentIndex = betOptions.indexOf(betAmount);
    if (currentIndex !== -1) {
      betAmount = betOptions[(currentIndex + 1) % betOptions.length];
      betBtn.textContent = `Bet: ${betAmount} ETH`;
    } else {
      betAmount = 1;
      betBtn.textContent = `Bet: ${betAmount} ETH`;
    }
  }
});

takeoffBtn.addEventListener('click', () => {
  if (!isFlying && cash >= betAmount) {
    isFlying = true;
    takeoffBtn.disabled = true;
    cashoutBtn.disabled = false;
    betBtn.disabled = true;
    messageDisplay.textContent = '';
    messageDisplay.classList.remove('win', 'lose');
    multiplier = 1;
    plane.style.bottom = '20px';
    candleLine.style.height = '0px';
    candleLine.style.backgroundColor = 'green';
    takeoffSound.play();
    updateCash();

    crashMultiplier = Math.random() * 98.9 + 1.1;
    cash -= betAmount;
    updateCash();

    gameInterval = setInterval(() => {
      multiplier *= 1.03;
      const altitude = 20 + (multiplier * 3);
      if (altitude < 380) {
        plane.style.bottom = `${altitude}px`;
        candleLine.style.height = `${altitude - 20}px`;
      }
      multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;

      const autoCashout = parseFloat(autoCashoutInput.value);
      if (autoCashout > 0 && multiplier >= autoCashout) {
        cashoutBtn.click();
      }

      if (multiplier >= crashMultiplier) {
        crash();
      }
    }, 20);
  } else if (cash < betAmount) {
    messageDisplay.textContent = 'Not enough ETH!';
    messageDisplay.classList.add('lose');
  }
});

cashoutBtn.addEventListener('click', () => {
  if (isFlying) {
    isFlying = false;
    clearInterval(gameInterval);
    takeoffBtn.disabled = false;
    cashoutBtn.disabled = true;
    betBtn.disabled = false;
    const winnings = betAmount * multiplier;
    cash += winnings;
    cashoutSound.play();
    createParticles(20, 'gold');
    updateCash();
    messageDisplay.textContent = `Cashed out at ${multiplier.toFixed(2)}x!`;
    checkWinLose();
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
  }
});

function crash() {
  if (isFlying) {
    isFlying = false;
    clearInterval(gameInterval);
    plane.style.bottom = '20px';
    candleLine.style.backgroundColor = 'red';
    crashSound.play();
    createParticles(30, 'red');
    messageDisplay.textContent = 'Crash! Game Over!';
    checkWinLose();
    takeoffBtn.disabled = false;
    cashoutBtn.disabled = true;
    betBtn.disabled = false;
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
  }
}

function checkWinLose() {
  if (cash >= 100) {
    messageDisplay.textContent = 'ETHOS DEGEN';
    messageDisplay.classList.add('win');
    messageDisplay.classList.remove('lose');
    winSound.play();
    isFlying = false;
    takeoffBtn.disabled = true;
    cashoutBtn.disabled = true;
    betBtn.disabled = true;
  } else if (cash <= 0) {
    messageDisplay.textContent = 'ETHOS OVER';
    messageDisplay.classList.add('lose');
    messageDisplay.classList.remove('win');
    loseSound.play();
    isFlying = false;
    takeoffBtn.disabled = true;
    cashoutBtn.disabled = true;
    betBtn.disabled = true;
  }
}

// Theme switch
themeSelect.addEventListener('change', () => {
  document.body.className = themeSelect.value;
});

// Initial update
multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
