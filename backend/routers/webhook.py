from fastapi import APIRouter, Request, Query, HTTPException
from config import VERIFY_TOKEN
from services.instagram import send_dm, reply_to_comment
from services.config_manager import get_reel_config

router = APIRouter(prefix="/webhook", tags=["webhook"])

@router.get("")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge")
):
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")

@router.post("")
async def handle_webhook(request: Request):
    body = await request.json()
    print(f"\n{'='*50}")
    print(f"WEBHOOK RECEIVED:")
    print(f"Body: {body}")
    print(f"{'='*50}\n")
    
    if body.get("object") != "instagram":
        print("❌ Not an Instagram object")
        return {"status": "ignored"}
    
    for entry in body.get("entry", []):
        for change in entry.get("changes", []):
            print(f"Change field: {change.get('field')}")
            
            if change.get("field") == "comments":
                value = change.get("value", {})
                comment_id = value.get("id")
                comment_text = value.get("text", "").strip().lower()
                media_id = value.get("media", {}).get("id")
                commenter_id = value.get("from", {}).get("id")
                
                print(f"📝 Comment ID: {comment_id}")
                print(f"📝 Comment Text: {comment_text}")
                print(f"📝 Media ID: {media_id}")
                print(f"👤 Commenter ID: {commenter_id}")
                
                # Skip if this is your own comment (bot replying to itself)
                if commenter_id == entry.get("id"):
                    print("⏭️ Skipping - this is our own comment")
                    continue
                
                if not comment_id or not media_id:
                    print("❌ Missing comment_id or media_id")
                    continue
                
                config = get_reel_config(media_id)
                print(f"⚙️ Config: {config}")
                
                if not config.get("active"):
                    print("❌ Config not active")
                    continue
                
                trigger = config.get("trigger_keyword", "").lower()
                print(f"🔑 Trigger keyword: '{trigger}'")
                print(f"🔍 Checking if '{trigger}' in '{comment_text}'")
                
                if trigger and trigger in comment_text:
                    print("✅ TRIGGER MATCHED!")
                    dm_message = config.get("dm_message", "")
                    comment_reply = config.get("comment_reply", "")
                    
                    if dm_message:
                        print(f"📤 Sending DM: {dm_message}")
                        dm_response = send_dm(comment_id, dm_message)
                        print(f"📥 DM Response: {dm_response}")
                    
                    if comment_reply:
                        print(f"💬 Replying to comment: {comment_reply}")
                        reply_response = reply_to_comment(comment_id, comment_reply)
                        print(f"💬 Reply Response: {reply_response}")
                else:
                    print(f"❌ Trigger NOT matched. '{trigger}' not in '{comment_text}'")
    
    return {"status": "ok"}
