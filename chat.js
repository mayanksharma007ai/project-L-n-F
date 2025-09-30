// Initialize auth system
const auth = new UserAuth();

// Notification functionality
function requestNotification() {
    // Check if browser supports notifications
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                showNotificationSuccess();
            } else {
                showEmailSignup();
            }
        });
    } else {
        showEmailSignup();
    }
}

function showNotificationSuccess() {
    const button = document.querySelector('.notify-btn');
    const originalText = button.textContent;
    
    button.textContent = '✓ Notifications Enabled!';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    
    // Create a mock notification
    setTimeout(() => {
        new Notification('Lost & Found Chat', {
            body: 'Thanks for signing up! We\'ll notify you when chat is ready.',
            icon: 'https://via.placeholder.com/64x64?text=LF',
        });
    }, 1000);
    
    // Reset button after 3 seconds
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }, 3000);
}

function showEmailSignup() {
    const button = document.querySelector('.notify-btn');
    const originalText = button.textContent;
    
    // Create email input popup
    const email = prompt('Enter your email to get notified when chat is ready:');
    
    if (email && validateEmail(email)) {
        button.textContent = '✓ We\'ll Email You!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        // Store email in localStorage (in real app, send to server)
        localStorage.setItem('chatNotificationEmail', email);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }, 3000);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add some interactive elements when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI
    if (auth.isLoggedIn()) {
        document.querySelector('.auth-buttons').style.display = 'none';
        document.querySelector('.user-profile').style.display = 'flex';
        auth.updateUI();
    }
    
    // Add click events to feature items for fun interactions
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showFeatureDetail(index);
        });
    });
    
    // Add some random particle movement
    animateParticles();
    
    // Simulate progress bar completion over time
    simulateProgress();
});

function showFeatureDetail(index) {
    const features = [
        {
            title: 'Real-time Messaging',
            description: 'Instant messaging with read receipts and typing indicators. Connect with finders and losers immediately!'
        },
        {
            title: 'Push Notifications',
            description: 'Get notified instantly when someone messages you about your lost or found items.'
        },
        {
            title: 'Mobile-friendly Chat',
            description: 'Responsive design that works perfectly on all devices. Chat on the go!'
        },
        {
            title: 'Secure Conversations',
            description: 'End-to-end encryption ensures your conversations remain private and secure.'
        }
    ];
    
    const feature = features[index];
    alert(`${feature.title}\n\n${feature.description}`);
}

function animateParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Add random colors
        const colors = ['rgba(102, 126, 234, 0.6)', 'rgba(255, 107, 107, 0.6)', 'rgba(118, 75, 162, 0.6)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        
        // Add random sizes
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
    });
}

function simulateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let currentProgress = 75;
    const targetProgress = 82;
    
    const interval = setInterval(() => {
        if (currentProgress < targetProgress) {
            currentProgress += 0.5;
            progressFill.style.width = currentProgress + '%';
            progressText.textContent = Math.floor(currentProgress) + '% Complete';
        } else {
            clearInterval(interval);
        }
    }, 100);
}

// Add some hover effects to gears
document.addEventListener('DOMContentLoaded', function() {
    const gears = document.querySelectorAll('.gear');
    
    gears.forEach(gear => {
        gear.addEventListener('mouseenter', () => {
            gear.style.animationDuration = '0.5s';
        });
        
        gear.addEventListener('mouseleave', () => {
            gear.style.animationDuration = gear.classList.contains('gear-1') ? '4s' : 
                                          gear.classList.contains('gear-2') ? '3s' : '5s';
        });
    });
});

// Add typing effect to chat messages
function startTypingAnimation() {
    const typingMessage = document.querySelector('.message.typing');
    if (typingMessage) {
        setTimeout(() => {
            typingMessage.innerHTML = `
                <p>How about we meet at the main entrance at 4 PM?</p>
                <span class="message-time">2:35 PM</span>
            `;
            typingMessage.classList.remove('typing');
        }, 3000);
    }
}

// Start typing animation after page loads
setTimeout(startTypingAnimation, 2000);

// Easter egg: Konami code for fun
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg: Make everything rainbow
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow keyframes if not already added
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});