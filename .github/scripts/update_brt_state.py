#!/usr/bin/env python3
"""Refresh internal/brtserver/data/latest.json using CI-provided values."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path


def _load_optional_json(name: str):
    raw = os.getenv(name)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"{name} contained invalid JSON: {exc}") from exc


def _maybe_set(state: dict, key: str, env_var: str, cast):
    value = os.getenv(env_var)
    if value is None or value == "":
        return
    try:
        state[key] = cast(value)
    except ValueError as exc:
        raise SystemExit(f"Invalid value for {env_var}: {exc}") from exc


def main() -> None:
    state_path = Path("internal/brtserver/data/latest.json")
    if not state_path.exists():
        raise SystemExit(f"State file missing: {state_path}")

    state = json.loads(state_path.read_text())

    updated_at = os.getenv("BRT_UPDATED_AT")
    if updated_at:
        state["updated_at"] = updated_at
    else:
        state["updated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    _maybe_set(state, "collateral_ratio", "BRT_COLLATERAL_RATIO", float)
    _maybe_set(state, "max_supply", "BRT_MAX_SUPPLY", int)
    _maybe_set(state, "circulating_supply", "BRT_CIRCULATING_SUPPLY", int)
    _maybe_set(state, "btc_locked", "BRT_BTC_LOCKED", float)

    for key, env in (
        ("reserve_addresses", "BRT_RESERVE_ADDRESSES_JSON"),
        ("attestations", "BRT_ATTESTATIONS_JSON"),
        ("pending_mints", "BRT_PENDING_MINTS_JSON"),
        ("recent_burns", "BRT_RECENT_BURNS_JSON"),
    ):
        maybe = _load_optional_json(env)
        if maybe is not None:
            state[key] = maybe

    state_path.write_text(json.dumps(state, indent=4) + "\n")
    print(f"Updated {state_path} (timestamp={state['updated_at']})")


if __name__ == "__main__":
    main()
