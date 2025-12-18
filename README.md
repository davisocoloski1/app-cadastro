An application for managing accounts with code confirmation sent via email, account/password recovery via a link also sent by email, and CRUD options to create an account, view and edit information, and finally, delete the account.

How to run: select a directory on your computer, open cmd and type the command below.
```
git clone https://github.com/davisocoloski1/app-cadastro.git
cd app-cadastro
```

After that, you will need 3 terminals (cmd pages). One to run the frontend (Angular), another to run the website's backend (AdonisJS), and the last to run the email manager (Python). 

In the first terminal, run:

```
cd cadastro-backend
npm install
ni .env # touch .env for Linux/macOS
Copy-Item .env.example .env # cp .env.example .env for Linux/macOS
npm run db-key
npm run migration
```

Before runing `npm run dev`, insert into your .env file the following variables for creating a admin user for your system (they are in the .env.example, make sure to replace their values).

```
ADMIN_EMAIL=youradmin@gmail.com
ADMIN_PASSWORD=your_admin_password # example: 12345678
ADMIN_NAME=Admin
ADMIN_PHONE=your_admin_phone_number # example: 55XX9XXXXXXXX
```

Then, you will have to create a PostgreSQL database manually (use pgAdmin 4, Dbeaver or other), change your db credentials at .env file and run:

```
npm run seed
npm run dev
```

Now open a second terminal and run:

```
cd frontend
npm install
ng serve
```

Now open a third terminal and run:

```
cd python-api
ni .env # touch .env for Linux/macOS
Copy-Item .env.example .env # cp .env.example .env for Linux/macOS
```

You will need a Google App Key for the Python .env file to work. If you don't know how to generate one, watch the video https://www.youtube.com/watch?v=GsXyF5Zb5UY. After generating an app key, place it in the .env file of the python-api, in the SMTP_PASSWORD variable. The SMPT_USER variable should be your gmail.

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

After having all 3 terminals open, run the commands (separately, if they are not running yet):

```
ng serve // at frontend (Angular) terminal/cmd
npm run dev --watch // at backend (AdonisJS) terminal/cmd
uvicorn main:app --reload // at backend (Python) terminal/cmd
```

After running those three commands, you should be able to use all the website features.