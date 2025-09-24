// This script wraps the global fetch function to automatically handle 401 Unauthorized responses.

// Store the original fetch function
const originalFetch = window.fetch;

// Create our new, wrapped fetch function
window.fetch = function (...args) {
    // Call the original fetch and get its promise
    return originalFetch.apply(this, args).then(response => {
        // Check if the response status is 401 Unauthorized
        if (response.status === 401) {
            // To prevent an infinite redirect loop, check if we are not already on the login page.
            if (window.location.pathname !== '/login') {
                console.warn('Unauthorized (401) response detected. Redirecting to login page.');
                window.location.href = '/login';
            }
        }
        // If the status is not 401, return the response as normal for other code to handle.
        return response;
    }).catch(error => {
        // Also handle network errors, though 401 is a response, not a network error.
        console.error('Fetch error:', error);
        // Re-throw the error so that individual .catch() blocks in other scripts can still handle it.
        throw error;
    });
};
