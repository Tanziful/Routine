document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = "";
    
    // Client-side validation
    const validation = validateCredentials(username, password);
    if (!validation.isValid) {
        errorElement.textContent = validation.errors.join("\n");
        return;
    }
    
    try {
        // In a real application, replace this with actual API call
        const response = await mockLoginAPI(username, password);
        
        if (response.success) {
            // Store authentication token
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('username', username);
            window.location.href = "Routine.html";
        } else {
            errorElement.textContent = response.message || "Invalid username or password!";
        }
    } catch (error) {
        errorElement.textContent = "Login service unavailable. Please try later.";
        console.error("Login error:", error);
    }
});

function validateCredentials(username, password) {
    const errors = [];
    
    if (!username || username.length < 4) {
        errors.push("Username must be at least 4 characters");
    }
    
    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Mock API function - replace with real backend API call in production
async function mockLoginAPI(username, password) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (username === "Tanzif" && password === "123456") {
                resolve({
                    success: true,
                    token: "mock-token-" + Math.random().toString(36).substring(2),
                    message: "Login successful"
                });
            } else {
                resolve({
                    success: false,
                    message: "Invalid username or password"
                });
            }
        }, 500); // Simulate network delay
    });
}