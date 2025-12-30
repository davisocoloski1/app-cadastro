from fastapi import FastAPI, HTTPException
import mail_confirmation_handler as mail
from pydantic import BaseModel


app = FastAPI()


class SendMailData(BaseModel):
  email: str
  name: str

class RecuperationData(BaseModel):
  email: str
  token: str

@app.post('/send_mail_confirmation')
async def send_confirmation(data: SendMailData, resend: int = 0):
  try:
    mail.send_mail(data.email, data.name, resend)
    return {"ok": True}
  except Exception as e:
    print("------- ERROR -------")
    print(e)
    # raise HTTPException(status_code=500, detail="Erro ao enviar email.")
  
@app.post('/send_recuperation_link')
async def send_recuperation_link(payload: RecuperationData):
  try: 
    mail.send_password_change_mail(payload.email, payload.token)
    print("OK\n\n")
    return {"ok": True}
  except Exception as e:
    print("------- ERROR -------")
    print(f'\033[31m{e}\033[m')
    raise HTTPException(status_code=500, detail='Erro ao enviar email.')
  
@app.post('/send_change_mail_link')
async def send_change_link(payload: RecuperationData):
  try:
    mail.send_change_mail_link(payload.email, payload.token)
    print("OK\n\n")
    return {"ok": True}
  except Exception as e:
    print("------- ERROR -------")
    print(f'\033[31m{e}\033[m')
    raise HTTPException(status_code=500, detail='Erro ao enviar email.')
  
@app.get('/receive_confirmation_code')
async def receive_code(email: str, code: str):
  is_valid = mail.receive_confirmation_code(email, code)
  return is_valid