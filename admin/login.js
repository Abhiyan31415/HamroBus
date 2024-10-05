
function showCustomAlert(message, link, linkText) {
    const alertMessage = document.getElementById('alertMessage');
    const alertLink = document.getElementById('alertLink');
    const customAlert = document.getElementById('customAlert');

    alertMessage.textContent = message; // Set the message text
    alertLink.href = "http://localhost:5000/client/c-index.html"; // Set the link URL
    alertLink.textContent = linkText; // Set the link text
    customAlert.style.display = 'block'; // Show the modal
}

function closeModal() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none'; // Hide the modal
}

function validateLoginForm(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    // Get login data from the form
    const loginData = {
        username: document.getElementById('username').value, // Or use 'email' based on your backend
        password: document.getElementById('password').value
    };

    // Basic validation to ensure fields aren't empty
    if (!loginData.username || !loginData.password) {
        alert("Please fill in both fields.");
        return;
    }
    console.log('Login data:', loginData);
    // Send the login data to the server
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),  // Convert the data into JSON format
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login failed. Please check your username and password.");
        }
        return response.json(); // If login is successful, the server should return a JSON response
    })
    .then(data => {
        console.log('Success:', data);
        showCustomAlert('Login success: ', 'Click here', 'to go to home page');
        console.log('Login success:', data.user.username);
        localStorage.setItem("username", data.user.username);
        window.location.href = "/client/c-index.html";
        //Optionally, redirect to a dashboard or another page after successful login
        // Change this URL based on your app
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message);
    });
}
