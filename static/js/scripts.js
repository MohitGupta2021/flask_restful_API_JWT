document.addEventListener('DOMContentLoaded', function() {
    const createUserForm = document.getElementById('createUser');
    const authenticateUserForm = document.getElementById('authenticateUser');
    const userActions = document.getElementById('userActions');
    const getUserButton = document.getElementById('getUser');
    const getUserButton2 = document.getElementById('getAllUser');
    const updateUserButton = document.getElementById('updateUser');
    const deleteUserButton = document.getElementById('deleteUser');
    const userIdInput = document.getElementById('userId');
    const userDetailsDiv = document.getElementById('userDetails');

    let authToken = '';

    createUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(createUserForm);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        fetch('http://127.0.0.1:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert('User created successfully!');
            createUserForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating user.');
        });
    });

    authenticateUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(authenticateUserForm);
        const data = {
            username: formData.get('authUsername'),
            password: formData.get('authPassword')
        };

        fetch('http://127.0.0.1:5000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                authToken = data.access_token;
                alert('Authenticated successfully!');
                userActions.style.display = 'block';
                authenticateUserForm.reset();
            } else {
                alert('Authentication failed.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error authenticating user.');
        });
    });
    document.getElementById('getUserButton2').addEventListener('click', function() {
        fetch('http://127.0.0.1:5000/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const userDetailsDiv = document.getElementById('userDetailsDiv');
            
            // Clear any existing content
            userDetailsDiv.innerHTML = '';
    
            // Create a table
            const table = document.createElement('table');
            table.border = '1';
    
            // Create table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
    
            // Define the headers
            const headers = ['ID', 'Username', 'Email'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.appendChild(document.createTextNode(headerText));
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
    
            // Create table body
            const tbody = document.createElement('tbody');
    
            // Populate table rows with data
            data.forEach(user => {
                const row = document.createElement('tr');
    
                Object.values(user).forEach(text => {
                    const cell = document.createElement('td');
                    cell.appendChild(document.createTextNode(text));
                    row.appendChild(cell);
                });
    
                tbody.appendChild(row);
            });
    
            table.appendChild(tbody);
            userDetailsDiv.appendChild(table);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error getting user details.');
        });
    });
    
    getUserButton.addEventListener('click', function() {
        const userId = userIdInput.value;

        fetch(`http://127.0.0.1:5000/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            userDetailsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error getting user details.');
        });
    });

    updateUserButton.addEventListener('click', function() {
        const userId = userIdInput.value;
        const data = {
            username: prompt('New username:'),
            email: prompt('New email:'),
            password: prompt('New password:')
        };

        fetch(`http://127.0.0.1:5000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert('User updated successfully!');
            userDetailsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating user.');
        });
    });

    deleteUserButton.addEventListener('click', function() {
        const userId = userIdInput.value;

        fetch(`http://127.0.0.1:5000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                alert('User deleted successfully!');
                userDetailsDiv.innerHTML = '';
            } else {
                alert('Error deleting user.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting user.');
        });
    });
});
