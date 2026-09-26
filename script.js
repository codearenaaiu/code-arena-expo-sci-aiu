// Target event launch timestamp: October 22, 2026, 09:00:00 AM (MYT)                             
const EVENT_DATE = new Date('2026-10-22T09:00:00+08:00').getTime();                               
                                                                                                  
function updateCountdown() {                                                                      
    const now = new Date().getTime();                                                             
    const distance = EVENT_DATE - now;                                                            
                                                                                                  
    if (distance < 0) {                                                                           
        document.getElementById('days').innerText = '00';                                         
        document.getElementById('hours').innerText = '00';                                        
        document.getElementById('minutes').innerText = '00';                                      
        document.getElementById('seconds').innerText = '00';                                      
        return;                                                                                   
    }                                                                                             
                                                                                                  
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));                                    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));              
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));                      
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);                                  
                                                                                                  
    document.getElementById('days').innerText = String(days).padStart(2, '0');                    
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');                  
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');              
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');              
}                                                                                                 
                                                                                                  
// Hacker Cypher / Telegram-style reveal effect for prize numbers                                 
const CYPHER_CHARS = '0123456789!@#$%^&*<>/?';                                                    
                                                                                                  
function scrambleText(element, finalText, duration = 1200) {                                      
    let startTime = null;                                                                         
                                                                                                  
    function animate(timestamp) {                                                                 
        if (!startTime) startTime = timestamp;                                                    
        const progress = (timestamp - startTime) / duration;                                      
                                                                                                  
        if (progress < 1) {                                                                       
            let result = '';                                                                      
            for (let i = 0; i < finalText.length; i++) {                                          
                if (finalText[i] === ' ') {                                                       
                    result += ' ';                                                                
                } else if (Math.random() < progress) {                                            
                    result += finalText[i];                                                       
                } else {                                                                          
                    result += CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)];      
                }                                                                                 
            }                                                                                     
            element.innerText = result;                                                           
            requestAnimationFrame(animate);                                                       
        } else {                                                                                  
            element.innerText = finalText;                                                        
        }                                                                                         
    }                                                                                             
                                                                                                  
    requestAnimationFrame(animate);                                                               
}                                                                                                 
                                                                                                  
function initCypherEffects() {                                                                    
    const cypherElements = document.querySelectorAll('.cypher-text');                             
                                                                                                  
    cypherElements.forEach(el => {                                                                
        // Continuous light jitter until hovered or clicked                                       
        let isScrambling = false;                                                                 
                                                                                                  
        const target = el.getAttribute('data-target');                                            
                                                                                                  
        el.addEventListener('mouseenter', () => {                                                 
            if (!isScrambling) {                                                                  
                isScrambling = true;                                                              
                scrambleText(el, target, 800);                                                    
                setTimeout(() => { isScrambling = false; }, 900);                                 
            }                                                                                     
        });                                                                                       
                                                                                                  
        // Click unlocks / scrambles                                                              
        el.addEventListener('click', () => {                                                      
            scrambleText(el, target, 1200);                                                       
        });                                                                                       
    });                                                                                           
}                                                                                                 
                                                                                                  
// Auto-run continuous ambient scramble loop on locked prize pool                                 
function ambientScrambleLoop() {                                                                  
    const cypherElements = document.querySelectorAll('.cypher-text');                             
    setInterval(() => {                                                                           
        cypherElements.forEach(el => {                                                            
            if (el.innerText.includes('*') || el.innerText.includes('#')) {                       
                let scrambled = 'RM ';                                                            
                for (let i = 0; i < 4; i++) {                                                     
                    scrambled += CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)];   
                }                                                                                 
                el.innerText = scrambled;                                                         
            }                                                                                     
        });                                                                                       
    }, 180);                                                                                      
}                                                                                                 
                                                                                                  
// Initializations                                                                                
document.addEventListener('DOMContentLoaded', () => {                                             
    updateCountdown();                                                                            
    setInterval(updateCountdown, 1000);                                                           
    initCypherEffects();                                                                          
    ambientScrambleLoop();                                                                        
});                                                                                               








































































































