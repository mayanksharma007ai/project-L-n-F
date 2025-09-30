const form = document.getElementById('SignupForm')

form.addEventListener('submit', async function(event) {
    event.preventDefault()

    const Name = document.getElementById('Name').value;
    const Email = document.getElementById('Email').value;
    const Password = document.getElementById('Password').value;

    try {
        // use the auth system
        const result = await signupUser(Name, Email, Password);
        
        if (result.success) {
            alert('Signup successful!');
            window.location.href = 'Home.html';
        } else {
            alert('Signup failed: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Could not connect to the server.');
    }
});
