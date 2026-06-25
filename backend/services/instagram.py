import requests
from config import INSTAGRAM_ACCESS_TOKEN, IG_BUSINESS_ACCOUNT_ID

GRAPH_API_URL = "https://graph.instagram.com"

def send_dm(comment_id: str, message: str):
    url = f"{GRAPH_API_URL}/me/messages"
    payload = {
        "recipient": {"comment_id": comment_id},
        "message": {"text": message}
    }
    params = {"access_token": INSTAGRAM_ACCESS_TOKEN}
    
    response = requests.post(url, json=payload, params=params)
    return response.json()

def reply_to_comment(comment_id: str, message: str):
    url = f"{GRAPH_API_URL}/{comment_id}/replies"
    payload = {"message": message}
    params = {"access_token": INSTAGRAM_ACCESS_TOKEN}
    
    response = requests.post(url, json=payload, params=params)
    return response.json()

def get_account_media():
    url = f"{GRAPH_API_URL}/me/media"
    params = {
        "access_token": INSTAGRAM_ACCESS_TOKEN,
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
