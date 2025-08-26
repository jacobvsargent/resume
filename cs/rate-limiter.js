// Rate Limiter - Prevents abuse by limiting actions per time window
class RateLimiter {
    constructor() {
        this.limits = {
            gameCreation: { max: 3, window: 300000 }, // 3 games per 5 minutes
            gameJoining: { max: 10, window: 60000 },   // 10 join attempts per minute
            answerSubmission: { max: 1, window: 5000 } // 1 answer per 5 seconds
        };
    }
    
    checkLimit(action) {
        const limit = this.limits[action];
        if (!limit) return true;
        
        const now = Date.now();
        const key = `rate_limit_${action}`;
        let attempts;
        
        try {
            attempts = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            // If localStorage is corrupted, start fresh
            attempts = [];
        }
        
        // Remove old attempts outside the time window
        const recentAttempts = attempts.filter(time => 
            typeof time === 'number' && now - time < limit.window
        );
        
        if (recentAttempts.length >= limit.max) {
            const oldestAttempt = Math.min(...recentAttempts);
            const waitTime = Math.ceil((limit.window - (now - oldestAttempt)) / 1000);
            throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`);
        }
        
        // Record this attempt
        recentAttempts.push(now);
        
        try {
            localStorage.setItem(key, JSON.stringify(recentAttempts));
        } catch (e) {
            // If localStorage is full or unavailable, continue without storing
            console.warn('Unable to store rate limit data:', e);
        }
        
        return true;
    }
    
    // Method to clear rate limits (for development/testing)
    clearLimits() {
        const keys = Object.keys(this.limits).map(action => `rate_limit_${action}`);
        keys.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Unable to clear rate limit data:', e);
            }
        });
    }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();
