import smtplib
import ssl
import os
from email.message import EmailMessage
from dotenv import  load_dotenv
from random import randint

load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

confirmation_codes = {}

def _generate_confirmation_code(length: int = 6):
  return ''.join(str(randint(0, 9)) for _ in range(length))

def send_mail(recipient: str, name: str, resend: int = 0):
  """ 
  :param destination: 'name@mail.com'
  :type destination: str
  :param name: sender's name
  :type name: str
  :param resend: 0 for new account, 1 for resend confirmation code
  :type resend: int
  """

  msg = EmailMessage()
  msg["From"] = SMTP_USER
  msg["To"] = recipient
  msg["Subject"] = "Confirmação de cadastro"

  if resend == 0:
    confirmation_code = _generate_confirmation_code()
    confirmation_codes[recipient] = confirmation_code

    msg.set_content(f"""Olá, {name}!

    Aqui está seu código de confirmação: {confirmation_code}

    Insira-o no campo de confirmação do site.

    Se você não solicitou este cadastro, ignore este e-mail.
    """)

  elif resend == 1:
    confirmation_code = _generate_confirmation_code()
    confirmation_codes[recipient] = confirmation_code

    msg.set_content(f"Olá, {name}! Aqui está seu novo código de confirmação: {confirmation_code}.")

  context = ssl.create_default_context()

  with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
    server.set_debuglevel(1)
    server.login(SMTP_USER, SMTP_PASSWORD)
    server.send_message(msg)

  return confirmation_code

def receive_confirmation_code(email: str, code: str):
  """
  :param code: 6 number code (Ex: 000000)
  :type code: int
  """

  expected_code = confirmation_codes.get(email)

  if expected_code is None:
    return False
  
  return code == expected_code

if __name__ == "__main__":
  try:
    send_mail("davisocoloski1@gmail.com", "A")
  except Exception as e:
    print(repr(e))