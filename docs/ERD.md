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
