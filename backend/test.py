import requests
import uuid
from PIL import Image
from io import BytesIO

# Make the request
response = requests.post(
    "http://43.143.205.76:8000/clockin/report/",
    json={"user_id": "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q", "report_type": "weekly"}
)

# Extract the boundary from the response headers
content_type = response.headers.get('content-type')
boundary = content_type.split('boundary=')[1].strip('"')

# Split the response using the extracted boundary
parts = response.content.split(f'--{boundary}'.encode())

# Assuming the image is in the second part (index 1)
# Adjust the index based on your response structure
for part in parts:
    if b'image/png' in part:
        # Extract and save the image
        image_binary = part.split(b'\r\n\r\n')[1].rsplit(b'\r\n', 1)[0]
        image = Image.open(BytesIO(image_binary))
        image.save('report.png')
        break
