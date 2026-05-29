import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AgentModal from "../components/AgentModal";
import { getListings, getRegions } from "../api/listingApi";

const FILTER_STORAGE_KEY = "re_filters";

function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { regions: [], priceMin: "", priceMax: "", areaMin: "", areaMax: "", bedrooms: "" };
  } catch {
    return { regions: [], priceMin: "", priceMax: "", areaMin: "", areaMax: "", bedrooms: "" };
  }
}

function saveFilters(filters) {
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
}

// Region dropdown
function RegionDropdown({ regions, selected, onApply, onClose }) {
  const [local, setLocal] = useState(selected);

  function toggle(id) {
    setLocal((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  }

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-[10px] shadow-[0px_2px_12px_rgba(2,21,38,0.16)] p-[24px] min-w-[390px]">
      <p className="font-bold text-[16px] mb-[24px] text-[#021526]">რეგიონის მიხედვით</p>
      <div className="grid grid-cols-3 gap-x-[32px] gap-y-[16px]">
        {regions?.map((r) => (
          <label key={r.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-[#45A849]"
              checked={local.includes(r.id)}
              onChange={() => toggle(r.id)}
            />
            <span className="text-[14px] text-[#021526]">{r.name}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-end mt-[24px]">
        <button
          className="bg-[#F93B1D] text-white rounded-[20px] px-[14px] py-[8px] text-[14px] font-medium hover:bg-[#DF3319] transition-colors"
          onClick={() => { onApply(local); onClose(); }}
        >
          არჩევა
        </button>
      </div>
    </div>
  );
}

// Price dropdown
function PriceDropdown({ priceMin, priceMax, onApply, onClose }) {
  const [min, setMin] = useState(priceMin);
  const [max, setMax] = useState(priceMax);
  const [error, setError] = useState("");
  const presets = [50000, 100000, 150000, 200000, 300000];

  function apply() {
    if (min && max && Number(min) > Number(max)) {
      setError("გთხოვთ შეიყვანოთ ვალიდური რიცხვები");
      return;
    }
    setError("");
    onApply(min, max);
    onClose();
  }

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-[10px] shadow-[0px_2px_12px_rgba(2,21,38,0.16)] p-[24px] min-w-[330px]">
      <p className="font-bold text-[16px] mb-[24px] text-[#021526]">ფასის მიხედვით</p>
      <div className="flex gap-[15px] mb-[8px]">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="დან"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="border border-[#808A93] rounded-[6px] w-full px-3 py-[10px] text-[14px] outline-none pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#021526]">₾</span>
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="დან"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="border border-[#808A93] rounded-[6px] w-full px-3 py-[10px] text-[14px] outline-none pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#021526]">₾</span>
        </div>
      </div>
      {error && <p className="text-[#F93B1D] text-[12px] mb-[8px]">{error}</p>}
      <div className="flex gap-[32px] mt-[16px]">
        <div>
          <p className="text-[14px] font-bold text-[#021526] mb-[12px]">მინ. ფასი</p>
          {presets.map((p) => (
            <p key={p} className="text-[14px] text-[#2D3648] cursor-pointer hover:text-[#021526] mb-[10px]" onClick={() => setMin(String(p))}>
              {p.toLocaleString()} ₾
            </p>
          ))}
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#021526] mb-[12px]">მაქს. ფასი</p>
          {presets.map((p) => (
            <p key={p} className="text-[14px] text-[#2D3648] cursor-pointer hover:text-[#021526] mb-[10px]" onClick={() => setMax(String(p))}>
              {p.toLocaleString()} ₾
            </p>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-[16px]">
        <button
          className="bg-[#F93B1D] text-white rounded-[20px] px-[14px] py-[8px] text-[14px] font-medium hover:bg-[#DF3319] transition-colors"
          onClick={apply}
        >
          არჩევა
        </button>
      </div>
    </div>
  );
}

// Area dropdown
function AreaDropdown({ areaMin, areaMax, onApply, onClose }) {
  const [min, setMin] = useState(areaMin);
  const [max, setMax] = useState(areaMax);
  const [error, setError] = useState("");
  const presets = [50000, 50000, 50000, 50000, 50000];

  function apply() {
    if (min && max && Number(min) > Number(max)) {
      setError("გთხოვთ შეიყვანოთ ვალიდური რიცხვები");
      return;
    }
    setError("");
    onApply(min, max);
    onClose();
  }

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-[10px] shadow-[0px_2px_12px_rgba(2,21,38,0.16)] p-[24px] min-w-[330px]">
      <p className="font-bold text-[16px] mb-[24px] text-[#021526]">ფართობის მიხედვით</p>
      <div className="flex gap-[15px] mb-[8px]">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="დან"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="border border-[#808A93] rounded-[6px] w-full px-3 py-[10px] text-[14px] outline-none pr-8"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-[#021526]">მ²</span>
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="დან"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="border border-[#808A93] rounded-[6px] w-full px-3 py-[10px] text-[14px] outline-none pr-8"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-[#021526]">მ²</span>
        </div>
      </div>
      {error && <p className="text-[#F93B1D] text-[12px] mb-[8px]">{error}</p>}
      <div className="flex gap-[32px] mt-[16px]">
        <div>
          <p className="text-[14px] font-bold text-[#021526] mb-[12px]">მინ. მ²</p>
          {presets.map((p, i) => (
            <p key={i} className="text-[14px] text-[#2D3648] cursor-pointer hover:text-[#021526] mb-[10px]" onClick={() => setMin(String(p))}>
              {p.toLocaleString()} მ²
            </p>
          ))}
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#021526] mb-[12px]">მაქს. მ²</p>
          {presets.map((p, i) => (
            <p key={i} className="text-[14px] text-[#2D3648] cursor-pointer hover:text-[#021526] mb-[10px]" onClick={() => setMax(String(p))}>
              {p.toLocaleString()} მ²
            </p>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-[16px]">
        <button
          className="bg-[#F93B1D] text-white rounded-[20px] px-[14px] py-[8px] text-[14px] font-medium hover:bg-[#DF3319] transition-colors"
          onClick={apply}
        >
          არჩევა
        </button>
      </div>
    </div>
  );
}

// Bedrooms dropdown
function BedroomsDropdown({ bedrooms, onApply, onClose }) {
  const [local, setLocal] = useState(bedrooms);

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-[10px] shadow-[0px_2px_12px_rgba(2,21,38,0.16)] p-[24px] min-w-[260px]">
      <p className="font-bold text-[16px] mb-[24px] text-[#021526]">საძინებლების რაოდენობა</p>
      <input
        type="number"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="border border-[#808A93] rounded-[6px] w-[50px] px-2 py-[10px] text-[14px] outline-none text-center"
        min="1"
      />
      <div className="flex justify-end mt-[24px]">
        <button
          className="bg-[#F93B1D] text-white rounded-[20px] px-[14px] py-[8px] text-[14px] font-medium hover:bg-[#DF3319] transition-colors"
          onClick={() => { onApply(local); onClose(); }}
        >
          არჩევა
        </button>
      </div>
    </div>
  );
}

// Listing card
function ListingCard({ listing }) {
  const isRental = listing.is_rental === 1;
  return (
    <Link to={`/detail/${listing.id}`} className="block">
      <div className="rounded-[14px] overflow-hidden border border-[#DBDBDB] hover:shadow-[5px_5px_12px_rgba(2,21,38,0.08)] transition-shadow cursor-pointer">
        <div className="relative">
          <img
            src={listing.image}
            alt={listing.address}
            className="w-full h-[307px] object-cover"
          />
          <span className="absolute top-[23px] left-[23px] bg-[#02152680] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-[15px] backdrop-blur-sm">
            {isRental ? "ქირავდება" : "იყიდება"}
          </span>
        </div>
        <div className="p-[22px]">
          <p className="text-[28px] font-bold text-[#021526] mb-[6px]">
            {Number(listing.price).toLocaleString()} ₾
          </p>
          <div className="flex items-center gap-[5px] mb-[24px]">
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
              <path d="M6.5 0C3.186 0 .5 2.686.5 6c0 4.418 6 10 6 10s6-5.582 6-10C12.5 2.686 9.814 0 6.5 0zm0 8.5A2.5 2.5 0 1 1 6.5 3.5a2.5 2.5 0 0 1 0 5z" fill="#808A93" />
            </svg>
            <span className="text-[#808A93] text-[14px]">
              {listing.city?.name}, {listing.address}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path d="M1 10V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5M1 10h15M1 10v3M16 10v3M3 4V2a.5.5 0 0 1 .5-.5h3A.5.5 0 0 1 7 2v2M9 4V2a.5.5 0 0 1 .5-.5h3A.5.5 0 0 1 13 2v2" stroke="#808A93" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <rect x="1.5" y="1.5" width="14" height="14" rx="1" stroke="#808A93" strokeWidth="1.5" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.area} მ²</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M2.5 1.5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1z" stroke="#808A93" strokeWidth="1.5" />
                <path d="M1.5 6.5h14M6.5 1.5v14" stroke="#808A93" strokeWidth="1.5" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.zip_code}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Chip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1 border border-[#DBDBDB] rounded-[43px] px-[10px] py-[6px] text-[14px] text-[#021526]">
      <span>{label}</span>
      <button className="ml-1 text-[#021526] hover:text-[#F93B1D] transition-colors" onClick={onRemove}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function FilterBtn({ name, label, openDropdown, toggleDropdown }) {
  const isOpen = openDropdown === name;
  return (
    <button
      onClick={() => toggleDropdown(name)}
      className={`flex items-center gap-1 px-[14px] py-[8px] rounded-[6px] text-[14px] font-medium transition-colors ${
        isOpen ? "bg-[#F3F3F3]" : "hover:bg-[#F3F3F3]"
      } text-[#021526]`}
    >
      {label}
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform ml-1 ${isOpen ? "rotate-180" : ""}`}>
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#021526" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Home() {
  const [agentModalIsOpen, setAgentModalIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState(loadFilters);
  const dropdownRef = useRef(null);

  const { data: listings } = useQuery({ queryKey: ["listings"], queryFn: getListings });
  const { data: regions } = useQuery({ queryKey: ["regions"], queryFn: getRegions });

  useEffect(() => { saveFilters(filters); }, [filters]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleDropdown(name) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  function applyRegions(selected) { setFilters((f) => ({ ...f, regions: selected })); }
  function applyPrice(min, max) { setFilters((f) => ({ ...f, priceMin: min, priceMax: max })); }
  function applyArea(min, max) { setFilters((f) => ({ ...f, areaMin: min, areaMax: max })); }
  function applyBedrooms(val) { setFilters((f) => ({ ...f, bedrooms: val })); }

  function removeRegion(id) { setFilters((f) => ({ ...f, regions: f.regions.filter((r) => r !== id) })); }
  function removePrice() { setFilters((f) => ({ ...f, priceMin: "", priceMax: "" })); }
  function removeArea() { setFilters((f) => ({ ...f, areaMin: "", areaMax: "" })); }
  function removeBedrooms() { setFilters((f) => ({ ...f, bedrooms: "" })); }
  function clearAll() { setFilters({ regions: [], priceMin: "", priceMax: "", areaMin: "", areaMax: "", bedrooms: "" }); }

  const regionMap = Object.fromEntries((regions || []).map((r) => [r.id, r.name]));

  const filtered = (listings || []).filter((l) => {
    const hasRegion = filters.regions.length > 0;
    const hasPrice = filters.priceMin !== "" || filters.priceMax !== "";
    const hasArea = filters.areaMin !== "" || filters.areaMax !== "";
    const hasBeds = filters.bedrooms !== "";
    const noFilters = !hasRegion && !hasPrice && !hasArea && !hasBeds;
    if (noFilters) return true;

    if (hasRegion && filters.regions.map(String).includes(String(l.city?.region_id))) return true;
    if (hasPrice) {
      const price = Number(l.price);
      const min = filters.priceMin !== "" ? Number(filters.priceMin) : -Infinity;
      const max = filters.priceMax !== "" ? Number(filters.priceMax) : Infinity;
      if (price >= min && price <= max) return true;
    }
    if (hasArea) {
      const area = Number(l.area);
      const min = filters.areaMin !== "" ? Number(filters.areaMin) : -Infinity;
      const max = filters.areaMax !== "" ? Number(filters.areaMax) : Infinity;
      if (area >= min && area <= max) return true;
    }
    if (hasBeds && String(l.bedrooms) === String(filters.bedrooms)) return true;
    return false;
  });

  const hasChips =
    filters.regions.length > 0 || filters.priceMin || filters.priceMax ||
    filters.areaMin || filters.areaMax || filters.bedrooms;

  return (
    <div className="max-w-[1596px] mx-auto px-[162px] pt-[77px] pb-[80px]">
      {/* top bar: filters + buttons */}
      <div className="flex items-center justify-between mb-[32px]">
        {/* filter buttons group */}
        <div ref={dropdownRef} className="flex items-center border border-[#DBDBDB] rounded-[10px] px-[2px]">
          {/* region */}
          <div className="relative">
            <FilterBtn name="regions" label="რეგიონი" openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
            {openDropdown === "regions" && (
              <RegionDropdown
                regions={regions}
                selected={filters.regions}
                onApply={applyRegions}
                onClose={() => setOpenDropdown(null)}
              />
            )}
          </div>

          {/* price (labeled as საცხო კატეგორია in design but opens price filter per screenshots) */}
          <div className="relative">
            <FilterBtn name="price" label="საცხო კატეგორია" openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
            {openDropdown === "price" && (
              <PriceDropdown
                priceMin={filters.priceMin}
                priceMax={filters.priceMax}
                onApply={applyPrice}
                onClose={() => setOpenDropdown(null)}
              />
            )}
          </div>

          {/* area */}
          <div className="relative">
            <FilterBtn name="area" label="ფართობი" openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
            {openDropdown === "area" && (
              <AreaDropdown
                areaMin={filters.areaMin}
                areaMax={filters.areaMax}
                onApply={applyArea}
                onClose={() => setOpenDropdown(null)}
              />
            )}
          </div>

          {/* bedrooms */}
          <div className="relative">
            <FilterBtn name="bedrooms" label="საძინებლების რაოდენობა" openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
            {openDropdown === "bedrooms" && (
              <BedroomsDropdown
                bedrooms={filters.bedrooms}
                onApply={applyBedrooms}
                onClose={() => setOpenDropdown(null)}
              />
            )}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center gap-4">
          <Link to="/addListing">
            <button className="flex items-center gap-1 py-[14px] px-[16px] bg-[#F93B1D] text-white font-bold text-[16px] rounded-[10px] hover:bg-[#DF3319] transition-colors">
              + ლისტინგის დამატება
            </button>
          </Link>
          <button
            className="flex items-center gap-1 py-[14px] px-[16px] border border-[#F93B1D] text-[#F93B1D] font-bold text-[16px] rounded-[10px] hover:bg-[#FFF5F3] transition-colors"
            onClick={() => setAgentModalIsOpen(true)}
          >
            + აგენტის დამატება
          </button>
        </div>
      </div>

      {/* active filter chips */}
      {hasChips && (
        <div className="flex flex-wrap items-center gap-2 mb-[32px]">
          {filters.regions.map((id) => (
            <Chip key={id} label={regionMap[id] || id} onRemove={() => removeRegion(id)} />
          ))}
          {(filters.priceMin || filters.priceMax) && (
            <Chip
              label={`${filters.priceMin ? Number(filters.priceMin).toLocaleString() : "0"} ₾ - ${filters.priceMax ? Number(filters.priceMax).toLocaleString() : "∞"} ₾`}
              onRemove={removePrice}
            />
          )}
          {(filters.areaMin || filters.areaMax) && (
            <Chip
              label={`${filters.areaMin || "0"} მ² - ${filters.areaMax || "∞"} მ²`}
              onRemove={removeArea}
            />
          )}
          {filters.bedrooms && (
            <Chip label={`${filters.bedrooms}`} onRemove={removeBedrooms} />
          )}
          <button
            className="text-[14px] text-[#021526] hover:text-[#F93B1D] transition-colors ml-2"
            onClick={clearAll}
          >
            გასუფთავება
          </button>
        </div>
      )}

      {/* listings grid or empty state */}
      {filtered.length === 0 ? (
        <p className="text-[20px] text-[#808A93] mt-[65px]">
          აღნიშნული მონაცემებით განცხადება არ იძებნება
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-[20px]">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {agentModalIsOpen && (
        <AgentModal onCloseAgentModal={() => setAgentModalIsOpen(false)} />
      )}
    </div>
  );
}

export default Home;