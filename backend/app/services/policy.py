from dataclasses import dataclass

@dataclass
class BudgetPolicy:
    monthly_cap_bdt: int = 10_000
    daily_cap_bdt: int = 333
    auto_budget_increase_enabled: bool = False
    require_approval_for_launch: bool = True

def validate_draft_budget(daily_budget_bdt: int, policy: BudgetPolicy) -> None:
    if daily_budget_bdt <= 0:
        raise ValueError("Daily budget must be positive.")
    if daily_budget_bdt > policy.daily_cap_bdt:
        raise ValueError(f"Daily budget exceeds configured cap of BDT {policy.daily_cap_bdt}.")
