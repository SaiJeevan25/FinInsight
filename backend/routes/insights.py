import os
import json
import requests
import asyncio
from typing import List, Dict, Any
class FinancialInsightsGenerator:
    def __init__(self):
        """Initialize generator with Gemini 2.0 Flash model"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in environment variables.")
        
        self.model = "gemini-2.0-flash"
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
        print(f"✅ Initialized with model: {self.model}")

    async def generate_insights(self, financial_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate structured financial insights using Gemini 2.0 Flash via HTTP API"""
        try:
            # 📝 Build the user prompt
            user_prompt = f"""
You are a financial advisor AI. Analyze the following financial data and provide 7-10 clear insights covering:
1. Spending Behavior (categories, trends)
2. Savings Opportunities
3. Cash Flow Analysis
4. Anomaly Detection
5. Goal Progress
6. Personalized Tips

IMPORTANT: Return ONLY valid JSON in this exact format:
{{
  "insights": [
    {{
      "title": "Insight title",
      "type": "spending|savings|cashflow|anomaly|goal|tip",
      "description": "Detailed explanation",
      "severity": "info|success|warning|danger",
      "action": "Optional action"
    }}
  ]
}}

Data to analyze:
Current Period ({financial_data['current_period']['start_date']} to {financial_data['current_period']['end_date']}):
- Income: {financial_data['current_period']['income']}
- Expenses: {financial_data['current_period']['expenses']}
- Savings: {financial_data['current_period']['savings']}
- Savings Rate: {financial_data['current_period']['savings_rate']}%

Previous Period ({financial_data['previous_period']['start_date']} to {financial_data['previous_period']['end_date']}):
- Income: {financial_data['previous_period']['income']}
- Expenses: {financial_data['previous_period']['expenses']}
- Savings: {financial_data['previous_period']['savings']}

Category Breakdown:
{self._format_category_breakdown(financial_data['category_breakdown'])}

Income Sources:
{self._format_income_breakdown(financial_data['income_breakdown'])}
"""

            # 📦 Payload matches curl structure
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": user_prompt}
                        ]
                    }
                ]
            }

            # 🌐 Headers & request
            headers = {
                "Content-Type": "application/json",
                "X-goog-api-key": self.api_key
            }

            response = requests.post(self.endpoint, headers=headers, json=payload)

            # ✅ Handle API response
            if response.status_code != 200:
                print(f"❌ API Error {response.status_code}: {response.text}")
                return []

            data = response.json()

            # 📤 Extract text from Gemini response
            try:
                content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            except (KeyError, IndexError):
                print("❌ Response did not contain expected format.")
                print(json.dumps(data, indent=2))
                return []

            # 📦 Parse JSON inside model response (if present)
            json_data = self._extract_json(content)
            if not json_data:
                print("❌ No valid JSON found in model output.")
                return []

            insights = json_data.get("insights", [])
            if not self._validate_insights(insights):
                print("❌ Invalid insights structure.")
                return []

            return insights

        except Exception as e:
            print(f"❌ Error generating insights: {str(e)}")
            return []

    # 🔍 Helper methods
    def _extract_json(self, content: str) -> Dict[str, Any]:
        """Extract JSON from AI response text"""
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            try:
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    return json.loads(content[json_start:json_end])
            except Exception:
                pass
        return {}

    def _validate_insights(self, insights: List[Dict[str, Any]]) -> bool:
        """Validate structure of insights"""
        if not isinstance(insights, list):
            return False

        required_keys = {"title", "type", "description", "severity"}
        valid_types = {"spending", "savings", "cashflow", "anomaly", "goal", "tip"}

        for insight in insights:
            if not isinstance(insight, dict):
                return False
            if not required_keys.issubset(insight.keys()):
                return False
            if insight["type"] not in valid_types:
                return False
        return True

    def _format_category_breakdown(self, categories: List[Dict[str, Any]]) -> str:
        return "\n".join([f"- {c['category']}: {c['amount']} ({c['percentage']}%)" for c in categories])

    def _format_income_breakdown(self, income: List[Dict[str, Any]]) -> str:
        return "\n".join([f"- {i['category']}: {i['amount']} ({i['percentage']}%)" for i in income])

    def categorize_insights(self, insights: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Organize insights by type for UI display"""
        categorized = {
            "spending": [],
            "savings": [],
            "cashflow": [],
            "anomalies": [],
            "goals": [],
            "tips": []
        }
        for insight in insights:
            t = insight["type"].lower()
            if t == "spending":
                categorized["spending"].append(insight)
            elif t == "savings":
                categorized["savings"].append(insight)
            elif t == "cashflow":
                categorized["cashflow"].append(insight)
            elif t == "anomaly":
                categorized["anomalies"].append(insight)
            elif t == "goal":
                categorized["goals"].append(insight)
            elif t == "tip":
                categorized["tips"].append(insight)
        return categorized
