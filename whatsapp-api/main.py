from fastapi import FastAPI, HTTPException
import mail_confirmation_handler as mail
from pydantic import BaseModel

app = FastAPI()

class SendMailData(BaseModel):
  email: str
  name: str

@app.post('/send_mail_confirmation')
async def send_confirmation(data: SendMailData):
  try:
    mail.send_mail(data.email, data.name)
    return {"ok": True}
  except Exception as e:
    print(repr(e))
    raise HTTPException(status_code=500, detail="Erro ao enviar email.")
  
@app.get('/receive_confirmation_code')
async def receive_code(email: str, code: str):
  is_valid = mail.receive_confirmation_code(email, code)
  return is_valid