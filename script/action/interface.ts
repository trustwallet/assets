// An action for a check, fix, or update, or a combination.
export interface ActionInterface {
    getName(): string;
    check(): string;
    fix(): Promise<void>;
    update(): Promise<void>;
}
