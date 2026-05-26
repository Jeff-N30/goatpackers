"""
Goatpackers FastAPI backend.
Runs as a Vercel Python serverless function.

Vercel routes /api/* → this handler via vercel.json rewrites.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel, EmailStr
import os
from supabase import create_client, Client

# ─── App ───────────────────────────────────────────────────────────────────

app = FastAPI(title="Goatpackers API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten to your domain in production
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─── Supabase client ────────────────────────────────────────────────────────

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
    return create_client(url, key)


# ─── Schemas ────────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# ─── Routes ─────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/events")
def get_events(type: str = "upcoming"):
    """
    Returns events filtered by type ('upcoming' or 'past').
    Query: GET /api/events?type=upcoming
    """
    if type not in ("upcoming", "past"):
        raise HTTPException(status_code=400, detail="type must be 'upcoming' or 'past'")

    sb = get_supabase()
    order_asc = type == "upcoming"
    result = (
        sb.table("events")
        .select("*")
        .eq("type", type)
        .order("date", desc=not order_asc)
        .execute()
    )
    return result.data


@app.get("/api/gallery")
def get_gallery():
    """Returns all gallery images ordered by creation date."""
    sb = get_supabase()
    result = (
        sb.table("gallery")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@app.get("/api/team")
def get_team():
    """Returns team members ordered by display order."""
    sb = get_supabase()
    result = (
        sb.table("team")
        .select("*")
        .order("order", desc=False)
        .execute()
    )
    return result.data


@app.post("/api/contact", status_code=201)
def submit_contact(body: ContactRequest):
    """
    Saves a contact form submission to the contacts table.
    Returns the created record id.
    """
    sb = get_supabase()
    result = (
        sb.table("contacts")
        .insert({
            "name": body.name,
            "email": body.email,
            "subject": body.subject,
            "message": body.message,
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save contact submission")

    return {"id": result.data[0]["id"], "status": "received"}


# ─── Vercel ASGI handler ─────────────────────────────────────────────────────

handler = Mangum(app, lifespan="off")
