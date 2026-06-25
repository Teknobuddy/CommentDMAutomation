import requests
from config import IG_BUSINESS_ACCOUNT_ID
from services.config_manager import get_current_token, save_new_token

GRAPH_API_URL = "https://graph.instagram.com"

def send_dm(comment_id: str, message: str):
    url = f"{GRAPH_API_URL}/me/messages"
    payload = {
        "recipient": {"comment_id": comment_id},
        "message": {"text": message}
    }
    params = {"access_token": get_current_token()}
    
    response = requests.post(url, json=payload, params=params)
    return response.json()

def reply_to_comment(comment_id: str, message: str):
    url = f"{GRAPH_API_URL}/{comment_id}/replies"
    payload = {"message": message}
    params = {"access_token": get_current_token()}
    
    response = requests.post(url, json=payload, params=params)
    return response.json()

def get_account_media():
    url = f"{GRAPH_API_URL}/me/media"
    params = {
        "access_token": get_current_token(),
        "fields": "id,media_type,media_url,thumbnail_url,permalink,caption",
        "limit": 100
    }
    all_media = []
    while url:
        response = requests.get(url, params=params)
        data = response.json()
        if "error" in data:
            print(f"Instagram API Error: {data['error']}")
            break
        all_media.extend(data.get("data", []))
        next_url = data.get("paging", {}).get("next")
        if next_url:
            url = next_url
            params = {}  # next_url already includes all needed query params
        else:
            url = None
    return all_media

def refresh_access_token():
    """
    Refreshes the current long-lived Instagram access token and
    saves the new one so it survives restarts/redeploys.
    """
    current_token = get_current_token()
    url = f"{GRAPH_API_URL}/refresh_access_token"
    params = {
        "grant_type": "ig_refresh_token",
        "access_token": current_token
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "access_token" in data:
        save_new_token(data["access_token"], data.get("expires_in", 0))
        print(f"✅ Instagram access token refreshed successfully. Expires in {data.get('expires_in')} seconds.")
        return data
    else:
        print(f"❌ Token refresh failed: {data}")
        return data
