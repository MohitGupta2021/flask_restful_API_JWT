import requests
import json

# Base URL
BASE_URL = "http://127.0.0.1:5000"

# Headers
headers = {
    "Content-Type": "application/json"
}

# Users data to insert
users_data = [
   
    {"username": "alice_smith", "email": "alice@example.com", "password": "password123"},
    {"username": "bob_jones", "email": "bob@example.com", "password": "password123"},
    {"username": "charlie_brown", "email": "charlie@example.com", "password": "password123"}
]

# Create Users
for user_data in users_data:
    response = requests.post(f"{BASE_URL}/users", headers=headers, data=json.dumps(user_data))
    print("Create User Response:", response.json())

# Authenticate one of the users to get JWT token
auth_payload = {
    "username": "john_doe",
    "password": "password123"
}

response = requests.post(f"{BASE_URL}/auth", headers=headers, data=json.dumps(auth_payload))
auth_response = response.json()
print("Authentication Response:", auth_response)

# Extract the access token from the authentication response
access_token = auth_response['access_token']

# Headers with Authorization
headers_with_auth = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {access_token}"
}

# Perform operations on one of the users
user_id = 1  # Assuming the user ID is 1

# Get User Details
response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers_with_auth)
print("Get User Response:", response.json())

# Update User Details
update_user_payload = {
    "username": "john_doe_updated",
    "email": "john_updated@example.com",
    "password": "newpassword123"
}

response = requests.put(f"{BASE_URL}/users/{user_id}", headers=headers_with_auth, data=json.dumps(update_user_payload))
print("Update User Response:", response.json())

# Delete User
response = requests.delete(f"{BASE_URL}/users/{user_id}", headers=headers_with_auth)
print("Delete User Response:", response.status_code)
