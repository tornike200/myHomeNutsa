import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListing, getListings, deleteListing } from "../api/listingApi";

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[20px] py-[50px] px-[65px] relative text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[16px] right-[16px] text-[#021526] text-[18px] hover:text-[#F93B1D]"
          onClick={onCancel}
        >
          ✕
        </button>
        <p className="text-[20px] font-medium text-[#2D3648] mb-[35px]">
          გსურთ წაშალოთ ლისტინგი?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="py-[14px] px-[20px] border border-[#F93B1D] text-[#F93B1D] font-bold text-[16px] rounded-[10px] hover:bg-[#FFF5F3] transition-colors"
            onClick={onCancel}
          >
            გაუქმება
          </button>
          <button
            className="py-[14px] px-[20px] bg-[#F93B1D] text-white font-bold text-[16px] rounded-[10px] hover:bg-[#DF3319] transition-colors"
            onClick={onConfirm}
          >
            დადასტურება
          </button>
        </div>
      </div>
    </div>
  );
}

function SimilarCard({ listing }) {
  const isRental = listing.is_rental === 1;
  return (
    <Link to={`/detail/${listing.id}`} className="block flex-shrink-0 w-[309px]">
      <div className="rounded-[14px] overflow-hidden border border-[#DBDBDB] hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <img src={listing.image} alt={listing.address} className="w-full h-[200px] object-cover" />
          <span className="absolute top-[16px] left-[16px] bg-[#02152680] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-[15px]">
            {isRental ? "ქირავდება" : "იყიდება"}
          </span>
        </div>
        <div className="p-[16px]">
          <p className="text-[20px] font-bold text-[#021526] mb-[4px]">
            {Number(listing.price).toLocaleString()} ₾
          </p>
          <div className="flex items-center gap-1 mb-[16px]">
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
              <path d="M6.5 0C3.186 0 .5 2.686.5 6c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 6.5 3.5a2.5 2.5 0 0 1 0 5z" fill="#808A93" />
            </svg>
            <span className="text-[#808A93] text-[14px]">
              {listing.city?.name}, {listing.address}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M1 10.5V5.5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5M1 10.5h15M1 10.5v3M16 10.5v3M3 4.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v2M7 4.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v2" stroke="#808A93" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.bedrooms}</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <rect x="1" y="1" width="15" height="15" rx="1" stroke="#808A93" strokeWidth="1.5" />
                <path d="M1 6h15M6 1v15" stroke="#808A93" strokeWidth="1.5" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.area} მ²</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M8.5 1.5v14M1.5 8.5h14" stroke="#808A93" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="1" y="1" width="15" height="15" rx="2" stroke="#808A93" strokeWidth="1.5" />
              </svg>
              <span className="text-[14px] text-[#808A93]">{listing.zip_code}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const sliderRef = useRef(null);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id),
  });

  const { data: allListings } = useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
      navigate("/");
    },
  });

  const similarListings = (allListings || []).filter(
    (l) => String(l.id) !== String(id) && l.city?.region_id === listing?.city?.region_id
  );

  function slideLeft() {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -330, behavior: "smooth" });
  }
  function slideRight() {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: 330, behavior: "smooth" });
  }

  if (isLoading) {
    return (
      <div className="max-w-[1596px] mx-auto px-[162px] pt-[40px]">
        <p className="text-[#808A93]">იტვირთება...</p>
      </div>
    );
  }

  if (!listing) return null;

  const isRental = listing.is_rental === 1;

  const createdDate = listing.created_at
    ? new Date(listing.created_at).toLocaleDateString("ka-GE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : "";

  return (
    <div className="max-w-[1596px] mx-auto px-[162px] pt-[40px] pb-[80px]">
      {/* back */}
      <Link to="/" className="inline-flex items-center mb-[29px] text-[#021526] hover:text-[#F93B1D] transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 7H1M1 7L7 13M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* main content */}
      <div className="flex gap-[68px] mb-[53px]">
        {/* left: image */}
        <div className="flex flex-col">
          <div className="relative">
            <img
              src={listing.image}
              alt={listing.address}
              className="w-[839px] h-[670px] object-cover rounded-t-[14px]"
            />
            <span className="absolute top-[23px] left-[23px] bg-[#02152680] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-[15px]">
              {isRental ? "ქირავდება" : "იყიდება"}
            </span>
          </div>
          <p className="text-[14px] text-[#808A93] mt-[12px] text-right">
            გამოქვეყნების თარიღი {createdDate}
          </p>
        </div>

        {/* right: info */}
        <div className="flex-1 pt-[30px]">
          <p className="text-[48px] font-bold text-[#021526] mb-[24px] leading-none">
            {Number(listing.price).toLocaleString()} ₾
          </p>

          <div className="flex flex-col gap-[16px] mb-[40px]">
            <InfoRow icon="location">
              {listing.city?.name}, {listing.address}
            </InfoRow>
            <InfoRow icon="area">ფართი {listing.area} მ²</InfoRow>
            <InfoRow icon="bed">საძინებელი {listing.bedrooms}</InfoRow>
            <InfoRow icon="zip">საფოსტო ინდექსი {listing.zip_code}</InfoRow>
          </div>

          <p className="text-[16px] text-[#808A93] leading-[26px] mb-[50px]">{listing.description}</p>

          {/* agent card */}
          {listing.agent && (
            <div className="border border-[#DBDBDB] rounded-[8px] p-[20px]">
              <div className="flex items-center gap-[14px] mb-[16px]">
                <img
                  src={listing.agent.avatar}
                  alt={listing.agent.name}
                  className="w-[72px] h-[72px] rounded-full object-cover"
                />
                <div>
                  <p className="text-[16px] font-bold text-[#021526]">
                    {listing.agent.name} {listing.agent.surname}
                  </p>
                  <p className="text-[14px] text-[#676E76]">აგენტი</p>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-2">
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                    <path d="M1 1h14v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V1zM1 1l7 6 7-6" stroke="#808A93" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-[14px] text-[#808A93]">{listing.agent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1.5 1.5c0 0 1 0 2 2s0 3 0 3l2 2s1 0 3 0 2 2 2 2v1c0 .5-.5 1-1 1C5 13 1 9 1 2.5c0-.5.5-1 1-1h.5z" stroke="#808A93" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-[14px] text-[#808A93]">{listing.agent.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* delete button */}
          <button
            className="mt-[33px] py-[10px] px-[18px] border border-[#676E76] text-[#676E76] text-[14px] rounded-[8px] hover:border-[#F93B1D] hover:text-[#F93B1D] transition-colors"
            onClick={() => setDeleteModalOpen(true)}
          >
            ლისტინგის წაშლა
          </button>
        </div>
      </div>

      {/* similar listings */}
      {similarListings.length > 0 && (
        <div>
          <h2 className="text-[32px] font-medium text-[#021526] mb-[52px]">ბინები მსგავს ლოკაციაზე</h2>
          <div className="relative">
            {/* left arrow */}
            <button
              className="absolute left-[-48px] top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#DBDBDB] rounded-full shadow-md hover:border-[#021526] transition-colors"
              onClick={slideLeft}
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M9 1L1 8L9 15" stroke="#021526" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* slider */}
            <div
              ref={sliderRef}
              className="flex gap-[20px] overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {similarListings.map((l) => (
                <SimilarCard key={l.id} listing={l} />
              ))}
            </div>

            {/* right arrow */}
            <button
              className="absolute right-[-48px] top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#DBDBDB] rounded-full shadow-md hover:border-[#021526] transition-colors"
              onClick={slideRight}
            >
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M1 1L9 8L1 15" stroke="#021526" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* delete modal */}
      {deleteModalOpen && (
        <DeleteModal
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

function InfoRow({ icon, children }) {
  const icons = {
    location: (
      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
        <path d="M6.5 0C3.186 0 .5 2.686.5 6c0 4.418 6 10 6 10s6-5.582 6-10c0-3.314-2.686-6-6-6zm0 8.5A2.5 2.5 0 1 1 6.5 3.5a2.5 2.5 0 0 1 0 5z" fill="#021526" />
      </svg>
    ),
    area: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1" y="1" width="15" height="15" rx="1" stroke="#021526" strokeWidth="1.5" />
        <path d="M1 6h15M6 1v15" stroke="#021526" strokeWidth="1.5" />
      </svg>
    ),
    bed: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M1 10.5V5.5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5M1 10.5h15M1 10.5v3M16 10.5v3M3 4.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v2M7 4.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v2" stroke="#021526" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    zip: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 1.5v14M1.5 8.5h14" stroke="#021526" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="1" y="1" width="15" height="15" rx="2" stroke="#021526" strokeWidth="1.5" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-[7px]">
      <span className="flex-shrink-0">{icons[icon]}</span>
      <span className="text-[24px] text-[#021526]">{children}</span>
    </div>
  );
}

export default Detail;