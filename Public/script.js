document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // First name validation
    const firstName = document.getElementById('firstName').value.trim();
    if (firstName.length < 1 || /\d/.test(firstName)) {
        document.getElementById('firstNameError').textContent = 'First name is required and cannot contain numbers.';
        isValid = false;
    }

    // Last name validation
    const lastName = document.getElementById('lastName').value.trim();
    if (lastName.length < 1 || /\d/.test(lastName)) {
        document.getElementById('lastNameError').textContent = 'Last name is required and cannot contain numbers.';
        isValid = false;
    }

    // Other names validation
    const otherNames = document.getElementById('otherNames').value.trim();
    if (/\d/.test(otherNames)) {
        document.getElementById('otherNamesError').textContent = 'Other names cannot contain numbers.';
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Phone number validation
    const phone = document.getElementById('phone').value.trim();
    const phoneLength = 10; // Assuming a fixed length for phone number
    if (phone.length !== phoneLength || !/^\d+$/.test(phone)) {
        document.getElementById('phoneError').textContent = `Phone number must be ${phoneLength} digits long.`;
        isValid = false;
    }

    // Gender validation
    const gender = document.getElementById('gender').value;
    if (!gender) {
        document.getElementById('genderError').textContent = 'Gender is required.';
        isValid = false;
    }

    if (isValid) {
        // Collect form data
        const formData = {
            firstName,
            lastName,
            otherNames,
            email,
            phone,
            gender
        };

        // Send data to the server
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Form submitted successfully!');
            } else {
                alert('Error submitting form');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form');
        });
    }
});
