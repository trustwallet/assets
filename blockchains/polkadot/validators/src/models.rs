use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidatorIds {
    pub value: Vec<String>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidatorIdentity {
    pub value: Option<IdentityValue>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdentityValue {
    pub deposit: String,
    pub info: IdentityInfo
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdentityInfo {
    pub display: IdentityInfoItem,
    pub legal: IdentityInfoItem,
    pub web: IdentityInfoItem,
    pub image: IdentityInfoItem
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdentityInfoItem {
    pub raw: Option<String>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidatorCommission {
    pub value: CommissionValue
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommissionValue {
    pub commission: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TrustValidator {
    pub id: String,
    pub name: String,
    pub description: String,
    pub website: String,
    pub commission: String,
    pub points: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ActiveEra {
    pub value: EraValue
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EraValue {
    pub index: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErasRewardPoints {
    pub value: RewardPointsValue
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RewardPointsValue {
    pub total: String,
    pub individual: HashMap<String, String>
}
