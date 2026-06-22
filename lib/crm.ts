export const leadStages = [
  'LEAD','QUALIFIED','CONSULTATION','VISA_PLANNING','PROPERTY_SEARCH','PROPERTY_SHORTLIST','PROPERTY_VIEWING','OFFER_SUBMITTED','CONTRACT_SIGNED','DEPOSIT_PAID','CLOSED','POST_PURCHASE'
] as const;
export const stageLabels: Record<string, string> = {
  LEAD: 'Lead', QUALIFIED: 'Qualified', CONSULTATION: 'Consultation', VISA_PLANNING: 'Visa Planning', PROPERTY_SEARCH: 'Property Search', PROPERTY_SHORTLIST: 'Property Shortlist', PROPERTY_VIEWING: 'Property Viewing', OFFER_SUBMITTED: 'Offer Submitted', CONTRACT_SIGNED: 'Contract Signed', DEPOSIT_PAID: 'Deposit Paid', CLOSED: 'Closed', POST_PURCHASE: 'Post Purchase'
};
export function fullName(retiree: { firstName: string; lastName: string }) { return `${retiree.firstName} ${retiree.lastName}`; }
