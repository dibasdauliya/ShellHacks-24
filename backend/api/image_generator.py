import base64
import requests
import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting


def fetch_image_as_base64(image_url):
    response = requests.get(image_url)
    return base64.b64encode(response.content).decode('utf-8'), response.headers['Content-Type']  # Returning the image and MIME type

def generate(image_url):
    PROJECT_ID = "sample-mission-427316"
    vertexai.init(project=PROJECT_ID, location="us-central1")

    model = GenerativeModel("gemini-1.5-flash-002")

    response = model.generate_content(
        [
            Part.from_uri(
                image_url,
                mime_type="image/jpeg",
            ),
            "The following image is note taken by student. I want you to capture all the contents from it.",
        ]
    )
    return response.text





