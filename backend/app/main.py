from fastapi import FastAPI
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware
from routers import operation
from routers import user


host = "localhost"
port = 8000

app = FastAPI(title="Remind-Me API", description="API Documentation", version="0.0.1")

origins = [
    # "http://remind-me-frontend.s3-website-ap-southeast-1.amazonaws.com",
    "http://localhost:8000",
    # "https://3.0.1.90:8000",
    "http://localhost:5173",
]



# ✅ Allow requests from React frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 🔥 Update this to match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (POST, GET, DELETE, etc.)
    allow_headers=["*"],  # ✅ Allow all headers
)

app.include_router(user.router)
app.include_router(operation.router)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI!"}

if __name__ == "__main__":
    uvicorn.run(app, host=host, port=port)
