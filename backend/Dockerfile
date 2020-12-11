FROM python:3
ENV PYTHONUNBUFFERED=1
ENV PRODUCTION_ENV=1
RUN mkdir /app
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app/

EXPOSE 8000
CMD ["gunicorn", "--workers=4", "--bind=127.0.0.1:8000", "main:app"]
