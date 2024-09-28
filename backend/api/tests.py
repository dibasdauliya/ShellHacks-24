
def test1():

    import requests

    # URL for the GET request
    url = "http://127.0.0.1:8000/api/children/1"

    # Headers including the authorization token
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4MzAyMzUzLCJpYXQiOjE3MjY3NjYzNTMsImp0aSI6ImQwNTIzMDA4NGVjMDQ2YjliNDQ3MjRjNmIyYWM5MmU2IiwidXNlcl9pZCI6MX0.nMb2nxu5zI5mHU6xzni1aHWsZh13nsp6xl_jGMd25x4"
    }

    # Sending the GET request
    response = requests.get(url, headers=headers)

    # Checking the response
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Error:", response.status_code, response.text)

def test2():
    import requests

    # Replace with your actual API URL
    url = "http://localhost:8000/api/children-login/"
    # Replace with your actual credentials
    credentials = {
        "username": "password",
        "password": "password"
    }

    # Send POST request to the login endpoint
    response = requests.post(url, json=credentials)

    # Check the response
    print("Request payload:", credentials)  # Log the request payload
    if response.status_code == 200:
        print("Login successful!")
        print("Access token:", response.json().get('access'))
        print("Refresh token:", response.json().get('refresh'))
    else:
        print("Login failed!")
        print("Status code:", response.status_code)
        try:
            print("Response:", response.json())  # Log the response
        except ValueError:
            print("Response text:", response.text)  # If response isn't JSON

#test2()

def test3():
    import requests

    # URL for the GET request
    url = "http://127.0.0.1:8000/api/messages/1"

    # Headers including the authorization token
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MTAyNTI2LCJpYXQiOjE3MjcwMTYxMjYsImp0aSI6ImUwZWRkZWM1NzVmYzQxMWQ5YmU5MzYxYTgxNzAzZTE0IiwidXNlcl9pZCI6Mn0.oMllEVh5IjQt3DktLHfZt2zPBpTkFE4P_2MLwRpSB_M"
    }

    # Sending the GET request
    response = requests.get(url, headers=headers)

    # Checking the response
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Error:", response.status_code, response.text)

test3()

