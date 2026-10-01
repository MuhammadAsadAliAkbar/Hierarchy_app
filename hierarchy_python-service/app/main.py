from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
import random

app = FastAPI(
    title="Hierarchy Analytics Service",
    description="Python analytics for Employee Hierarchy Management",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeInput(BaseModel):
    id: str
    name: str
    designation: str
    parent_id: Optional[str] = None
    children_count: int = 0


@app.get("/")
def root():
    return {
        "service": "Hierarchy Analytics (Python)",
        "status": "running",
        "endpoints": ["/org-health", "/analyze-span", "/validate-hierarchy", "/health"],
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/org-health")
def org_health():
    """Sample organizational health metrics."""
    return {
        "success": True,
        "data": {
            "span_of_control": random.choice(["Healthy", "Overloaded", "Underutilized"]),
            "avg_team_size": round(random.uniform(2.5, 6.0), 1),
            "levels_count": 5,
            "total_employees_estimate": random.randint(12, 40),
            "ceo_direct_reports": random.randint(2, 5),
            "recommendation": random.choice([
                "Managers have healthy team sizes (3-7 reports).",
                "Some Team Leads have too many direct reports. Consider promoting a Junior.",
                "Good hierarchy depth. Keep span of control under 8.",
                "Add more Team Leads under Project Managers to balance load.",
            ]),
            "score": random.randint(60, 95),
            "generated_at": datetime.utcnow().isoformat(),
        },
    }


@app.post("/analyze-span")
def analyze_span(nodes: List[NodeInput]):
    """Analyze span of control from provided hierarchy nodes."""
    if not nodes:
        return {"success": True, "data": {"message": "No nodes provided"}}

    by_parent = {}
    for n in nodes:
        pid = n.parent_id or "ROOT"
        by_parent.setdefault(pid, []).append(n)

    spans = []
    overloaded = []
    for pid, children in by_parent.items():
        count = len(children)
        manager_name = next((n.name for n in nodes if n.id == pid), "Root/CEO")
        spans.append({"manager": manager_name, "direct_reports": count})
        if count > 7:
            overloaded.append({"manager": manager_name, "count": count})

    avg_span = sum(s["direct_reports"] for s in spans) / len(spans) if spans else 0

    return {
        "success": True,
        "data": {
            "average_span": round(avg_span, 2),
            "spans": spans,
            "overloaded_managers": overloaded,
            "recommendation": (
                "Some managers have >7 direct reports. Consider restructuring."
                if overloaded
                else "Span of control looks healthy."
            ),
        },
    }


@app.post("/validate-hierarchy")
def validate_hierarchy(nodes: List[NodeInput]):
    """Basic hierarchy validation rules."""
    issues = []
    ceo_count = sum(1 for n in nodes if n.designation == "CEO")
    if ceo_count == 0:
        issues.append("No CEO found")
    if ceo_count > 1:
        issues.append(f"Multiple CEOs found ({ceo_count})")

    allowed = {
        "CEO": [],
        "Manager": ["CEO"],
        "Project Manager": ["Manager", "CEO"],
        "Team Lead": ["Project Manager", "Manager"],
        "Junior": ["Team Lead", "Project Manager"],
        "Associate": ["Team Lead", "Project Manager"],
        "Intern": ["Team Lead", "Junior", "Associate", "Project Manager"],
    }

    id_map = {n.id: n for n in nodes}
    for n in nodes:
        if n.designation == "CEO":
            if n.parent_id:
                issues.append(f"CEO {n.name} should not have a parent")
        else:
            if not n.parent_id:
                issues.append(f"{n.designation} {n.name} has no parent")
            elif n.parent_id in id_map:
                parent = id_map[n.parent_id]
                if parent.designation not in allowed.get(n.designation, []):
                    issues.append(
                        f"{n.name} ({n.designation}) reports to {parent.name} ({parent.designation}) — invalid"
                    )

    return {
        "success": True,
        "data": {
            "valid": len(issues) == 0,
            "issues": issues,
            "nodes_checked": len(nodes),
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
