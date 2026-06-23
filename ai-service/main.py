from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "PredictFlow AI Flask"})

@app.route("/predict/completion", methods=["POST"])
def predict_completion():
    req = request.json
    return jsonify({
        "success": True,
        "prediction": {
            "taskId": req.get("taskId"),
            "estimatedDaysRemaining": 3,
            "confidenceScore": 0.85,
            "riskLevel": "LOW"
        }
    })

@app.route("/recommend/team", methods=["POST"])
def recommend_team():
    req = request.json
    return jsonify({
        "success": True,
        "recommendations": [
            {
                "role": "Frontend Developer",
                "skillsMatch": ["React", "Next.js"],
                "suggestedMemberId": "mock-member-1"
            }
        ]
    })

@app.route("/analyze/performance", methods=["POST"])
def analyze_performance():
    req = request.json
    return jsonify({
        "success": True,
        "performance": {
            "productivityScore": 92,
            "tasksCompletedOnTime": 15,
            "overdueTasks": 2,
            "strengths": ["Speed", "Communication"],
            "areasForImprovement": ["Documentation"]
        }
    })

@app.route("/generate/tasks", methods=["POST"])
def generate_tasks():
    req = request.json
    return jsonify({
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
    })

@app.route("/insights", methods=["GET"])
def get_insights():
    return jsonify({
        "success": True,
        "insights": {
            "velocity": "124 pt",
            "riskLevel": "Low",
            "efficiency": "92%",
            "deliveryForecast": "Nov 12"
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
