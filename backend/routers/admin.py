from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.instagram import get_account_media, send_dm, reply_to_comment
from services.config_manager import get_all_configs, update_reel_config, get_reel_config

router = APIRouter(prefix="/api", tags=["admin"])

class ReelConfigUpdate(BaseModel):
    trigger_keywords: list[str]
    dm_message: str
    comment_reply: str
    active: bool
    delay_seconds: int = 0
    show_follow_button: bool = True

class TestDMRequest(BaseModel):
    comment_id: str
    message: str

class TestReplyRequest(BaseModel):
    comment_id: str
    message: str

@router.get("/reels")
async def fetch_reels():
    try:
        media_items = get_account_media()
        configs = get_all_configs()
        
        reels = []
        for item in media_items:
            media_id = item["id"]
            config = configs["reels"].get(media_id, configs["default"])
            
            reels.append({
                "id": media_id,
                "thumbnail_url": item.get("thumbnail_url", item.get("media_url")),
                "permalink": item.get("permalink"),
                "caption": item.get("caption", "")[:100],
                "config": config
            })
        
        return {"reels": reels, "total": len(reels)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reels/{media_id}")
async def get_reel(media_id: str):
    config = get_reel_config(media_id)
    return {"media_id": media_id, "config": config}

@router.put("/reels/{media_id}")
async def update_reel(media_id: str, config: ReelConfigUpdate):
    try:
        update_reel_config(media_id, config.dict())
        return {"status": "updated", "media_id": media_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_stats():
    media_items = get_account_media()
    configs = get_all_configs()
    
    total = len(media_items)
    configured = 0
    using_default = 0
    
    for item in media_items:
        media_id = item["id"]
        if media_id in configs["reels"]:
            configured += 1
        else:
            using_default += 1
    
    return {
        "total_reels": total,
        "configured": configured,
        "using_default": using_default
    }

@router.post("/test/send-dm")
async def test_send_dm(request: TestDMRequest):
    """Test endpoint to manually send a DM using a comment_id"""
    try:
        result = send_dm(request.comment_id, request.message)
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test/reply-comment")
async def test_reply_comment(request: TestReplyRequest):
    """Test endpoint to manually reply to a comment"""
    try:
        result = reply_to_comment(request.comment_id, request.message)
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
