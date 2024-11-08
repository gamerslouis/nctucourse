FROM python:3.9-alpine AS base

# Add user app
RUN adduser -s /bin/sh -h /home/app -u 1000 -D app
USER app
WORKDIR /home/app

FROM base AS builder
# Install packages
COPY requirements.txt /requirements.txt
RUN pip install --user -r /requirements.txt

FROM base

# update PATH environment variable
ENV PATH=/home/app/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PRODUCTION_ENV=1
ENV DJANGO_SETTINGS_MODULE=nctucourse.settings.production

# copy only the dependencies installation from the 1st stage image
COPY --from=builder /home/app/.local /home/app/.local
COPY . /home/app/
WORKDIR /home/app

RUN python manage.py collectstatic --noinput --clear

EXPOSE 8000
CMD ["gunicorn", "--workers=4", "--error-logfile", "-", "--access-logfile", "-", "--bind=0.0.0.0:8000", "nctucourse.wsgi"]
