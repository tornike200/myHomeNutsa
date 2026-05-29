import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getCities, getRegions, getAgents, createListing } from "../api/listingApi";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { listingSchema } from "../validation/listingSchema";
import { buildListingPayload } from "../utils/buildListingFormData";
import AgentModal from "../components/AgentModal";

function FieldHint({ error, text }) {
  return (
    <span className={`text-[12px] ${error ? "text-[#F93B1D]" : "text-[#808A93]"}`}>✓ {text}</span>
  );
}

function AddListing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [agentModalIsOpen, setAgentModalIsOpen] = useState(false);

  const { data: regions } = useQuery({ queryKey: ["regions"], queryFn: getRegions });
  const { data: cities } = useQuery({ queryKey: ["cities"], queryFn: getCities });
  const { data: agents, refetch: refetchAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(listingSchema),
    defaultValues: {
      is_rental: "0",
      region_id: "",
      city_id: "",
      agent_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => createListing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["listings"]);
      navigate("/");
    },
  });

  async function submit(data) {
    const payload = await buildListingPayload(data, { cities: cities || [], agents: agents || [] });
    mutation.mutate(payload);
  }

  const selectedRegionId = watch("region_id");
  const imageFile = watch("image");

  const filteredCities = useMemo(() => {
    if (!selectedRegionId) return [];
    return (cities || []).filter((c) => String(c.region_id) === String(selectedRegionId));
  }, [cities, selectedRegionId]);

  function handleRegionChange(e) {
    setValue("region_id", e.target.value);
    setValue("city_id", "");
  }

  const imagePreview = imageFile?.[0] ? URL.createObjectURL(imageFile[0]) : null;

  function handleAgentAdded() {
    setAgentModalIsOpen(false);
    refetchAgents();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[790px] mx-auto pt-[62px] pb-[80px]">
        <h1 className="text-[32px] font-medium text-[#021526] text-center mb-[61px]">
          ლისტინგის დამატება
        </h1>

        <form onSubmit={handleSubmit(submit)}>
          {/* deal type */}
          <section className="mb-[80px]">
            <p className="text-[16px] font-bold text-[#021526] mb-[22px]">გარიგების ტიპი</p>
            <div className="flex items-center gap-[84px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="0"
                  {...register("is_rental")}
                  className="w-4 h-4 accent-[#021526]"
                />
                <span className="text-[14px] text-[#021526]">იყიდება</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="1"
                  {...register("is_rental")}
                  className="w-4 h-4 accent-[#021526]"
                />
                <span className="text-[14px] text-[#021526]">ქირავდება</span>
              </label>
            </div>
          </section>

          {/* location */}
          <section className="mb-[80px]">
            <p className="text-[16px] font-bold text-[#021526] mb-[22px]">მდებარეობა</p>
            <div className="grid grid-cols-2 gap-x-[31px] gap-y-[22px]">
              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.address ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  მისამართი *
                </label>
                <input
                  type="text"
                  {...register("address")}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none ${errors.address ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                />
                <FieldHint error={errors.address} text="მინიმუმ ორი სიმბოლო" />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.zip_code ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  საფოსტო ინდექსი *
                </label>
                <input
                  type="text"
                  {...register("zip_code")}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none ${errors.zip_code ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                />
                <FieldHint error={errors.zip_code} text="მხოლოდ რიცხვები" />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.region_id ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  რეგიონი
                </label>
                <select
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none bg-white ${errors.region_id ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                  {...register("region_id")}
                  onChange={handleRegionChange}
                >
                  <option value="" disabled>
                    აირჩიეთ
                  </option>
                  {regions?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.city_id ? "text-[#F93B1D]" : !selectedRegionId ? "text-[#808A93]" : "text-[#021526]"}`}
                >
                  ქალაქი
                </label>
                <select
                  disabled={!selectedRegionId}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none bg-white ${errors.city_id ? "border-[#F93B1D]" : !selectedRegionId ? "border-[#808A93] opacity-50 cursor-not-allowed" : "border-[#808A93]"}`}
                  {...register("city_id")}
                >
                  <option value="" disabled>
                    {selectedRegionId ? "აირჩიეთ" : ""}
                  </option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* apartment details */}
          <section className="mb-[80px]">
            <p className="text-[16px] font-bold text-[#021526] mb-[22px]">ბინის დეტალები</p>
            <div className="grid grid-cols-2 gap-x-[31px] gap-y-[22px]">
              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.price ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  ფასი
                </label>
                <input
                  type="text"
                  {...register("price")}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none ${errors.price ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                />
                <FieldHint error={errors.price} text="მხოლოდ რიცხვები" />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.area ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  ფართობი
                </label>
                <input
                  type="text"
                  {...register("area")}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none ${errors.area ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                />
                <FieldHint error={errors.area} text="მხოლოდ რიცხვები" />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label
                  className={`text-[14px] font-bold ${errors.bedrooms ? "text-[#F93B1D]" : "text-[#021526]"}`}
                >
                  საძინებლების რაოდენობა *
                </label>
                <input
                  type="text"
                  {...register("bedrooms")}
                  className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none ${errors.bedrooms ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                />
                <FieldHint error={errors.bedrooms} text="მხოლოდ რიცხვები" />
              </div>
            </div>

            <div className="flex flex-col gap-[5px] mt-[22px]">
              <label
                className={`text-[14px] font-bold ${errors.description ? "text-[#F93B1D]" : "text-[#021526]"}`}
              >
                აღწერა *
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none resize-none ${errors.description ? "border-[#F93B1D]" : "border-[#808A93]"}`}
              />
              <FieldHint error={errors.description} text="მინიმუმ ხუთი სიტყვა" />
            </div>

            <div className="flex flex-col gap-[5px] mt-[22px]">
              <label
                className={`text-[14px] font-bold ${errors.image ? "text-[#F93B1D]" : "text-[#021526]"}`}
              >
                ატვირთეთ ფოტო *
              </label>
              <div
                className={`flex justify-center items-center w-full h-[120px] border-2 border-dashed rounded-[8px] ${errors.image ? "border-[#F93B1D]" : "border-[#808A93]"}`}
              >
                <input
                  type="file"
                  id="listing-image"
                  hidden
                  {...register("image")}
                  accept="image/*"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-full w-full object-cover rounded-[8px]"
                  />
                ) : (
                  <label
                    htmlFor="listing-image"
                    className={`flex justify-center items-center w-6 h-6 border rounded-full cursor-pointer ${errors.image ? "border-[#F93B1D] text-[#F93B1D]" : "border-[#808A93] text-[#808A93]"}`}
                  >
                    +
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* agent */}
          <section className="mb-[80px]">
            <p className="text-[16px] font-bold text-[#021526] mb-[22px]">აგენტი</p>
            <div className="flex flex-col gap-[5px] max-w-[384px]">
              <label
                className={`text-[14px] font-bold ${errors.agent_id ? "text-[#F93B1D]" : "text-[#021526]"}`}
              >
                აირჩიე
              </label>
              <select
                className={`border rounded-[6px] px-[10px] py-[10px] text-[14px] outline-none bg-white ${errors.agent_id ? "border-[#F93B1D]" : "border-[#808A93]"}`}
                {...register("agent_id")}
              >
                <option value="" disabled>
                  აირჩიეთ
                </option>
                {agents?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} {a.surname}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="flex items-center gap-2 text-[14px] text-[#021526] mt-1 hover:text-[#F93B1D] transition-colors"
                onClick={() => setAgentModalIsOpen(true)}
              >
                <span className="flex items-center justify-center w-5 h-5 border border-current rounded-full text-sm leading-none">
                  +
                </span>
                დაამატე აგენტი
              </button>
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <Link to="/">
              <button
                type="button"
                className="py-[14px] px-[16px] border border-[#F93B1D] text-[#F93B1D] font-bold text-[16px] rounded-[10px] hover:bg-[#FFF5F3] transition-colors"
              >
                გაუქმება
              </button>
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="py-[14px] px-[16px] bg-[#F93B1D] text-white font-bold text-[16px] rounded-[10px] hover:bg-[#DF3319] transition-colors disabled:opacity-60"
            >
              {mutation.isPending ? "..." : "დაამატე ლისტინგი"}
            </button>
          </div>
        </form>
      </div>

      {agentModalIsOpen && <AgentModal onCloseAgentModal={handleAgentAdded} />}
    </div>
  );
}

export default AddListing;
