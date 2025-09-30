// user login system
class UserAuth {
    constructor() {
        this.currentUser = this.getStoredUser();
        this.updateUI();
    }

    // get user from localStorage
    getStoredUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // save user to localStorage
    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateUI();
    }

    // remove user from localStorage
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
        window.location.href = 'Home.html';
    }

    // check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // update the header based on login status
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (this.isLoggedIn()) {
            // hide login/signup buttons
            if (authButtons) authButtons.style.display = 'none';
            
            // show user profile
            if (userProfile) {
                userProfile.style.display = 'flex';
                this.updateUserProfile();
            }
        } else {
            // show login/signup buttons
            if (authButtons) authButtons.style.display = 'flex';
            
            // hide user profile
            if (userProfile) {
                userProfile.style.display = 'none';
            }
        }
    }

    // update user profile display
    updateUserProfile() {
        const userName = document.querySelector('.user-name');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (userName) {
            userName.textContent = this.currentUser.Name || 'User';
        }
        
        if (userAvatar) {
            userAvatar.src = this.currentUser.avatar || 'https://via.placeholder.com/40x40?text=U';
        }
    }

    // update user avatar
    updateAvatar(avatarUrl) {
        if (this.currentUser) {
            this.currentUser.avatar = avatarUrl;
            this.saveUser(this.currentUser);
            this.updateUserProfile();
        }
    }
}

// create global auth instance
const auth = new UserAuth();

// login function
async function loginUser(email, password) {
    try {
        const response = await fetch('https://l-f-backend-i8np.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // get user details
            const userResponse = await fetch('https://l-f-backend-i8np.onrender.com/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                auth.saveUser(userData);
                return { success: true };
            } else {
                
                const basicUser = {
                    Name: email.split('@')[0], 
                    Email: email,
                    avatar: 'https://via.placeholder.com/40x40?text=U'
                };
                auth.saveUser(basicUser);
                return { success: true };
            }
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Connection failed' };
    }
}

// signup function
async function signupUser(name, email, password) {
    try {
        const response = await fetch('https://l-f-backend-i8np.onrender.com/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: name, Email: email, Password: password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // auto login after signup
            const loginResult = await loginUser(email, password);
            return loginResult;
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: 'Connection failed' };
    }
}
