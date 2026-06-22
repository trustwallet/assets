# TRELA/TRLA Database ERD

```mermaid
erDiagram
  users { uuid id string name string email UserRole role datetime created_at }
  developers ||--o{ projects : builds
  projects ||--o{ properties : contains
  properties ||--|| property_financials : has
  properties ||--|| property_healthcare : has
  properties ||--|| property_accessibility : has
  properties ||--|| property_airport_access : has
  properties ||--|| property_safety : has
  properties ||--|| property_expat_community : has
  properties ||--|| property_management : has
  properties ||--|| property_lifestyle : has
  properties ||--|| property_scores : calculated_as
  properties ||--o{ property_media : stores

  retirees ||--|| financial_profiles : has
  retirees ||--|| visa_requirements : has
  retirees ||--|| property_preferences : has
  retirees ||--|| healthcare_preferences : has
  retirees ||--|| lifestyle_preferences : has
  retirees ||--|| travel_preferences : has
  retirees ||--o{ activities : records
  retirees ||--o{ tasks : owns
  retirees ||--o{ notes : captures
  email_templates { uuid id string name string subject string category datetime created_at }
```

Phase 2 matching is computed dynamically by comparing `retirees` and their preference tables against `properties`, `projects`, `property_financials`, and `property_scores`.

## Phase 3 Platform Expansion

```mermaid
erDiagram
  retirees ||--o{ ai_conversations : asks
  ai_prompts ||--o{ ai_conversations : powers
  retirees ||--o{ ai_recommendations : receives
  properties ||--o{ ai_recommendations : recommended
  retirees ||--o{ client_shortlists : saves
  properties ||--o{ client_shortlists : shortlisted
  retirees ||--o{ documents : uploads
  documents ||--o{ document_access_logs : audits
  retirees ||--o{ visa_workflows : tracks
  workflow_automations ||--o{ workflow_runs : triggers
  retirees ||--o{ appointments : schedules
  retirees ||--o{ communications : records
  retirees ||--o{ portfolio_holdings : owns
  properties ||--o{ portfolio_holdings : held_as
  properties ||--o{ rental_analytics : measures
  developers ||--o{ developer_submissions : submits
  report_jobs { uuid id ReportType report_type ReportFormat format string status }
  audit_logs { uuid id PortalRole actor_role string action string entity datetime created_at }
  ai_knowledge_base { uuid id string category string title string region int version }
```

Multi-region fields are added to `projects` and `properties` (`country`, `province`, `region`, `city`, `submarket`) so TRLA can expand beyond Phuket into Hua Hin, Koh Samui, Pattaya, Chiang Mai, Bangkok, Krabi, and future international markets.
