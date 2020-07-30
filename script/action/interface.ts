// A single check step
export interface CheckStepInterface {
    getName(): string;
    // return error or null/empty on success
    check(): Promise<string>;
}

// An action for a check, fix, or update, or a combination.
export interface ActionInterface {
    getName(): string;
    // return check steps for check (0, 1, or more)
    getChecks(): CheckStepInterface[];
    fix(): Promise<void>;
    update(): Promise<void>;
}
