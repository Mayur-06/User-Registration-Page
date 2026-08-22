# import httpx
# from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Depends
# from app.routes.user import get_current_user_id

# router = APIRouter()

# RAG_BACKEND_URL = "http://localhost:8001"

# @router.post("/documents/upload")
# async def upload_document(
#     request: Request,
#     file: UploadFile = File(...),
#     user_id: str = Depends(get_current_user_id),
# ):
#     auth_header = request.headers.get("Authorization")
#     file_bytes = await file.read()

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"{RAG_BACKEND_URL}/documents/upload",
#             headers={"Authorization": auth_header},
#             files={"file": (file.filename, file_bytes, file.content_type)},
#             timeout=60.0,
#         )
#     if response.status_code !=200:
#         raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Upload failed"))
#     return response.json()

# @router.get("/documents")
# async def list_documents(request: Request, user_id: str = Depends(get_current_user_id)):
#     auth_header = request.headers.get("Authorization")

#     async with httpx.AsyncClient() as client:
#         response = await client.get(
#             f"{RAG_BACKEND_URL}/documents",
#             headers={"Authorization": auth_header},
#         )

#     if response.status_code != 200:
#         raise HTTPException(status_code=response.status_code, detail="Failed to fetch documents")

#     return response.json()


# @router.delete("/documents/{filename}")
# async def delete_document(filename: str, request: Request, user_id: str = Depends(get_current_user_id)):
#     auth_header = request.headers.get("Authorization")

#     async with httpx.AsyncClient() as client:
#         response = await client.delete(
#             f"{RAG_BACKEND_URL}/documents/{filename}",
#             headers={"Authorization": auth_header},
#         )

#     if response.status_code != 200:
#         raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Delete failed"))

#     return response.json()