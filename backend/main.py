import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import webhook, admin
from services.instagram import refresh_access_token

app = FastAPI(title="Instagram Comment-to-DM Automation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook.router)
app.include_router(admin.router)

REFRESH_INTERVAL_SECONDS = 4 * 24 * 60 * 60  # every 4 days

async def token_refresh_loop():
    while True:
        try:
            refresh_access_token()
        except Exception as e:
            print(f"❌ Token refresh loop error: {e}")
        await asyncio.sleep(REFRESH_INTERVAL_SECONDS)

@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(token_refresh_loop())

@app.get("/")
def root():
    return {"status": "ok", "service": "Instagram Comment-to-DM Automation"}

@app.get("/health")
def health():
    return {"status": "healthy"}
# persistence test
