import pytest
from app.services.policy import BudgetPolicy, validate_draft_budget

def test_budget_within_cap():
    validate_draft_budget(300, BudgetPolicy())

def test_budget_over_cap_rejected():
    with pytest.raises(ValueError):
        validate_draft_budget(500, BudgetPolicy())
