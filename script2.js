const form = document.getElementById('LoginForm')

form.addEventListener('submit', async function(event) {
    event.preventDefault()

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // use the auth system
        const result = await loginUser(email, password);
        
        if (result.success) {
            alert('Login successful!');
            window.location.href = 'Home.html';
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Could not connect to the server.');
    }
});
