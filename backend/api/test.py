# import vertexai

# from vertexai.generative_models import GenerativeModel, Part

# # TODO(developer): Update & uncomment line below
# # PROJECT_ID = "your-project-id"
# PROJECT_ID = "sample-mission-427316"
# vertexai.init(project=PROJECT_ID, location="us-central1")

# model = GenerativeModel("gemini-1.5-flash-002")

# response = model.generate_content(
#     [
#         Part.from_uri(
#             "gs://cloud-samples-data/generative-ai/image/scones.jpg",
#             mime_type="image/jpeg",
#         ),
#         "What is shown in this image?",
#     ]
# )

# print(response.text)

import requests
import json

url = "http://127.0.0.1:8000/api/finance_ai/"

payload = json.dumps({
  "user_msg": "Hello"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
