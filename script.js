// Particle background + coin flip logic
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

const parts = [];
function rand(min,max){return Math.random()*(max-min)+min}
function makeParticles(){
  parts.length=0;
  for(let i=0;i<70;i++){
    parts.push({
      x:rand(0,W), y:rand(0,H), r:rand(0.6,2.4),
      vx:rand(-0.2,0.2), vy:rand(-0.05,0.2), h:rand(180,210)
    });
  }
}
makeParticles();

function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;makeParticles()}
addEventListener('resize', resize);

function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of parts){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y>H)p.y=0; if(p.y<0)p.y=H;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.h}, 90%, 70%, 0.06)`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Coin flip
const coin = document.getElementById('coin');
const rotorEl = coin ? (coin.querySelector('.rotor') || coin) : null;
const btn = document.getElementById('flipBtn');
const resultEl = document.getElementById('result');

let flipping=false;

function showResult(side){
  resultEl.textContent = side === 'heads' ? 'Heads' : 'Tails';
  resultEl.animate(
    [{transform:'translateY(-4px)',opacity:0.8},{transform:'translateY(0)',opacity:1}],
    {duration:420,easing:'cubic-bezier(.2,.9,.3,1)'}
  );
}

function flip(){
  if(flipping) return;
  flipping=true;
  resultEl.textContent = '...';

  const flips = Math.floor(rand(3,9));
  const heads = Math.random() > 0.5;

  // Reset any transform on the rotor element and force reflow
  if(!rotorEl){ flipping=false; return; }
  rotorEl.style.transform = 'none';
  void rotorEl.offsetWidth;

  // Rotate around Y to reveal correct face (front=H at 0deg, back=T at 180deg)
  const totalRot = 360 * (flips*2) + (heads ? 0 : 180);
  const anim = rotorEl.animate(
    [
      { transform: 'rotateY(0deg) translateZ(0)' },
      { transform: `rotateY(${totalRot}deg) translateZ(0)` }
    ],
    { duration: 1200 + flips*120, easing: 'cubic-bezier(.14,.9,.3,1)', fill: 'forwards' }
  );

  // temporary glow during flip
  coin.classList.add('flipping');

  anim.onfinish = () => {
    // Apply final orientation
    rotorEl.style.transform = heads ? 'rotateY(0deg)' : 'rotateY(180deg)';
    showResult(heads ? 'heads' : 'tails');
    flipping=false;
    coin.classList.remove('flipping');
  };
}

coin.addEventListener('click', flip);
btn.addEventListener('click', flip);
// keyboard
addEventListener('keydown', (e)=>{ if(e.code==='Space'){ e.preventDefault(); flip(); } });
// accessibility on coin
coin.addEventListener('keydown', (e)=>{ if(e.code==='Enter' || e.code==='Space'){ e.preventDefault(); flip(); } });