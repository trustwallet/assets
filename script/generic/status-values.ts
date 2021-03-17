// see https://developer.trustwallet.com/add_new_asset
const StatusValues: string[] = [
    'active',
    'spam',
    'abandoned'
];

export function isValidStatusValue(value: string): boolean {
    if (!value) {
        return false;
    }
    if (!StatusValues.find(e => e === value)) {
        return false;
    }
    return true;
}
