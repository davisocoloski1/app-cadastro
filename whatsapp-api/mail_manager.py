import smtplib
import ssl
import os
from email.message import EmailMessage
from dotenv import  load_dotenv

load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_mail(recipient: str, name: str):
  """ 
  :param destination: 'name@mail.com'
  :type destination: str
  :param name: sender's name
  :type name: str
  """

  msg = EmailMessage()
  msg["From"] = SMTP_USER
  msg["To"] = recipient
  msg["Subject"] = "Confirmação de cadastro"
  msg.set_content(f"Olá, {name}. Seu cadastro foi realizado com sucesso!")

  context = ssl.create_default_context()

  with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.set_debuglevel(1)
    server.login(SMTP_USER, SMTP_PASSWORD)
    server.send_message(msg)

if __name__ == "__main__":
  pass