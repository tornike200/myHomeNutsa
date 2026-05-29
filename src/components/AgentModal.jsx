import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { buildCreateAgentPayload } from "../utils/buildListingFormData";
import { createAgent } from "../api/listingApi";
import { agentSchema } from "../validation/agentSchema";
function AgentModal({ onCloseAgentModal }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(agentSchema),
  });

  const mutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(["agents"]);
      reset();
      onCloseAgentModal();
    },
    onError: (error) => {
      console.error("Error creating agent:", error);
    },
  });

  async function submit(data) {
    const payload = await buildCreateAgentPayload(data);
    mutation.mutate(payload);
  }

  const avatar = watch("avatar");

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <form
        className="flex flex-col items-center py-[60px] px-[80px] bg-white rounded-[10px] text-[#021526]"
        onSubmit={handleSubmit(submit)}
      >
        <h2 className="mb-12 text-[32px] font-medium">აგენტის დამატება</h2>

        <div className="flex flex-col gap-7">
          <div className="flex gap-7">
            <label className="flex flex-col" htmlFor="name">
              <span className={`font-bold text-[14px] ${errors.name ? "text-red-400" : ""}`}>
                სახელი *
              </span>

              <input
                className={`border w-[384px] p-2.5 rounded-md outline-none my-1.5 ${
                  errors.name ? "border-red-400" : "border-[#808A93]"
                }`}
                type="text"
                id="name"
                {...register("name")}
              />

              <span className={`text-[12px] ${errors.name ? "text-red-400" : ""}`}>
                ✓ მინიმუმ ორი სიმბოლო
              </span>
            </label>

            <label className="flex flex-col" htmlFor="surname">
              <span className={`font-bold text-[14px] ${errors.surname ? "text-red-400" : ""}`}>
                გვარი *
              </span>

              <input
                className={`border w-[384px] p-2.5 rounded-md outline-none my-1.5 ${
                  errors.surname ? "border-red-400" : "border-[#808A93]"
                }`}
                type="text"
                id="surname"
                {...register("surname")}
              />

              <span className={`text-[12px] ${errors.surname ? "text-red-400" : ""}`}>
                ✓ მინიმუმ ორი სიმბოლო
              </span>
            </label>
          </div>

          <div className="flex gap-7">
            <label className="flex flex-col" htmlFor="email">
              <span className={`font-bold text-[14px] ${errors.email ? "text-red-400" : ""}`}>
                ელ-ფოსტა *
              </span>

              <input
                className={`border w-[384px] p-2.5 rounded-md outline-none my-1.5 ${
                  errors.email ? "border-red-400" : "border-[#808A93]"
                }`}
                type="text"
                id="email"
                {...register("email")}
              />

              <span className={`text-[12px] ${errors.email ? "text-red-400" : ""}`}>
                ✓ გამოიყენეთ @redberry.ge ფოსტა
              </span>
            </label>

            <label className="flex flex-col" htmlFor="phone">
              <span className={`font-bold text-[14px] ${errors.phone ? "text-red-400" : ""}`}>
                ტელეფონის ნომერი *
              </span>

              <input
                className={`border w-[384px] p-2.5 rounded-md outline-none my-1.5 ${
                  errors.phone ? "border-red-400" : "border-[#808A93]"
                }`}
                type="text"
                id="phone"
                {...register("phone")}
              />

              <span className={`text-[12px] ${errors.phone ? "text-red-400" : ""}`}>
                ✓ მხოლოდ რიცხვები
              </span>
            </label>
          </div>

          <div>
            <label
              className={`font-bold text-[14px] ${errors.avatar ? "text-red-400" : ""}`}
              htmlFor="avatar"
            >
              ატვირთე ფოტო *
            </label>

            <div
              className={`flex justify-center items-center w-full h-[120px] border border-dashed mt-2.5 rounded-md ${
                errors.avatar ? "border-red-400" : "border-[#808A93]"
              }`}
            >
              <input type="file" id="avatar" hidden accept="image/*" {...register("avatar")} />

              {avatar?.[0] ? (
                <img
                  className="h-full object-cover rounded-md"
                  src={URL.createObjectURL(avatar[0])}
                  alt="avatar"
                />
              ) : (
                <label
                  htmlFor="avatar"
                  className={`flex justify-center items-center w-8 h-8 border rounded-full cursor-pointer ${
                    errors.avatar ? "border-red-400 text-red-400" : "border-[#808A93]"
                  }`}
                >
                  +
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex gap-4 justify-end w-full">
          <button
            className="py-3 px-4 border font-bold text-base border-[#F93B1D] text-[#F93B1D] rounded-[10px]"
            type="button"
            onClick={onCloseAgentModal}
          >
            გაუქმება
          </button>

          <button
            className="py-3 px-4 font-bold text-base bg-[#F93B1D] text-white rounded-[10px]"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "იტვირთება..." : "დაამატე აგენტი"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgentModal;
