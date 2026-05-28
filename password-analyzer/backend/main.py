from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_password, generate_strong_password

app = FastAPI(title="Password Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PasswordRequest(BaseModel):
    password: str


@app.get("/")
def root():
    return {"status": "online", "service": "Password Analyzer API"}


@app.post("/analyze")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)


@app.get("/suggest")
def suggest():
    return {"password": generate_strong_password()}
