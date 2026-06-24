import { useState } from "react";
import { MdFilterList, MdSearch, MdClose, MdSort } from "react-icons/md";
import { getSubjectStyle } from "./AssignmentForm";

function FilterBar({ subjects, selected, onChange, search, onSearch, sortOrder, onSort, total, filtered }) {
  const subjectsOnly = subjects.filter((s) => s !== "All");

  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e0e7ff",
      boxShadow: "0 2px 10px rgba(55,48,163,0.06)",
      marginBottom: 16,
      overflow: "hidden",
    }}>
      {/* Top row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderBottom: subjectsOnly.length > 0 ? "1px solid #f3f4f6" : "none",
        flexWrap: "wrap",
      }}>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
          <MdSearch
            size={15} color="#9ca3af"
            style={{
              position: "absolute", left: 10, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 32px 8px 30px",
              border: "1.5px solid #e0e7ff", borderRadius: 8,
              fontSize: 12, fontFamily: "'Inter', sans-serif",
              color: "#374151", background: "#f9f8ff",
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.18s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e7ff";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#f9f8ff";
            }}
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              style={{
                position: "absolute", right: 8, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                cursor: "pointer", color: "#9ca3af",
                display: "flex", padding: 0,
              }}
            >
              <MdClose size={14} />
            </button>
          )}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => onSort(sortOrder === "newest" ? "oldest" : sortOrder === "oldest" ? "az" : "newest")}
          title="Cycle sort order"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "7px 12px",
            border: "1.5px solid #e0e7ff", borderRadius: 8,
            background: "#f9f8ff", cursor: "pointer",
            fontSize: 11, fontWeight: 700, color: "#6b7280",
            transition: "all 0.15s", whiteSpace: "nowrap",
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#a5b4fc";
            e.currentTarget.style.color = "#3730a3";
            e.currentTarget.style.background = "#f5f3ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e0e7ff";
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.background = "#f9f8ff";
          }}
        >
          <MdSort size={15} />
          {sortOrder === "newest" ? "Newest first" : sortOrder === "oldest" ? "Oldest first" : "A → Z"}
        </button>

        {/* Result count */}
        <span style={{
          fontSize: 11, color: "#9ca3af", fontWeight: 600,
          whiteSpace: "nowrap",
          marginLeft: "auto",
        }}>
          {filtered === total
            ? `${total} assignment${total !== 1 ? "s" : ""}`
            : `${filtered} of ${total}`}
        </span>
      </div>

      {/* Subject pill row */}
      {subjectsOnly.length > 0 && (
        <div style={{
          display: "flex", gap: 6, padding: "10px 16px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}>
          {/* All pill */}
          <button
            onClick={() => onChange("All")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 14px",
              border: `1.5px solid ${selected === "All" ? "#6366f1" : "#e0e7ff"}`,
              borderRadius: 99,
              background: selected === "All"
                ? "linear-gradient(135deg, #3730a3, #6366f1)"
                : "#f9f8ff",
              color: selected === "All" ? "#fff" : "#6b7280",
              fontWeight: selected === "All" ? 700 : 600,
              fontSize: 12, cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              fontFamily: "'Inter', sans-serif",
              flexShrink: 0,
            }}
          >
            All
          </button>

          {subjectsOnly.map((s) => {
            const st = getSubjectStyle(s);
            const isActive = selected === s;
            return (
              <button
                key={s}
                onClick={() => onChange(isActive ? "All" : s)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 13px",
                  border: `1.5px solid ${isActive ? st.dot : "#e0e7ff"}`,
                  borderRadius: 99,
                  background: isActive ? st.bg : "#f9f8ff",
                  color: isActive ? st.color : "#6b7280",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 12, cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  fontFamily: "'Inter', sans-serif",
                  flexShrink: 0,
                  boxShadow: isActive ? `0 2px 8px ${st.dot}33` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = st.bg;
                    e.currentTarget.style.borderColor = st.ring || st.dot;
                    e.currentTarget.style.color = st.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#f9f8ff";
                    e.currentTarget.style.borderColor = "#e0e7ff";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: st.dot, flexShrink: 0,
                }} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
