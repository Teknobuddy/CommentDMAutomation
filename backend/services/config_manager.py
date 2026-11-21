import json
import os

# Use Railway volume if available, otherwise local file
DATA_DIR = os.getenv("RAILWAY_VOLUME_MOUNT_PATH", ".")
CONFIG_FILE = os.path.join(DATA_DIR, "reels_config.json")

def _load_config():
    if not os.path.exists(CONFIG_FILE):
        default_config = {
            "reels": {},
            "default": {
    "trigger_keywords": ["info"],
    "dm_message": "Thanks for your interest! Check your DMs.",
    "comment_reply": "Sent you a DM!",
    "active": False,
    "delay_seconds": 120,
    "show_follow_button": True,
    "reply_to_all": False,
}
        }
        _save_config(default_config)
        return default_config
    
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)

def _save_config(config):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)

def get_all_configs():
    return _load_config()

def get_reel_config(media_id: str):
    config = _load_config()
    return config["reels"].get(media_id, config["default"])

def update_reel_config(media_id: str, new_config: dict):
    config = _load_config()
    config["reels"][media_id] = new_config
    _save_config(config)
    return new_config

TOKEN_FILE = os.path.join(DATA_DIR, "ig_token.json")

def _env_hash():
    import hashlib
    from config import INSTAGRAM_ACCESS_TOKEN
    return hashlib.sha256((INSTAGRAM_ACCESS_TOKEN or "").encode()).hexdigest()[:16]

def get_current_token():
    """
    Returns the most recently saved (auto-refreshed) Instagram access token.
    If a NEW token was pasted into INSTAGRAM_ACCESS_TOKEN since then (e.g. after Instagram reset the login),
    the new one wins; otherwise a dead saved token would block the tool forever (fix 20 Nov 2026).
    """
    from config import INSTAGRAM_ACCESS_TOKEN
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            data = json.load(f)
        if not INSTAGRAM_ACCESS_TOKEN or data.get("src") == _env_hash():
            return data.get("access_token")
    return INSTAGRAM_ACCESS_TOKEN

def save_new_token(access_token: str, expires_in: int):
    """
    Saves a refreshed access token, along with the time it was saved, when it will expire,
    and which pasted token it came from, to the persistent volume.
    """
    import time
    data = {
        "access_token": access_token,
        "saved_at": time.time(),
        "expires_in": expires_in,
        "src": _env_hash(),
    }
    with open(TOKEN_FILE, "w") as f:
        json.dump(data, f, indent=2)
