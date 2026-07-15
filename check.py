import sys
from PIL import Image

try:
    img = Image.open('screenshot1.jpg')
    print(f"Dimensions: {img.width}x{img.height}")
except Exception as e:
    print(e)
