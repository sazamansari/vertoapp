from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/recommend", tags=["recommendation"])

class RecommendTeamRequest(BaseModel):
    projectId: str
    workspaceId: str
    requirements: list[str]

@router.post("/team")
def recommend_team(req: RecommendTeamRequest):
    # Mock AI response
    return {
        "success": True,
        "recommendations": [
            {
                "role": "Frontend Developer",
                "skillsMatch": ["React", "Next.js"],
                "suggestedMemberId": "mock-member-1"
            }
        ]
    }
