An application for managing accounts with code confirmation sent via email, account/password recovery via a link also sent by email, and CRUD options to create an account, view and edit information, and finally, delete the account.

How to run: select a directory on your computer, open cmd and type the command below.
```
git clone https://github.com/davisocoloski1/app-cadastro.git
```

After that, you will need 3 terminals (cmd pages). One to run the frontend (Angular), another to run the website's backend (AdonisJS), and the last to run the email manager (Python). 

In the AdonisJS terminal (cadastro-backend), type the command `ni .env` if you are using Windows; if you are using Linux/macOS, type and run `touch .env`. Do the same in the Python terminal (python-api). 

After that, run the command `Copy-Item .env.example .env` if you are using Windows. If you are using Linux/macOS, run `cp .env.example .env`. This command must be run in both `cadastro-backend` and `python-api`.

Now that you have the .env files, open the AdonisJS terminal and run `node ace generate:key`.

You will need a Google App Key for the Python one to work. If you don't know how to generate one, watch the video https://www.youtube.com/watch?v=GsXyF5Zb5UY. After generating an app key, place it in the .env file of the python-api, in the SMTP_PASSWORD variable. The SMPT_USER variable should be your gmail.

To finalize the configuration, run the commands below in PowerShell (Windows):

```
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Or in Linux/macOS:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

After having all 3 terminals open, run the commands (separately):

```
ng serve // at frontend (Angular) terminal/cmd
npm run dev --watch // at backend (AdonisJS) terminal/cmd
uvicorn main:app --reload // at backend (Python) terminal/cmd
```

After running those three commands, you should be able to use all the website features.