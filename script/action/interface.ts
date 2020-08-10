// A single check step
export interface CheckStepInterface {
    getName(): string;
    // return error or null/empty on success
    check(): Promise<string>;
}

// An action for a check, fix, or update, or a combination.
export interface ActionInterface {
    getName(): string;
    // return check steps for sanity check (0, 1, or more)
    getSanityChecks(): CheckStepInterface[];
    // return check steps for consistenct check (0, 1, or more)
    getConistencyChecks(): CheckStepInterface[];
    sanityFix(): Promise<void>;
    consistencyFix(): Promise<void>;
    update(): Promise<void>;
}
