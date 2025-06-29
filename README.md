
# FinInsight 
**AI Powered Financial Clarity**

##  Overview  
FinInsight is a full-stack AI-powered web application designed to help users manage their personal finances intelligently and securely. Users can add, edit, categorize, and track transactions, visualize financial trends, and receive personalized insights powered by Google's Gemini 1.5 Pro.

---

##  Tech Stack  

**Frontend:**  
- React 19  
- TailwindCSS  
- React Router DOM  
- Chart.js / Recharts  
- Framer Motion  

**Backend:**  
- Flask  
- Flask-JWT-Extended  
- PyMongo  
- RESTful APIs  
- Google Generative AI SDK  

**Database:**  
- MongoDB Atlas  

---

##  Features  
- JWT Authentication and OTP-based password recovery  
- Real-time income & expense tracking  
- Daily, Monthly, Yearly filters with sorting  
- Financial charts & summaries (line, pie, cards)  
- AI-generated insights from transaction patterns  
- Dark mode support for improved accessibility  

---

##  Screenshots  

(Add your screenshots in the `assets/` folder and reference them below)

### Welcome Page
![WelcomePage](assets/WelcomePage.png)

### Login Page
![Login](assets/Login.png)

### SignUp Page
![Sign Up](assets/SignUp.png)

### Forgot Password Page
![Forgot Password](assets/otp (1).png)
![Forgot Password](assets/otp (2).png)

### Transaction Page
![Transactions](assets/Transactions.png)

###Add Transaction 
![Add Transaction](assets/AddTran.png)

###Stats (Breakdown) 
![Breakdown](assets/Stats(4).png)

###Stats (Trends) 
![Line Chart](assets/Stats (5).png)
![Pie Chart (Income)](assets/Stats (3).png)
![Pie Chart (Expense)](assets/Stats (2).png)

###Stats (AI Insights) 
![Ai Insights](assets/Stats (1).png)

---

## 🛠️ Installation  

### Backend  
```bash  
cd backend  
pip install -r requirements.txt  
```

Create a `.env` file inside `/backend`:

```env
MONGO_URI=your_mongodb_uri  
JWT_SECRET_KEY=your_jwt_key  
GOOGLE_API_KEY=your_google_api_key  
```

Run the backend:

```bash  
python app.py  
```

### Frontend  

```bash  
cd frontend  
npm install  
npm run dev  
```

---

## 📁 Project Structure  

```
saijeevan25-fininsight/  
├── backend/  
│   ├── routes/, models/, utils/  
├── frontend/  
│   ├── src/  
│   │   ├── Pages/, Components/, utils/  
│   └── public/  
```

---

## 🧠 AI Integration  

The AI component uses Gemini 1.5 Pro to:  
- Summarize spending patterns  
- Suggest savings tips  
- Detect anomalies in transactions  

Implemented in:  
- Frontend: `AIInsights.jsx`  
- Backend: `insights.py`  

---

## 🔐 Environment Variables  

```env
MONGO_URI=your_mongodb_uri  
JWT_SECRET_KEY=your_jwt_secret  
GOOGLE_API_KEY=your_gemini_api_key  
```

---

## 👥 Contributors  
- Ashish Pathak   
- Battiprolu Sai Jeevan 
---

