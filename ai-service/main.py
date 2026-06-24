import os
import math
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, PyMongoError
from bson import ObjectId

# ──────────────── Setup Production Logging ────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("evolvian-ai-service")

app = FastAPI(
    title="Evolvian AI Flow Production Service",
    description="Production-grade AI Team Intelligence and Workload Analytics Service",
    version="1.0.0"
)

# ──────────────── CORS Configuration ────────────────
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/.env")))

# Allow configuration of origins via environment variables for production security
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
origins = [origin.strip() for origin in allowed_origins_env.split(",")] if allowed_origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────── MongoDB Production Connection ────────────────
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    logger.warning("MONGODB_URI not found in env. Falling back to default Atlas URI.")
    MONGODB_URI = "mongodb+srv://Login_auth:Test123456@cluster0.t4wak6a.mongodb.net/jira-clone?retryWrites=true&w=majority&appName=Cluster0"

db = None
mongo_client = None

try:
    logger.info("Initializing MongoDB client pool...")
    # Production pool configurations
    mongo_client = MongoClient(
        MONGODB_URI,
        maxPoolSize=50,
        minPoolSize=5,
        retryWrites=True,
        retryReads=True,
        connectTimeoutMS=5000,
        serverSelectionTimeoutMS=5000
    )
    # Ping admin database to force-connect and verify status
    mongo_client.admin.command('ping')
    db = mongo_client.get_default_database()
    if db is None:
        db = mongo_client["jira-clone"]
    logger.info(f"MongoDB connection verified. Active Database: '{db.name}'")

    # Ensure critical performance indexes exist on startup
    logger.info("Ensuring performance indexes exist in MongoDB...")
    db.tasks.create_index([("workspaceId", 1), ("status", 1)])
    db.tasks.create_index([("workspaceId", 1), ("projectId", 1)])
    db.tasks.create_index([("workspaceId", 1), ("assigneeId", 1)])
    db.members.create_index([("workspaceId", 1), ("userId", 1)])
    logger.info("MongoDB index validation complete.")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    logger.critical(f"CRITICAL: Failed to verify MongoDB connection: {e}")
except Exception as e:
    logger.error(f"Unexpected error during startup initialization: {e}")

# ──────────────── Helper Utilities ────────────────

def clean_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively converts MongoDB ObjectIds and datetime structures to JSON-safe formats."""
    if not doc:
        return doc
    cleaned = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            cleaned[k] = str(v)
        elif isinstance(v, datetime):
            cleaned[k] = v.isoformat()
        elif isinstance(v, dict):
            cleaned[k] = clean_doc(v)
        elif isinstance(v, list):
            cleaned[k] = [
                clean_doc(x) if isinstance(x, dict)
                else str(x) if isinstance(x, ObjectId)
                else x for x in v
            ]
        else:
            cleaned[k] = v
    return cleaned

def parse_object_id(id_str: str, entity_name: str = "id") -> ObjectId:
    """Safely converts string to BSON ObjectId, raising 400 Bad Request if invalid."""
    try:
        return ObjectId(id_str)
    except Exception:
        logger.error(f"Malformed ObjectId received for {entity_name}: '{id_str}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Malformed ObjectId format for {entity_name}"
        )

# ──────────────── Schemas ────────────────

class PredictCompletionInput(BaseModel):
    taskId: str
    workspaceId: str
    projectId: str

class RecommendTeamInput(BaseModel):
    projectId: str
    workspaceId: str
    requirements: List[str]

class AnalyzePerformanceInput(BaseModel):
    workspaceId: str
    memberId: str

class GenerateTasksInput(BaseModel):
    workspaceId: str
    projectId: str
    prompt: str

class PlanSprintInput(BaseModel):
    workspaceId: str
    projectId: str
    sprintName: str
    durationWeeks: int

class DetectRisksInput(BaseModel):
    workspaceId: str
    projectId: str

class EstimateDeadlineInput(BaseModel):
    workspaceId: str
    projectId: str

class ChatInput(BaseModel):
    message: str
    workspaceId: Optional[str] = None

# ──────────────── API Handlers ────────────────

@app.get("/health")
def health():
    """Service health indicator verifying internal services and database latency."""
    if db is None:
        return {"status": "degraded", "service": "Evolvian AI Flow", "database": "offline"}
    try:
        mongo_client.admin.command('ping')
        return {"status": "online", "service": "Evolvian AI Flow", "database": "connected"}
    except PyMongoError as e:
        logger.error(f"Health check database ping failed: {e}")
        return {"status": "degraded", "service": "Evolvian AI Flow", "database": "unreachable"}

@app.post("/predict/completion")
def predict_completion(data: PredictCompletionInput):
    """Predicts task completion days using historical team velocity, task complexity, and priority metrics."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )
    
    task_id = parse_object_id(data.taskId, "taskId")
    
    try:
        task = db.tasks.find_one({"_id": task_id})
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {data.taskId} not found"
            )

        # Extraction with default fallbacks
        estimated_hours = float(task.get("estimatedHours") or 8)
        logged_hours = float(task.get("loggedHours") or 0)
        complexity = task.get("complexity") or "MODERATE"
        priority = task.get("priority") or "MEDIUM"

        base_days = estimated_hours / 8.0

        # Mathematical Heuristic Factors
        complexity_map = {"SIMPLE": 0.85, "MODERATE": 1.15, "COMPLEX": 1.5}
        complexity_factor = complexity_map.get(complexity, 1.15)

        priority_map = {"URGENT": 0.8, "HIGH": 0.95, "MEDIUM": 1.0, "LOW": 1.1, "NONE": 1.0}
        priority_factor = priority_map.get(priority, 1.0)

        # Developer estimation accuracy factor (computed over past completed tasks)
        history_multiplier = 1.1
        assignee_id = task.get("assigneeId")
        if assignee_id:
            completed_tasks = list(db.tasks.find({
                "assigneeId": assignee_id,
                "status": "DONE",
                "estimatedHours": {"$exists": True, "$ne": None},
                "loggedHours": {"$exists": True, "$ne": None}
            }))
            if completed_tasks:
                total_est = sum(float(t.get("estimatedHours") or 0) for t in completed_tasks)
                total_act = sum(float(t.get("loggedHours") or 0) for t in completed_tasks)
                if total_est > 0:
                    history_multiplier = max(0.5, min(2.5, total_act / total_est))

        # Adjusted delivery forecast
        adjusted = base_days * complexity_factor * priority_factor * history_multiplier
        predicted = max(1, round(adjusted))

        # Metric Confidence Bounds
        confidence = 0.85
        if not task.get("estimatedHours"):
            confidence -= 0.15
        if not assignee_id:
            confidence -= 0.1

        confidence = max(0.4, min(0.95, round(confidence, 2)))
        risk_score = int(max(0, min(100, (1.0 - confidence) * 100 + (35 if predicted > 10 else 0))))

        # Update database document
        db.tasks.update_one(
            {"_id": task_id},
            {"$set": {
                "completionPrediction": predicted,
                "riskScore": risk_score,
                "updatedAt": datetime.utcnow()
            }}
        )

        return {
            "predictedDays": predicted,
            "confidence": confidence,
            "breakdown": {
                "baseDays": round(base_days, 1),
                "complexityFactor": complexity_factor,
                "priorityFactor": priority_factor,
                "historyMultiplier": round(history_multiplier, 2)
            },
            "source": "ai",
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on predict_completion: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected crash in predict_completion: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/recommend/team")
def recommend_team(data: RecommendTeamInput):
    """Ranks developers for project assignments based on skill requirements and past task efficiency."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_53_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )
    
    workspace_id = parse_object_id(data.workspaceId, "workspaceId")
    
    try:
        members = list(db.members.find({"workspaceId": workspace_id}))
        if not members:
            return {"recommended": [], "scores": [], "source": "ai"}

        scored_members = []
        for member in members:
            user_id = member.get("userId")
            if not user_id:
                continue

            user = db.users.find_one({"_id": user_id})
            if not user:
                continue

            # Query historical metrics
            assigned_tasks = list(db.tasks.find({
                "workspaceId": workspace_id,
                "assigneeId": member["_id"]
            }))

            completed = [t for t in assigned_tasks if t.get("status") == "DONE"]
            completed_count = len(completed)
            total_count = len(assigned_tasks)

            # Match criteria score
            skill_match_score = 0.0
            for req in data.requirements:
                req_lower = req.lower()
                # Check user profile
                if req_lower in user.get("name", "").lower():
                    skill_match_score += 15.0
                
                # Check completed task tags
                for task in completed:
                    labels = [l.lower() for l in task.get("labels", [])]
                    if req_lower in labels:
                        skill_match_score += 5.0
                        break

            skill_match_score = min(40.0, skill_match_score)

            # Completion ratios
            completion_ratio = (completed_count / total_count) if total_count > 0 else 0.5
            perf_score = completion_ratio * 40.0
            experience_score = min(20.0, completed_count * 2.0)

            total_score = round(30.0 + skill_match_score + perf_score + experience_score, 1)
            total_score = min(100.0, total_score)

            scored_members.append({
                "member": {
                    "id": str(member["_id"]),
                    "userId": str(user_id),
                    "name": user.get("name", "Unknown"),
                    "email": user.get("email", ""),
                    "role": member.get("role", "MEMBER")
                },
                "score": total_score
            })

        # Rank members
        scored_members.sort(key=lambda x: x["score"], reverse=True)
        top5 = scored_members[:5]

        return {
            "recommended": [r["member"] for r in top5],
            "scores": [r["score"] for r in top5],
            "source": "ai"
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on recommend_team: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except Exception as e:
        logger.error(f"Unexpected crash in recommend_team: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/analyze/performance")
def analyze_performance(data: AnalyzePerformanceInput):
    """Generates detailed developer performance cards, promotion metrics, and bottleneck alerts."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    member_id = parse_object_id(data.memberId, "memberId")
    workspace_id = parse_object_id(data.workspaceId, "workspaceId")

    try:
        member = db.members.find_one({"_id": member_id})
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workspace member '{data.memberId}' not found"
            )

        user = db.users.find_one({"_id": member.get("userId")})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User details corresponding to member not found"
            )

        assigned = list(db.tasks.find({
            "workspaceId": workspace_id,
            "assigneeId": member_id
        }))

        completed = [t for t in assigned if t.get("status") == "DONE"]
        in_progress = [t for t in assigned if t.get("status") in ["IN_PROGRESS", "IN_REVIEW"]]
        overdue = []

        now = datetime.utcnow()
        for t in assigned:
            due = t.get("dueDate")
            if due and isinstance(due, datetime) and due < now and t.get("status") != "DONE":
                overdue.append(t)

        completed_count = len(completed)
        in_progress_count = len(in_progress)
        overdue_count = len(overdue)
        total_count = len(assigned)

        # Performance analytics
        completion_rate = (completed_count / total_count) if total_count > 0 else 1.0
        efficiency_score = 100.0
        overrun_tasks = 0
        for t in completed:
            est = float(t.get("estimatedHours") or 0)
            act = float(t.get("loggedHours") or 0)
            if est > 0 and act > est:
                overrun_tasks += 1
                efficiency_score -= (act - est) * 2.0

        efficiency_score = max(50.0, min(100.0, efficiency_score))
        
        # Performance matrix
        perf_score = (completion_rate * 50.0) + (efficiency_score * 0.3) + (min(20.0, completed_count * 1.5))
        perf_score = round(min(100.0, max(10.0, perf_score)), 1)

        # Promotion metric logic
        promo_score = round(perf_score * 0.8 + (10.0 if member.get("role") == "ADMIN" else 0.0), 1)
        label = "Promote" if promo_score >= 80 else "Review" if promo_score >= 50 else "Monitor"

        # Actionable insights
        insights = []
        if completion_rate > 0.8:
            insights.append("Exhibits exceptionally high task completion rates.")
        if overdue_count > 0:
            insights.append(f"Has {overdue_count} overdue task(s) needing immediate attention.")
        if overrun_tasks > 0:
            insights.append(f"Estimates might be low: {overrun_tasks} task(s) required more hours than estimated.")
        if not insights:
            insights.append("Task performance is stable and in line with estimates.")

        return {
            "status": "success",
            "data": {
                "memberId": str(member_id),
                "name": user.get("name"),
                "role": member.get("role"),
                "tasksCompleted": completed_count,
                "tasksInProgress": in_progress_count,
                "tasksFailedOrOverdue": overdue_count,
                "performanceScore": perf_score,
                "promotionScore": promo_score,
                "recommendation": label,
                "insights": insights
            }
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on analyze_performance: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected crash in analyze_performance: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/generate/tasks")
def generate_tasks(data: GenerateTasksInput):
    """Auto-generates subtasks/milestones based on feature prompts and inserts them directly into the database."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    workspace_id = parse_object_id(data.workspaceId, "workspaceId")
    project_id = parse_object_id(data.projectId, "projectId")

    try:
        # Fetch workspace assignee
        member = db.members.find_one({"workspaceId": workspace_id})
        if not member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot generate tasks: no workspace members found to assign tasks to."
            )

        prompt_lower = data.prompt.lower()
        
        # Build tasks list template
        task_templates = []
        if any(w in prompt_lower for w in ["auth", "login", "sign"]):
            task_templates = [
                {"name": "Design authentication page UI mockup", "desc": "Design sign-in, sign-up and password recovery pages using Figma/Tailwind.", "hours": 6, "priority": "HIGH", "complexity": "MODERATE"},
                {"name": "Setup backend JWT sign-in route & validation", "desc": "Implement password hashing, validation schema, JWT payload generation and cookies.", "hours": 8, "priority": "HIGH", "complexity": "MODERATE"},
                {"name": "Integrate frontend client authentication context", "desc": "Create React hooks for AuthProvider to manage tokens, redirects and user sessions.", "hours": 8, "priority": "HIGH", "complexity": "MODERATE"},
                {"name": "Add OAuth2 social authentication login", "desc": "Configure Google and GitHub OAuth providers with Appwrite/Node endpoints.", "hours": 12, "priority": "MEDIUM", "complexity": "COMPLEX"}
            ]
        elif any(w in prompt_lower for w in ["db", "database", "mongo", "schema"]):
            task_templates = [
                {"name": "Establish MongoDB database connection utility", "desc": "Write helper files to manage connections, pool sizes and health checks.", "hours": 4, "priority": "HIGH", "complexity": "SIMPLE"},
                {"name": "Draft data models and index strategies", "desc": "Define task, project and user schemas. Optimize frequently requested fields with compound indexes.", "hours": 8, "priority": "HIGH", "complexity": "MODERATE"},
                {"name": "Create database seeding script", "desc": "Implement custom script using mock data generator to populate local development databases.", "hours": 6, "priority": "MEDIUM", "complexity": "SIMPLE"},
                {"name": "Setup automatic database backups cron job", "desc": "Write script to export database state every 24 hours to AWS S3/Cloud Storage.", "hours": 8, "priority": "LOW", "complexity": "MODERATE"}
            ]
        elif any(w in prompt_lower for w in ["api", "backend", "route"]):
            task_templates = [
                {"name": "Document RESTful API specs using Swagger", "desc": "Draft OpenAPI specifications detailing paths, payloads and responses.", "hours": 6, "priority": "LOW", "complexity": "SIMPLE"},
                {"name": "Create core CRUD route controllers", "desc": "Implement CRUD handlers for workspaces, tasks, and members.", "hours": 12, "priority": "HIGH", "complexity": "MODERATE"},
                {"name": "Apply rate limiting middleware", "desc": "Add middleware to protect critical endpoints from brute-force/DDOS style access.", "hours": 4, "priority": "MEDIUM", "complexity": "SIMPLE"},
                {"name": "Write unit integration tests for API endpoints", "desc": "Draft end-to-end testing suite using Jest or PyTest for critical paths.", "hours": 10, "priority": "MEDIUM", "complexity": "MODERATE"}
            ]
        else:
            task_templates = [
                {
                    "name": f"Research and scoping: {data.prompt}", 
                    "desc": f"Define specifications, technology constraints, and wireframes for: {data.prompt}", 
                    "hours": 6, 
                    "priority": "HIGH", 
                    "complexity": "MODERATE"
                },
                {
                    "name": f"Prototype core logic for {data.prompt}", 
                    "desc": "Code key business logic algorithms, endpoints, and mock databases.", 
                    "hours": 12, 
                    "priority": "HIGH", 
                    "complexity": "COMPLEX"
                },
                {
                    "name": f"Build user interface components for {data.prompt}", 
                    "desc": "Implement visual layouts, controls, forms, inputs, and dark-mode styling.", 
                    "hours": 10, 
                    "priority": "MEDIUM", 
                    "complexity": "MODERATE"
                },
                {
                    "name": f"Validate and deploy {data.prompt}", 
                    "desc": "Run verification plans, fix linting problems, and prepare release package.", 
                    "hours": 4, 
                    "priority": "LOW", 
                    "complexity": "SIMPLE"
                }
            ]

        # Calculate high position
        existing_tasks = list(db.tasks.find({"workspaceId": workspace_id, "projectId": project_id}))
        base_position = max([t.get("position") or 1000 for t in existing_tasks]) if existing_tasks else 1000

        inserted_tasks = []
        for i, t in enumerate(task_templates):
            pos = base_position + (i + 1) * 1000
            new_task = {
                "name": t["name"],
                "description": t["desc"],
                "status": "TODO",
                "workspaceId": workspace_id,
                "projectId": project_id,
                "position": pos,
                "assigneeId": member["_id"],
                "priority": t["priority"],
                "complexity": t["complexity"],
                "estimatedHours": t["hours"],
                "loggedHours": 0,
                "completionPrediction": 0,
                "riskScore": 0,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            res = db.tasks.insert_one(new_task)
            new_task["_id"] = res.inserted_id
            inserted_tasks.append(clean_doc(new_task))

        return {"success": True, "tasks": inserted_tasks, "source": "ai"}
    except PyMongoError as e:
        logger.error(f"Database query failure on generate_tasks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected crash in generate_tasks: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/plan/sprint")
def plan_sprint(data: PlanSprintInput):
    """Allocates tasks to sprints based on developer capacity metrics and task priority scoring."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_53_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    project_id = parse_object_id(data.projectId, "projectId")
    workspace_id = parse_object_id(data.workspaceId, "workspaceId")

    try:
        backlog_tasks = list(db.tasks.find({
            "projectId": project_id,
            "status": {"$ne": "DONE"}
        }))

        prio_weight = {"URGENT": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "NONE": 0}
        backlog_tasks.sort(key=lambda t: prio_weight.get(t.get("priority") or "NONE", 0), reverse=True)

        members_count = db.members.count_documents({"workspaceId": workspace_id})
        dev_count = max(1, members_count)
        
        # 35 capacity hours per week per dev
        total_capacity_hours = dev_count * 35.0 * data.durationWeeks

        allocated = []
        allocated_hours = 0.0
        
        for task in backlog_tasks:
            est = float(task.get("estimatedHours") or 8.0)
            if allocated_hours + est <= total_capacity_hours:
                allocated.append(clean_doc(task))
                allocated_hours += est

        risk_level = "LOW"
        if len(allocated) < len(backlog_tasks) * 0.4:
            risk_level = "HIGH"
        elif len(allocated) < len(backlog_tasks) * 0.7:
            risk_level = "MEDIUM"

        rec = "Velocity looks solid. You've planned within the team capacity."
        if risk_level == "HIGH":
            rec = "High backlog burden detected. Recommend adding more contributors or splitting features."

        return {
            "success": True,
            "sprintName": data.sprintName,
            "durationWeeks": data.durationWeeks,
            "allocatedTasksCount": len(allocated),
            "allocatedTasks": allocated,
            "estimatedTotalHours": allocated_hours,
            "riskLevel": risk_level,
            "recommendation": rec,
            "source": "ai"
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on plan_sprint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except Exception as e:
        logger.error(f"Unexpected crash in plan_sprint: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/detect/risks")
def detect_risks(data: DetectRisksInput):
    """Detects deadline risks, workload imbalances, and budget overruns on active projects."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    project_id = parse_object_id(data.projectId, "projectId")
    workspace_id = parse_object_id(data.workspaceId, "workspaceId")

    try:
        tasks = list(db.tasks.find({"projectId": project_id}))
        risks = []
        now = datetime.utcnow()

        assignee_loads = {}

        for task in tasks:
            status_str = task.get("status")
            assignee_id = task.get("assigneeId")
            
            # Risk 1: Overdue Task
            due_date = task.get("dueDate")
            if due_date and isinstance(due_date, datetime) and due_date < now and status_str != "DONE":
                risks.append({
                    "severity": "HIGH",
                    "taskName": task.get("name"),
                    "description": "Task is past due date but is not marked DONE.",
                    "mitigation": "Reassign to available member or extend due date immediately."
                })

            # Risk 2: Budget Overrun
            est = float(task.get("estimatedHours") or 0)
            act = float(task.get("loggedHours") or 0)
            if est > 0 and act > est * 1.25:
                risks.append({
                    "severity": "MEDIUM",
                    "taskName": task.get("name"),
                    "description": f"Actual hours ({act}h) exceeded estimate ({est}h) by more than 25%.",
                    "mitigation": "Analyze scope creep or provide developer assistance."
                })

            if assignee_id and status_str in ["IN_PROGRESS", "IN_REVIEW"]:
                assignee_loads[str(assignee_id)] = assignee_loads.get(str(assignee_id), 0) + 1

        # Risk 3: Bottleneck check
        for assignee_str, load in assignee_loads.items():
            if load >= 4:
                member = db.members.find_one({"_id": ObjectId(assignee_str)})
                user_name = "Unknown Member"
                if member:
                    user = db.users.find_one({"_id": member.get("userId")})
                    if user:
                        user_name = user.get("name")
                
                risks.append({
                    "severity": "HIGH",
                    "taskName": "Team Workload",
                    "description": f"Member {user_name} has {load} active tasks in progress.",
                    "mitigation": "Offload medium/low priority tasks to other team members."
                })

        return {"success": True, "risks": risks, "source": "ai"}
    except PyMongoError as e:
        logger.error(f"Database query failure on detect_risks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except Exception as e:
        logger.error(f"Unexpected crash in detect_risks: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/estimate/deadline")
def estimate_deadline(data: EstimateDeadlineInput):
    """Calculates completion dates based on remaining task workloads and team bandwidth."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    project_id = parse_object_id(data.projectId, "projectId")
    workspace_id = parse_object_id(data.workspaceId, "workspaceId")

    try:
        tasks = list(db.tasks.find({"projectId": project_id}))
        total_remaining_hours = 0.0
        completed_tasks = 0

        for t in tasks:
            if t.get("status") == "DONE":
                completed_tasks += 1
            else:
                est = float(t.get("estimatedHours") or 8.0)
                act = float(t.get("loggedHours") or 0.0)
                total_remaining_hours += max(0.0, est - act)

        members_count = db.members.count_documents({"workspaceId": workspace_id})
        devs = max(1, members_count)

        # Average hours completed per developer per day
        velocity_per_dev_day = 6.0
        total_daily_output = devs * velocity_per_dev_day
        days_required = math.ceil(total_remaining_hours / total_daily_output) if total_daily_output > 0 else 1

        predicted_date = datetime.utcnow() + timedelta(days=days_required)
        progress = (completed_tasks / len(tasks) * 100) if tasks else 100.0

        return {
            "predictedDeadline": predicted_date.isoformat(),
            "remainingHours": total_remaining_hours,
            "activeDevelopers": devs,
            "progressPercent": round(progress, 1),
            "confidence": 0.85 if total_remaining_hours > 0 else 1.0,
            "source": "ai"
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on estimate_deadline: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except Exception as e:
        logger.error(f"Unexpected crash in estimate_deadline: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/chat")
def ai_chat(data: ChatInput):
    """Dynamic context-aware AI assistant answering team queries and reporting real-time database stats."""
    if db is None:
        return {"role": "assistant", "content": "I am unable to query the database. Offline mode active."}

    try:
        prompt = data.message.lower()

        # Gather context stats
        workspace_stats = ""
        if data.workspaceId:
            workspace_id = parse_object_id(data.workspaceId, "workspaceId")
            workspace = db.workspaces.find_one({"_id": workspace_id})
            if workspace:
                proj_count = db.projects.count_documents({"workspaceId": workspace_id})
                member_count = db.members.count_documents({"workspaceId": workspace_id})
                
                workspace_tasks = list(db.tasks.find({"workspaceId": workspace_id}))
                total_tasks = len(workspace_tasks)
                completed_tasks = len([t for t in workspace_tasks if t.get("status") == "DONE"])
                in_progress = len([t for t in workspace_tasks if t.get("status") in ["IN_PROGRESS", "IN_REVIEW"]])
                
                workspace_stats = (
                    f"\n\nHere are some real-time statistics for your current workspace **'{workspace.get('name')}'**:\n"
                    f"- 📂 **Projects**: {proj_count} active project(s)\n"
                    f"- 👥 **Team Size**: {member_count} member(s)\n"
                    f"- 📋 **Task Summary**: {total_tasks} total tasks ({completed_tasks} completed, {in_progress} in progress)\n"
                )

        if "status" in prompt or "progress" in prompt or "how" in prompt and ("doing" in prompt or "project" in prompt):
            if workspace_stats:
                resp = (
                    f"Overall, the workspace project velocity looks stable. {workspace_stats}"
                    "Let me know if you would like me to detect project risks, suggest task priorities, or estimate delivery deadlines!"
                )
            else:
                resp = "You have an active and healthy project! Currently, I don't see any workspace context. Go ahead and select a workspace to get real-time statistics."
        elif "risk" in prompt or "warn" in prompt or "danger" in prompt:
            if data.workspaceId:
                workspace_id = parse_object_id(data.workspaceId, "workspaceId")
                overdue = list(db.tasks.find({
                    "workspaceId": workspace_id,
                    "status": {"$ne": "DONE"},
                    "dueDate": {"$lt": datetime.utcnow()}
                }))
                if overdue:
                    resp = f"⚠️ **Attention Needed**: Found {len(overdue)} overdue task(s) in this workspace. Review the tasks list to avoid missing delivery milestones!"
                else:
                    resp = "✅ **Good news!** No overdue tasks or major delivery risks detected in the active workspace context."
            else:
                resp = "I can analyze delivery risks! Please select or open a workspace so I can check for bottleneck workloads and overdue tasks."
        elif "hello" in prompt or "hi" in prompt:
            resp = (
                "Hello! I am Evolvian AI, your project intelligence assistant. 🚀\n"
                "I can analyze workspace velocity, plan sprints, predict completion risk, recommend developer assignments, and auto-generate task breakdowns.\n"
                f"{workspace_stats if workspace_stats else 'Select a workspace and ask me anything about your team activity!'}"
            )
        else:
            resp = (
                f"I processed your query: *\"{data.message}\"*\n\n"
                f"Currently I am running in production-ready heuristic mode. {workspace_stats or ''}\n"
                "Is there any specific action you'd like me to perform? For example: 'Generate tasks for login UI' or 'Analyze member performance'."
            )

        return {"role": "assistant", "content": resp}
    except Exception as e:
        logger.error(f"Chat execution handler crash: {e}")
        return {"role": "assistant", "content": f"Sorry, I ran into an error generating that response: {str(e)}"}

@app.get("/insights")
def get_insights(workspaceId: Optional[str] = None):
    """Calculates overall workspace performance metrics for the main widget view."""
    if db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection pool is offline"
        )

    try:
        velocity_str = "0 tasks/wk"
        risk_str = "Low"
        efficiency_str = "100%"
        forecast_str = "On Track"

        if workspaceId:
            workspace_id = parse_object_id(workspaceId, "workspaceId")
            tasks = list(db.tasks.find({"workspaceId": workspace_id}))
            if tasks:
                total_count = len(tasks)
                completed = [t for t in tasks if t.get("status") == "DONE"]
                completed_count = len(completed)

                velocity_str = f"{completed_count} tasks"

                # Check risks
                now = datetime.utcnow()
                overdue_count = 0
                for t in tasks:
                    due = t.get("dueDate")
                    if due and isinstance(due, datetime) and due < now and t.get("status") != "DONE":
                        overdue_count += 1

                if overdue_count >= 3:
                    risk_str = "High"
                    forecast_str = "At Risk"
                elif overdue_count > 0:
                    risk_str = "Medium"
                    forecast_str = "Needs Review"
                
                # Compute actual efficiency
                total_est = sum(float(t.get("estimatedHours") or 0) for t in completed)
                total_act = sum(float(t.get("loggedHours") or 0) for t in completed)
                if total_est > 0:
                    efficiency = min(100.0, max(40.0, (total_est / total_act) * 100.0 if total_act > 0 else 100.0))
                    efficiency_str = f"{round(efficiency)}%"

        return {
            "success": True,
            "insights": {
                "velocity": velocity_str,
                "riskLevel": risk_str,
                "efficiency": efficiency_str,
                "deliveryForecast": forecast_str
            }
        }
    except PyMongoError as e:
        logger.error(f"Database query failure on get_insights: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal database transaction failure"
        )
    except Exception as e:
        logger.error(f"Unexpected crash in get_insights: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
