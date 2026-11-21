import asyncio
from fastapi import APIRouter, Request, Query, HTTPException
from config import VERIFY_TOKEN
from services.instagram import send_dm, send_dm_with_follow_button, reply_to_comment
from services.config_manager import get_reel_config

# The same public reply on every comment looks like a bot to Instagram (owner, 20 Nov 2026). Each comment gets a
# different short reply, often with the person's @name. The reel's own "comment reply" text is one of the options;
# several options can be typed in that field separated by | .
REPLIES = [
    "Sent! Check your DMs 📩", "Just sent it to your DMs {u} 🗺️", "Check your inbox {u}, it's there", "Done {u}! It's in your DMs",
    "DM sent 👀 have fun", "On its way to your DMs {u}", "Got it {u}, sent!", "Check your messages, it's there 🔥",
    "Sent ✅ look in your message requests if you don't see it", "In your DMs now {u} 🙌", "Delivered 📬 check your DMs",
    "Just sent it over {u}! Check your DMs 💌", "Boom! Just landed in your DMs {u} 🚀", "All yours {u}! Check your DMs for the link 🔗",
    "Done {u}! Go check your messages 📲", "Coming right up! Check your DMs now ⚡", "You're all set {u}! Check your inbox 📥",
    "Head over to your DMs {u}, just sent it! 🏃‍♂️💨", "Shared the link in your inbox {u}! Enjoy 🎉", "Check your messages {u}, I just dropped it there 👇",
]

def vary_reply(base: str, comment_id: str, username: str) -> str:
    options = [o.strip() for o in (base or "").split("|") if o.strip()] + REPLIES
    h = 0
    for ch in str(comment_id):
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    u = "@" + username if username else ""
    text = options[h % len(options)]
    return text.replace(" {u}", " " + u if u else "").replace("{u}", u).strip()

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

async def send_after_delay(comment_id: str, dm_message: str, comment_reply: str, delay_seconds: int, show_follow_button: bool, username: str = ""):
    if delay_seconds and delay_seconds > 0:
        print(f"⏳ Waiting {delay_seconds}s before sending DM/reply for comment {comment_id}")
        await asyncio.sleep(delay_seconds)

    if dm_message:
        if show_follow_button:
            print(f"📤 Sending DM with follow button: {dm_message}")
            dm_response = send_dm_with_follow_button(comment_id, dm_message)
        else:
            print(f"📤 Sending plain DM: {dm_message}")
            dm_response = send_dm(comment_id, dm_message)
        print(f"📥 DM Response: {dm_response}")

    if comment_reply:
        comment_reply = vary_reply(comment_reply, comment_id, username)
        print(f"💬 Replying to comment: {comment_reply}")
        reply_response = reply_to_comment(comment_id, comment_reply)
        print(f"💬 Reply Response: {reply_response}")

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
                commenter_name = value.get("from", {}).get("username", "")

                print(f"📝 Comment ID: {comment_id}")
                print(f"📝 Comment Text: {comment_text}")
                print(f"📝 Media ID: {media_id}")
                print(f"👤 Commenter ID: {commenter_id}")

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

                reply_to_all = config.get("reply_to_all", False)

                if reply_to_all:
                    print(f"📣 Reply-to-all mode ON — firing for every comment")
                    dm_message = config.get("dm_message", "")
                    comment_reply = config.get("comment_reply", "")
                    delay_seconds = config.get("delay_seconds", 120) if config.get("delay_set") else 120  # owner 20 Nov 2026: default 2 minutes; a delay he set himself (0 = instant) is used as is
                    show_follow_button = config.get("show_follow_button", True)
                    asyncio.create_task(
                        send_after_delay(comment_id, dm_message, comment_reply, delay_seconds, show_follow_button, commenter_name)
                    )
                else:
                    triggers = config.get("trigger_keywords", [])
                    triggers = [t.lower().strip() for t in triggers if t.strip()]
                    print(f"🔑 Trigger keywords: {triggers}")
                    print(f"🔍 Checking if any of {triggers} are in '{comment_text}'")

                    matched = next((t for t in triggers if t in comment_text), None)

                    if matched:
                        print(f"✅ TRIGGER MATCHED: '{matched}'")
                        dm_message = config.get("dm_message", "")
                        comment_reply = config.get("comment_reply", "")
                        delay_seconds = config.get("delay_seconds", 120) if config.get("delay_set") else 120  # owner 20 Nov 2026: default 2 minutes; a delay he set himself (0 = instant) is used as is
                        show_follow_button = config.get("show_follow_button", True)
                        asyncio.create_task(
                            send_after_delay(comment_id, dm_message, comment_reply, delay_seconds, show_follow_button, commenter_name)
                        )
                    else:
                        print(f"❌ No trigger matched in '{comment_text}'")

    return {"status": "ok"}
