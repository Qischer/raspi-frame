import requests

from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

url = 'http://localhost:3000'

def init_player(height , width):

  #init panel
  panel = Image.new('RGB', (int(width), int(height)), (255, 255, 255))
  draw = ImageDraw.Draw(panel)

  #font
  # fnt1 = ImageFont.load("/public/fonts/Futura.ttc")
  # fnt2 = ImageFont.load("/public/fonts/Andale Mono.ttf")

  #boxes
  img_box = (50,50,350,350)

  try:
    #fetch spotify data
    response = requests.get(url + '/player/state')
    data = response.json()

    image_url = data['item']['album']['images'][-2]['url']
    track_name = data['item']['name']
    artists_name = ", ".join([info['name'] for info in data['item']['artists']])

    #process album cover
    response = requests.get(image_url)
    response.raise_for_status()
    img = Image.open(BytesIO(response.content))

    #draw panel
    panel.paste(img, img_box)

    draw.multiline_text((50,355), track_name  ,  fill=(0, 0, 0, 128))
    draw.multiline_text((50,374), artists_name ,  fill=(0, 0, 0, 128))

  except Exception as e:
    print("An error occurred:", e)
    draw.text((50, 370), "An error occurred:" + str(e) , fill=(0, 0, 0, 128))
  
  return panel

def draw_player(canvas: Image):

  h, w = canvas.height, canvas.width
  panel = init_player(h, w/2)

  canvas.paste(panel)