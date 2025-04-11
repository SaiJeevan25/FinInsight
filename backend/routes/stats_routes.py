from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_user_transactions_collection
from datetime import datetime, timedelta
from collections import defaultdict

stats_bp = Blueprint('stats', __name__)

def generate_ai_insights(summary_data, trends_data, category_breakdown):
    """Generate AI insights based on financial data"""
    insights = []
    
    # Savings rate insight
    savings_rate = summary_data['savingsRate']
    if savings_rate > 50:
        insights.append({
            "type": "achievement",
            "title": "Savings Milestone",
            "description": f"Excellent savings rate of {savings_rate:.1f}%! Keep it up.",
            "severity": "success"
        })
    elif savings_rate < 20:
        insights.append({
            "type": "warning",
            "title": "Low Savings Rate",
            "description": f"Your savings rate is {savings_rate:.1f}%. Consider reducing expenses.",
            "severity": "warning"
        })
    
    # Expense change insight
    if trends_data['expenseChange'] > 10:
        insights.append({
            "type": "anomaly",
            "title": "Spending Increase",
            "description": f"Expenses increased by {trends_data['expenseChange']:.1f}% from last period.",
            "severity": "warning"
        })
    
    # Largest expense category insight
    if category_breakdown:
        largest_category = max(category_breakdown, key=lambda x: x['amount'])
        insights.append({
            "type": "observation",
            "title": "Largest Expense",
            "description": f"{largest_category['category']} accounts for {largest_category['percentage']:.1f}% of expenses.",
            "severity": "info"
        })
    
    return insights

@stats_bp.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_email = get_jwt_identity()
    transactions_collection = get_user_transactions_collection(current_user_email)
    
    try:
        # Get and validate parameters
        time_range = request.args.get('timeRange', 'month')  # month, quarter, year
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int, default=datetime.now().year)
        
        if not year:
            return jsonify({"error": "Year is required"}), 400
        
        # Calculate date ranges
        if time_range == "month":
            if not month:
                month = datetime.now().month
            start_date = datetime(year, month, 1)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            prev_start_date = (start_date - timedelta(days=1)).replace(day=1)
        elif time_range == "quarter":
            if not month:
                month = datetime.now().month
            quarter = (month - 1) // 3 + 1
            start_month = 3 * (quarter - 1) + 1
            start_date = datetime(year, start_month, 1)
            end_month = start_month + 2
            end_date = (datetime(year, end_month, 1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            prev_start_date = (datetime(year, start_month, 1) - timedelta(days=1)).replace(day=1)
        else:  # year
            start_date = datetime(year, 1, 1)
            end_date = datetime(year, 12, 31)
            prev_start_date = datetime(year-1, 1, 1)
        
        # Get transactions for current and previous periods
        current_transactions = list(transactions_collection.find({
            "date": {"$gte": start_date.strftime('%Y-%m-%d'), "$lte": end_date.strftime('%Y-%m-%d')}
        }, {"_id": 0}))
        
        prev_transactions = list(transactions_collection.find({
            "date": {"$gte": prev_start_date.strftime('%Y-%m-%d'), "$lte": (start_date - timedelta(days=1)).strftime('%Y-%m-%d')}
        }, {"_id": 0}))
        
        # Calculate summary data
        current_income = sum(t['amount'] for t in current_transactions if t['type'] == 'income')
        current_expenses = sum(t['amount'] for t in current_transactions if t['type'] == 'expense')
        current_savings = current_income - current_expenses
        current_savings_rate = (current_savings / current_income * 100) if current_income > 0 else 0
        
        # Calculate previous period data
        prev_income = sum(t['amount'] for t in prev_transactions if t['type'] == 'income')
        prev_expenses = sum(t['amount'] for t in prev_transactions if t['type'] == 'expense')
        prev_savings = prev_income - prev_expenses
        
        # Calculate trends
        income_change = ((current_income - prev_income) / prev_income * 100) if prev_income > 0 else 0
        expense_change = ((current_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses > 0 else 0
        savings_change = ((current_savings - prev_savings) / prev_savings * 100) if prev_savings > 0 else 0
        
        # Category breakdown
        expense_categories = defaultdict(float)
        for t in current_transactions:
            if t['type'] == 'expense':
                expense_categories[t['category']] += t['amount']
        
        total_expenses = sum(expense_categories.values())
        category_breakdown = [
            {
                "category": category,
                "amount": amount,
                "percentage": (amount / total_expenses * 100) if total_expenses > 0 else 0
            }
            for category, amount in expense_categories.items()
        ]
        income_sources = defaultdict(float)
        for t in current_transactions:
            if t['type'] == 'income':
                income_sources[t['category']] += t['amount']

        total_income = sum(income_sources.values())
        income_breakdown = [
            {
                "category": category,
                "amount": amount,
                "percentage": (amount / total_income * 100) if total_income > 0 else 0
            }
            for category, amount in income_sources.items()
        ]
                # Generate monthly/quarterly data
        # In the monthly data generation section of stats_routes.py
        monthly_data = {"income": [], "expenses": [], "savings": []}  # Fix the typo in "expenses"
        if time_range == "year":
            for m in range(1, 13):
                month_start = datetime(year, m, 1)
                month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                month_trans = [t for t in current_transactions if 
                            month_start <= datetime.strptime(t['date'], '%Y-%m-%d') <= month_end]
                month_income = sum(t['amount'] for t in month_trans if t['type'] == 'income') or 0
                month_exp = sum(t['amount'] for t in month_trans if t['type'] == 'expense') or 0
                monthly_data["income"].append(month_income)
                monthly_data["expenses"].append(month_exp)  # Fixed the key name
                monthly_data["savings"].append(month_income - month_exp)
        elif time_range == "quarter":
            quarter_months = range((month - 1) // 3 * 3 + 1, ((month - 1) // 3 + 1) * 3 + 1)
            for m in quarter_months:
                month_start = datetime(year, m, 1)
                month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                month_trans = [t for t in current_transactions if 
                            month_start <= datetime.strptime(t['date'], '%Y-%m-%d') <= month_end]
                month_income = sum(t['amount'] for t in month_trans if t['type'] == 'income') or 0
                month_exp = sum(t['amount'] for t in month_trans if t['type'] == 'expense') or 0
                monthly_data["income"].append(month_income)
                monthly_data["expenses"].append(month_exp)  # Fixed the key name
                monthly_data["savings"].append(month_income - month_exp)
        else:  # month
            # For monthly view, break down by weeks
            weeks_in_month = 4
            monthly_data = {"income": [], "expenses": [], "savings": []}
            for week in range(weeks_in_month):
                week_start = start_date + timedelta(days=7*week)
                week_end = week_start + timedelta(days=6)
                if week_end > end_date:
                    week_end = end_date
                week_trans = [t for t in current_transactions if 
                            week_start <= datetime.strptime(t['date'], '%Y-%m-%d') <= week_end]
                week_income = sum(t['amount'] for t in week_trans if t['type'] == 'income') or 0
                week_exp = sum(t['amount'] for t in week_trans if t['type'] == 'expense') or 0
                monthly_data["income"].append(week_income)
                monthly_data["expenses"].append(week_exp)
                monthly_data["savings"].append(week_income - week_exp)
        
        # Generate AI insights
        ai_insights = generate_ai_insights(
            {
                "income": current_income,
                "expenses": current_expenses,
                "savings": current_savings,
                "savingsRate": current_savings_rate
            },
            {
                "incomeChange": income_change,
                "expenseChange": expense_change,
                "savingsChange": savings_change
            },
            category_breakdown
        )
        
        return jsonify({
            "summary": {
                "income": current_income,
                "expenses": current_expenses,
                "savings": current_savings,
                "savingsRate": round(current_savings_rate, 2)
            },
            "trends": {
                "incomeChange": round(income_change, 2),
                "expenseChange": round(expense_change, 2),
                "savingsChange": round(savings_change, 2)
            },
            "categoryBreakdown": category_breakdown,  
            "incomeBreakdown": income_breakdown,     # Added income breakdown
            "monthlyData": monthly_data,
            "aiInsights": ai_insights
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500
