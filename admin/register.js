function validateForm(event) {
    event.preventDefault();  // Prevent form from submitting traditionally

    // Get form data
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Basic password match validation
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }
    console.log(formData);

    // Send the form data to the server using fetch
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
          // Convert form data to JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Registration successful!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error with the registration.');
    });

    return false;  // Prevent form from submitting the default way
}