from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/generate", tags=["generation"])

class GenerateTasksRequest(BaseModel):
    projectId: str
    workspaceId: str
    prompt: str

@router.post("/tasks")
def generate_tasks(req: GenerateTasksRequest):
    return {
        "success": True,
        "generatedTasks": [
            {
                "name": "Setup Database Schema",
                "description": "Initialize MongoDB models",
                "priority": "HIGH",
                "complexity": "MODERATE",
                "status": "TODO"
            },
            {
                "name": "Create API Endpoints",
                "description": "Implement CRUD endpoints",
                "priority": "HIGH",
                "complexity": "COMPLEX",
                "status": "TODO"
            }
        ]
    }
