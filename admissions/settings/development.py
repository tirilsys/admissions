from django.core.management.commands.runserver import Command as runserver

from .base import *

SETTINGS_DIR = environ.Path(__file__) - 1

env = environ.Env()
env_file = str(SETTINGS_DIR.path(".env"))
env.read_env(env_file)

# GENERAL CONFIGURATION =======================================================
DEBUG = env("DEBUG", default=True)
SECRET_KEY = "secretkeythatisnotsosecret"
runserver.default_port = "5000"

DJANGO_VITE_DEV_MODE = env("VITE_DEV", default=True)
DJANGO_VITE_DEV_SERVER_PORT = "5001"
STATICFILES_DIRS = STATICFILES_DIRS + [
    BASE_PROJECT_DIR.path("frontend/src/assets")(),
]

# DATABASE CONFIGURATION ======================================================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "admissions",
        "USER": "admissions",
        "PASSWORD": "",
        "HOST": "127.0.0.1",
        "PORT": "5433",
    }
}

API_URL = "/api"


# Uncomment app config and middleware config to enable debug toolbar
# APP CONFIGURATION ============================================================
# INSTALLED_APPS += ["debug_toolbar"]

# MIDDLEWARE CONFIGURATION =====================================================
# MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]

# DEBUG-TOOLBAR CONFIGURATION ==================================================
DEBUG_TOOLBAR_PANELS = [
    "debug_toolbar.panels.versions.VersionsPanel",
    "debug_toolbar.panels.timer.TimerPanel",
    "debug_toolbar.panels.settings.SettingsPanel",
    "debug_toolbar.panels.headers.HeadersPanel",
    "debug_toolbar.panels.request.RequestPanel",
    "debug_toolbar.panels.sql.SQLPanel",
    "debug_toolbar.panels.templates.TemplatesPanel",
    "debug_toolbar.panels.cache.CachePanel",
    "debug_toolbar.panels.signals.SignalsPanel",
    "debug_toolbar.panels.logging.LoggingPanel",
    "debug_toolbar.panels.redirects.RedirectsPanel",
]

INTERNAL_IPS = ["127.0.0.1"]

AUTHENTICATION_BACKENDS = ["admissions.oauth.LegoOAuth2"] + AUTHENTICATION_BACKENDS

SOCIAL_AUTH_LEGO_KEY = env("AUTH_LEGO_KEY", None)
SOCIAL_AUTH_LEGO_SECRET = env("AUTH_LEGO_SECRET", None)
SOCIAL_AUTH_LEGO_API_URL = env("AUTH_LEGO_API_URL", None)

CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5001",
    "http://127.0.0.1:8000",
]
