// GeoGuesser Hacker Website - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (question && answer && icon) {
            question.addEventListener('click', () => {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherAnswer && otherIcon) {
                            otherAnswer.classList.remove('active');
                            otherIcon.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current item
                answer.classList.toggle('active');
                icon.classList.toggle('active');
            });
        }
    });
    
    // Chrome Extension Install Button
    const installButtons = document.querySelectorAll('.install-extension-btn');
    
    installButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if Chrome extension is supported
            if (typeof chrome !== 'undefined' && chrome.webstore) {
                // Replace with your actual Chrome Web Store ID
                const extensionId = 'ogjhgcaaaclhdaalliolbhibppalepkj';
                
                try {
                    chrome.webstore.install(
                        `https://chrome.google.com/webstore/detail/${extensionId}`,
                        function() {
                            showNotification('Extension installed successfully!', 'success');
                        },
                        function(error) {
                            console.error('Installation failed:', error);
                            // Fallback to opening Chrome Web Store
                            window.open('https://chrome.google.com/webstore/detail/geoguesser-hacker/your-extension-id', '_blank');
                        }
                    );
                } catch (error) {
                    // Fallback for when not on Chrome Web Store
                    window.open('https://chrome.google.com/webstore/detail/geoguesser-hacker/your-extension-id', '_blank');
                }
            } else {
                // Not on Chrome or extension API not available
                window.open('https://chrome.google.com/webstore/detail/geoguesser-hacker/your-extension-id', '_blank');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Pricing plan selection
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('.btn');
        if (button) {
            button.addEventListener('click', function(e) {
                const plan = this.getAttribute('data-plan');
                
                if (plan === 'free') {
                    // Redirect to extension install
                    window.open('https://chrome.google.com/webstore/detail/geoguesser-hacker/your-extension-id', '_blank');
                } else if (plan === 'pro') {
                    // This would typically integrate with your payment system
                    showNotification('Install the extension first to upgrade to Pro!', 'info');
                    setTimeout(() => {
                        window.open('https://chrome.google.com/webstore/detail/geoguesser-hacker/your-extension-id', '_blank');
                    }, 2000);
                }
            });
        }
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                border-left: 4px solid var(--primary-green);
                animation: slideIn 0.3s ease;
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-info {
                border-left-color: #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                gap: 16px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6b7280;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Analytics tracking (replace with your analytics service)
function trackEvent(eventName, properties = {}) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Custom analytics
    console.log('Event tracked:', eventName, properties);
}
