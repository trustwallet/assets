export interface ValidatorModel {
    id: string,
    name: string,
    description: string,
    website: string,
    staking: Staking
    payout: Payout
    status: ValidatorStatus
}

interface Staking {
  freeSpace: number,
  minDelegation: number
  openForDelegation: boolean
}

interface Payout {
  commission: number // in %
  payoutDelay: number // in cycles
  payoutPeriod: number
}

interface ValidatorStatus {
  disabled: boolean;
  note: string;
}
