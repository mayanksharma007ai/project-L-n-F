// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('suggestionForm');
    const submitBtn = document.querySelector('.submit-btn');
    const messageTextarea = document.getElementById('message');
    const maxLength = 1000;

    // --- Form Submission Handler ---
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            category: formData.get('category'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on'
        };

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // --- Actual API Call ---
        try {
            const response = await fetch('https://l-f-backend-i8np.onrender.com/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                form.reset();
                showMessage('✅ Thank you for your message! We\'ll get back to you soon.', 'success');
            } else {
                showMessage(result.error || '⚠️ Something went wrong.', 'error');
            }
        } catch (err) {
            showMessage('🚨 Server not reachable. Please try again later.', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });

    // --- Show Message Function ---
    function showMessage(text, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
            border-radius: 8px; color: white; font-weight: 500; z-index: 1000;
            max-width: 300px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateX(100%); transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            message.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        } else {
            message.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
        }

        document.body.appendChild(message);
        setTimeout(() => { message.style.transform = 'translateX(0)'; }, 100);

        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Form Field Animations ---
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // --- Character Counter for Textarea ---
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const remaining = maxLength - currentLength;
        
        const existingCounter = document.querySelector('.char-counter');
        if (existingCounter) { existingCounter.remove(); }
        
        if (currentLength > maxLength * 0.8) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.textContent = `${currentLength}/${maxLength} characters`;
            counter.style.cssText = `
                font-size: 0.8rem; color: ${remaining < 0 ? '#e53e3e' : '#4a5568'};
                text-align: right; margin-top: 0.25rem;
            `;
            this.parentElement.appendChild(counter);
        }
        
        if (currentLength > maxLength) {
            this.value = this.value.substring(0, maxLength);
        }
    });
});