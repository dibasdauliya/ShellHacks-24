import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

# Image URL
image_url = "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-988013222-scaled-e1618857975729.jpg"

# Create a completion request to describe the image
response = openai.ChatCompletion.create(
    model="gpt-4",  # specify the model version
    messages=[
        {"role": "user", "content": f"Imagine and describe the image found at this URL: {image_url}"}
    ]
)

# Extract and print the description
description = response['choices'][0]['message']['content']
print("Image Description:", description)
