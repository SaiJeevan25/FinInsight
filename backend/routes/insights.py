import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class FinancialInsightsGenerator:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel("gemini-1.5-pro-latest")
            print("✅ Initialized with model: gemini-1.5-pro-latest")
        except Exception as e:
            print(f"❌ Model initialization error: {e}")
            self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
            print("⚠️ Falling back to model: gemini-1.5-flash-latest")

    async def generate_insights(self, financial_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            # Build user prompt with specific categories requested
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

            response = self.model.generate_content(user_prompt)
            content = response.text.strip()

            json_data = self._extract_json(content)
            if not json_data:
                print("❌ No valid insights found in response")
                return []
                
            insights = json_data.get("insights", [])
            if not self._validate_insights(insights):
                print("❌ Invalid insights structure received")
                return []
                
            return insights

        except Exception as e:
            print(f"❌ Error generating insights: {str(e)}")
            if 'content' in locals():
                print(f"Response content (first 500 chars): {content[:500]}")
            return []

    def _extract_json(self, content: str) -> Dict[str, Any]:
        """Extract JSON from response with multiple fallback methods"""
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
        """Validate the structure of insights"""
        if not isinstance(insights, list):
            return False
            
        required_keys = {"title", "type", "description", "severity"}
        valid_types = {"spending", "savings", "cashflow", "anomaly", "goal", "tip"}
        
        for insight in insights:
            if not isinstance(insight, dict):
                return False
            if not required_keys.issubset(insight.keys()):
                return False
            if insight['type'] not in valid_types:
                return False
        return True

    def _format_category_breakdown(self, categories: List[Dict[str, Any]]) -> str:
        return "\n".join([f"- {c['category']}: {c['amount']} ({c['percentage']}%)" for c in categories])

    def _format_income_breakdown(self, income: List[Dict[str, Any]]) -> str:
        return "\n".join([f"- {i['category']}: {i['amount']} ({i['percentage']}%)" for i in income])

    def categorize_insights(self, insights: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize insights into sections for UI display"""
        categorized = {
            "spending": [],
            "savings": [],
            "cashflow": [],
            "anomalies": [],
            "goals": [],
            "tips": []
        }

        for insight in insights:
            insight_type = insight['type'].lower()
            if insight_type == "spending":
                categorized["spending"].append(insight)
            elif insight_type == "savings":
                categorized["savings"].append(insight)
            elif insight_type == "cashflow":
                categorized["cashflow"].append(insight)
            elif insight_type == "anomaly":
                categorized["anomalies"].append(insight)
            elif insight_type == "goal":
                categorized["goals"].append(insight)
            elif insight_type == "tip":
                categorized["tips"].append(insight)

        return categorized