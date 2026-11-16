
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Building2, Plus, RefreshCw, Save, X } from "lucide-react";

type Business = {
  id: string;
  owner_user_id: string;
  name: string;
  business_type: string;
  country_code: string;
  currency: string;
  timezone: string;
  created_at: string;
};

export default function BusinessesPanel() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("ecommerce");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBusinesses() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const { data, error: queryError } = await supabase
        .from("businesses")
        .select(
          "id, owner_user_id, name, business_type, country_code, currency, timezone, created_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setBusinesses((data ?? []) as Business[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load businesses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function createBusiness(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please sign in again.");

      const { error: insertError } = await supabase
        .from("businesses")
        .insert({
          owner_user_id: user.id,
          name: name.trim(),
          business_type: businessType,
          country_code: "BD",
          currency: "BDT",
          timezone: "Asia/Dhaka",
        });

      if (insertError) throw insertError;

      setName("");
      setBusinessType("ecommerce");
      setMessage("Business successfully saved to Supabase.");

      await loadBusinesses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create business."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateBusiness(id: string) {
    if (!editName.trim()) {
      setError("Business name cannot be empty.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await supabase
        .from("businesses")
        .update({ name: editName.trim() })
        .eq("id", id);

      if (updateError) throw updateError;

      setEditingId(null);
      setEditName("");
      setMessage("Business name updated.");

      await loadBusinesses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update business."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h2>Business management</h2>
          <p>Create and manage your business workspaces.</p>
        </div>

        <button
          className="button button-light"
          onClick={loadBusinesses}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="notice">
          <span>{message}</span>
          <button onClick={() => setMessage("")} type="button">
            <X size={15} />
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            background: "#fff0f0",
            color: "#b42318",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      <div className="business-create-box">
        <h3>
          <Plus size={17} /> Add a new business
        </h3>

        <form onSubmit={createBusiness} className="form">
          <label>
            Business name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Fashion Store"
            />
          </label>

          <label>
            Business type
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            >
              <option value="ecommerce">E-commerce</option>
              <option value="retail">Retail</option>
              <option value="service">Services</option>
              <option value="agency">Marketing agency</option>
              <option value="other">Other</option>
            </select>
          </label>

          <button
            className="button button-primary"
            type="submit"
            disabled={saving}
          >
            <Plus size={15} />
            {saving ? "Saving..." : "Create business"}
          </button>

          <small>
            New businesses use Bangladesh, BDT, and Asia/Dhaka by default.
          </small>
        </form>
      </div>

      <div className="business-list-heading">
        <h3>Your businesses</h3>
        <span>{businesses.length} business(es)</span>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading businesses from Supabase...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="empty-state">
          <Building2 size={35} />
          <h3>No businesses yet</h3>
          <p>Create your first business using the form above.</p>
        </div>
      ) : (
        <div className="business-list">
          {businesses.map((business) => (
            <div className="business-row" key={business.id}>
              <div className="store-icon">
                <Building2 size={19} />
              </div>

              <div className="business-details">
                {editingId === business.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    aria-label="Edit business name"
                  />
                ) : (
                  <strong>{business.name}</strong>
                )}

                <small>
                  {business.business_type} · {business.currency} ·{" "}
                  {business.timezone}
                </small>
              </div>

              {editingId === business.id ? (
                <div className="business-actions">
                  <button
                    className="approve-button"
                    onClick={() => updateBusiness(business.id)}
                    disabled={saving}
                    type="button"
                  >
                    <Save size={14} /> Save
                  </button>

                  <button
                    className="icon-button"
                    onClick={() => setEditingId(null)}
                    type="button"
                    aria-label="Cancel editing"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  className="approve-button"
                  onClick={() => {
                    setEditingId(business.id);
                    setEditName(business.name);
                  }}
                  type="button"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
