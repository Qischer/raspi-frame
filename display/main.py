from PIL import Image, ImageDraw

import spotify_display as sd

#Display dimension
EPD_WIDTH = 800
EPD_HEIGHT = 480

if __name__ == '__main__':
  
  print("Initializing Display")
  print("-------------------------------------------------------")

  img = Image.new('RGB', (EPD_WIDTH, EPD_HEIGHT), (255,255,255))
  draw = ImageDraw.Draw(img)

  sd.draw_player(img)

  img.show()