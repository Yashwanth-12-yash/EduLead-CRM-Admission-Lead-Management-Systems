# 🎓 EduLead CRM — Admission Lead Management System

> A modern full-stack CRM platform designed to help educational institutions manage admission leads, counsellor assignments, follow-ups, applications, conversions, and performance analytics from a single centralized system.

---

## 📌 Project Overview

**EduLead CRM** is an Admission Lead Management System built to solve the challenges faced by educational institutions when handling admission enquiries from multiple channels.

Educational institutions receive leads through:

* 🌐 Website
* 🚶 Walk-ins
* 📞 Phone Calls
* 💬 WhatsApp
* 📱 Instagram
* 📘 Facebook
* 📢 Google Ads
* 🎓 Education Fairs
* 🤝 Referrals
* 📣 Marketing Campaigns

EduLead CRM centralizes these leads and provides a complete workflow from the first enquiry to final admission conversion.

### Lead Lifecycle

```text
NEW
 ↓
ASSIGNED
 ↓
CONTACTED
 ↓
INTERESTED
 ↓
FOLLOW-UP
 ↓
APPLICATION STARTED
 ↓
APPLICATION SUBMITTED
 ↓
ADMISSION CONFIRMED
 ↓
CONVERTED
```

Leads that do not proceed can be marked as:

```text
NOT INTERESTED
LOST
```

---

# 🎯 Business Problem

Managing admission enquiries using spreadsheets, phone calls, WhatsApp messages, and disconnected systems can result in:

* Missed follow-ups
* Duplicate leads
* Unassigned leads
* Delayed responses
* Poor counsellor visibility
* Difficulty tracking lead ageing
* Lack of conversion insights
* Poor campaign performance tracking
* Difficulty measuring counsellor performance

EduLead CRM addresses these problems by providing a centralized admission management platform.

---

# 🚀 Key Features

## 📊 Management Dashboard

Provides managers with a complete overview of admission operations.

### Dashboard KPIs

* Total Leads
* New Leads
* Contacted Leads
* Interested Leads
* Follow-ups Due
* Overdue Follow-ups
* Applications
* Converted Admissions
* Conversion Rate

### Analytics

* Lead Pipeline
* Lead Source Performance
* Course Demand
* Counsellor Performance
* Lead Ageing
* Conversion Funnel
* Recent Activities
* Actionable Business Insights

---

# 👥 Lead Management

Create and manage admission leads from multiple sources.

### Lead Information

* Student Name
* Phone Number
* Email
* City
* State
* Qualification
* Passing Year
* Interested Course
* Preferred Campus
* Preferred Intake
* Budget
* Lead Source
* Campaign
* Assigned Counsellor
* Status
* Priority
* Remarks

### Lead Operations

* Create Lead
* Edit Lead
* Delete Lead
* View Lead
* Search Lead
* Filter Leads
* Sort Leads
* Assign Counsellor
* Change Status
* Change Priority
* Bulk Assignment
* CSV Import
* CSV Export

---

# 🔄 Lead Pipeline

The system tracks leads through the complete admission lifecycle.

```text
┌──────────────┐
│     NEW      │
└──────┬───────┘
       ↓
┌──────────────┐
│   ASSIGNED   │
└──────┬───────┘
       ↓
┌──────────────┐
│  CONTACTED   │
└──────┬───────┘
       ↓
┌──────────────┐
│  INTERESTED  │
└──────┬───────┘
       ↓
┌──────────────┐
│  FOLLOW-UP   │
└──────┬───────┘
       ↓
┌──────────────────────┐
│ APPLICATION STARTED  │
└──────────┬───────────┘
           ↓
┌────────────────────────┐
│ APPLICATION SUBMITTED  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ ADMISSION CONFIRMED    │
└───────────┬────────────┘
            ↓
┌──────────────┐
│  CONVERTED   │
└──────────────┘
```

---

# 👨‍💼 Counsellor Management

Managers can monitor and manage counsellor workloads.

### Counsellor Information

* Name
* Email
* Phone
* Active Leads
* Follow-ups
* Applications
* Conversions
* Conversion Rate
* Account Status

### Counsellor Features

* Assign Leads
* Reassign Leads
* View Performance
* Track Follow-ups
* Manage Activities
* Monitor Conversions

---

# ⚡ Automatic Lead Assignment

The system supports intelligent lead assignment based on counsellor workload.

Example:

```text
Priya Sharma → 32 active leads
Arun Kumar   → 27 active leads
Ravi Raj     → 18 active leads
```

A new lead can be automatically assigned to the counsellor with the lowest active workload.

---

# 📅 Follow-up Management

Follow-ups are one of the most important parts of the system.

### Follow-up Categories

* Today's Follow-ups
* Upcoming
* Overdue
* Completed

### Follow-up Types

* 📞 Phone Call
* 💬 WhatsApp
* 📧 Email
* 🤝 Meeting
* 🏫 Campus Visit

### Follow-up Actions

* Create
* Edit
* Complete
* Reschedule
* Cancel

When a follow-up is completed, the system updates the lead's last contacted date and adds an activity to the lead timeline.

---

# ⏳ Lead Ageing

The system automatically calculates how long a lead has been active.

| Age        | Category            |
| ---------- | ------------------- |
| 0–3 Days   | 🟢 Fresh            |
| 4–7 Days   | 🟡 Attention        |
| 8–14 Days  | 🟠 Ageing           |
| 15–30 Days | 🔴 Critical         |
| 30+ Days   | 🔴 Severely Overdue |

This allows managers to identify leads that require immediate attention.

---

# 📝 Activity Timeline

Every important action performed on a lead is recorded.

### Activity Types

* Lead Created
* Lead Assigned
* Phone Call
* WhatsApp
* Email
* Meeting
* Counselling
* Note
* Application
* Payment
* Status Change
* Follow-up

Example:

```text
24 Sep 2026
Lead Created
Rahul Kumar submitted an enquiry through Website.

24 Sep 2026
Lead Assigned
Assigned to Priya Sharma.

24 Sep 2026
Phone Call
Student interested in BCA.

25 Sep 2026
WhatsApp
Course brochure sent.

26 Sep 2026
Follow-up Scheduled
Next call scheduled at 4:00 PM.
```

---

# 📈 Reports & Analytics

EduLead CRM provides reports to help management make data-driven decisions.

### Lead Source Performance

Compare:

* Website
* Walk-in
* Phone
* WhatsApp
* Instagram
* Facebook
* Google Ads
* Education Fair
* Referral
* Campaign

Metrics:

* Total Leads
* Applications
* Conversions
* Conversion Rate

---

## 👨‍💼 Counsellor Performance

Track:

* Assigned Leads
* Contacted Leads
* Interested Leads
* Applications
* Converted Admissions
* Conversion Rate

---

## 🎓 Course Demand

Analyze which courses receive the most enquiries.

Example:

```text
MBA      → 410 Leads
BCA      → 320 Leads
B.Tech   → 290 Leads
BBA      → 250 Leads
MCA      → 180 Leads
```

---

## 📊 Conversion Funnel

```text
Total Leads
     ↓
Contacted
     ↓
Interested
     ↓
Application
     ↓
Admission
     ↓
Converted
```

---

# 📣 Campaign Management

Track admission marketing campaigns.

### Campaign Metrics

* Campaign Name
* Source
* Start Date
* End Date
* Leads
* Applications
* Conversions
* Cost
* Conversion Rate
* Cost per Lead
* Cost per Conversion
* ROI

This helps identify which marketing campaigns generate the best admissions.

---

# 🔔 Notifications

The system provides notifications for important events.

Examples:

```text
🔔 New lead assigned to you.

⏰ Follow-up due today.

⚠️ Follow-up overdue by 2 days.

🎓 Application submitted.

🎉 Lead converted successfully.
```

Users can:

* View notifications
* Mark as read
* Mark all as read

---

# 🔐 Role-Based Access Control

EduLead CRM supports multiple user roles.

## 👑 Admin

Full system access.

Can manage:

* Users
* Leads
* Counsellors
* Courses
* Campaigns
* Reports
* Settings

---

## 👨‍💼 Manager

Can manage:

* Dashboard
* All Leads
* Lead Assignment
* Counsellors
* Follow-ups
* Courses
* Campaigns
* Reports

---

## 🧑‍💻 Counsellor

Can access:

* Personal Dashboard
* Assigned Leads
* Follow-ups
* Lead Details
* Activities
* Personal Performance

Counsellors cannot access other counsellors' restricted lead data.

---

# 🔎 Search & Filtering

The system provides powerful search and filtering capabilities.

### Search By

* Student Name
* Phone Number
* Email
* Lead ID

### Filter By

* Status
* Course
* Lead Source
* Counsellor
* Priority
* City
* Date
* Lead Age

---

# 📥 CSV Import & Export

Import large numbers of leads using CSV files.

### Supported CSV Fields

```text
Name
Phone
Email
City
Course
Source
Priority
Counsellor
Status
```

The system validates imported records and reports:

* Successful records
* Failed records
* Validation errors

Users can also export lead data as CSV.

---

# 🎨 User Interface

The application uses a modern SaaS-style interface.

### UI Characteristics

* Responsive design
* Modern dashboard
* Sidebar navigation
* Data tables
* KPI cards
* Charts
* Status badges
* Modal forms
* Toast notifications
* Loading states
* Empty states
* Error states
* Responsive mobile layout

The UI was initially designed using **Google Stitch** and implemented as a functional application.

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Modern component architecture
* Responsive UI
* Data visualization

## Backend

* API-based architecture
* Authentication
* Role-based authorization
* Business logic
* Lead management
* Follow-up management

## Database

* PostgreSQL

## Development Tools

* Git
* GitHub
* Visual Studio Code
* Google Stitch
* Google AI Studio

---

# 🏗️ Project Architecture

```text
edulead-crm/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── leads/
│   ├── followups/
│   ├── reports/
│   └── layout/
│
├── pages/
│   ├── Dashboard/
│   ├── Leads/
│   ├── FollowUps/
│   ├── Courses/
│   ├── Counsellors/
│   ├── Campaigns/
│   ├── Reports/
│   └── Settings/
│
├── services/
│   ├── auth/
│   ├── leads/
│   ├── courses/
│   ├── followups/
│   └── reports/
│
├── types/
│
├── hooks/
│
├── utils/
│
├── data/
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Yashwanth-12-yash/<repository-name>.git
```

Navigate into the project:

```bash
cd <repository-name>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=your_postgresql_database_url
API_URL=your_api_url
JWT_SECRET=your_secret_key
```

Do not commit `.env` files to GitHub.

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 🔑 Demo Roles

For development/testing, you can create accounts for:

```text
Admin
Manager
Counsellor
```

Use the application's authentication system to test role-based permissions.

---

# 🧪 Testing

Before deployment, verify:

* Login
* Role permissions
* Lead creation
* Lead editing
* Lead deletion
* Search
* Filters
* Lead assignment
* Status changes
* Follow-ups
* Activity timeline
* Lead ageing
* Dashboard analytics
* Reports
* Notifications
* CSV import/export
* Responsive design

---

# 🔮 Future Enhancements

Planned improvements include:

* 🤖 AI-based lead scoring
* 💬 WhatsApp Business API integration
* 📧 Automated email campaigns
* 📱 SMS notifications
* 🧠 AI-generated lead insights
* 🔔 Automated follow-up reminders
* 📊 Advanced predictive analytics
* 📥 Excel import
* 🔗 CRM integrations
* ☁️ Cloud deployment
* 📱 Progressive Web App
* 🔐 Advanced audit logs

---

# 💡 Example Business Insights

EduLead CRM can help management discover insights such as:

> "Referral leads have a higher conversion rate than paid campaigns."

> "25 high-priority leads have not received a follow-up."

> "MBA is currently the most requested course."

> "Counsellor Priya Sharma has the highest conversion rate."

> "Website leads generate the highest volume of enquiries."

These insights help institutions improve their admission strategy and counsellor productivity.

---

# 📸 Screenshots

Add project screenshots here:

### Dashboard

```text
Add dashboard screenshot
```

### Lead Management

```text
Add leads screenshot
```

### Lead Details

```text
Add lead details screenshot
```

### Follow-up Management

```text
Add follow-up screenshot
```

### Reports & Analytics

```text
Add reports screenshot
```

---

# 🌐 Project Workflow

```text
                    ┌──────────────────┐
                    │   Lead Sources   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ↓                    ↓                    ↓
     Website              Walk-in             WhatsApp
        ↓                    ↓                    ↓
        └────────────────────┼────────────────────┘
                             ↓
                    ┌──────────────────┐
                    │   Lead Created   │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Counsellor       │
                    │ Assignment       │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Contact &        │
                    │ Follow-up        │
                    └──────
```
