from fastapi import FastAPI, HTTPException
from mail_manager import send_mail
from pydantic import BaseModel

app = FastAPI()

class ConfirmationData(BaseModel):
  email: str
  name: str

@app.post('/send_mail_confirmation')
async def send_confirmation(data: ConfirmationData):
  try:
    send_mail(data.email, data.name)
    return {"ok": True}
  except Exception as e:
    print(repr(e))
    raise HTTPException(status_code=500, detail="Erro ao enviar email.")