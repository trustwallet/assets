// A single check step
export interface CheckStepInterface {
    getName(): string;
    // return [errors, warnings]
    check(): Promise<[string[], string[]]>;
}

// An action for a check, fix, or update, or a combination.
export interface ActionInterface {
    getName(): string;
    // return check steps for sanity check (0, 1, or more)
    getSanityChecks(): CheckStepInterface[];
    // return check steps for consistenct check (0, 1, or more)
    getConsistencyChecks?(): CheckStepInterface[];
    sanityFix?(): Promise<void>;
    consistencyFix?(): Promise<void>;
    updateAuto?(): Promise<void>; // For regular automatic updates (from external source)
    updateManual?(): Promise<void>; // For occasional manual updates (from external source)
}

export enum FixCheckMode {
    CheckSanityOnly = 1,
    CheckAll,
    FixSanityOnly,
    FixAll
}
