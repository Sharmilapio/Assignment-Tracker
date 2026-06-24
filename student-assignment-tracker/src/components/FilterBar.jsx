import { SelectPicker } from "rsuite";
import { MdFilterList } from "react-icons/md";

function FilterBar({ subjects, selected, onChange }) {
  const options = subjects.map((s) => ({ label: s, value: s }));

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      marginBottom: 16, padding: "10px 16px",
      background: "#fff", borderRadius: 12,
      border: "1px solid #e0e7ff",
      boxShadow: "0 2px 8px rgba(55,48,163,0.05)",
    }}>
      <MdFilterList size={20} color="#6366f1" />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e1b6e", fontFamily: "'Inter',sans-serif" }}>
        Filter by subject:
      </span>
      <SelectPicker
        data={options}
        value={selected}
        onChange={(val) => onChange(val || "All")}
        searchable={false}
        cleanable={false}
        style={{ width: 200 }}
        menuStyle={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default FilterBar;