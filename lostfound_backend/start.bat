@echo off
call .venv\Scripts\activate.bat
python manage.py makemigrations
python manage.py migrate
python manage.py runserver