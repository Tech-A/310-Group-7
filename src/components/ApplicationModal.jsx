import { useEffect, useRef, useState } from "react";


function capitaliseWords(text){
      return text.trim().split(" ").filter(Boolean).map((word) => {
        const bare = word.replace(/[^a-zA-Z]/g, "");

        if (bare.length === 2){
          return word.toUpperCase(); 
        }

        const lower = word.toLowerCase(); 
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" ");
    }
    
export default function ApplicationModal({ isOpen, onClose, onSubmit }) {
    const dialogRef = useRef(null);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [location, setLocation] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
        dialog.showModal();
        } else if (!isOpen && dialog.open) {
        dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        function handleNativeClose() {
        onClose?.();
        }

        dialog.addEventListener("close", handleNativeClose);
        return () => dialog.removeEventListener("close", handleNativeClose);
    }, [onClose]);

    function validate() {
        const newErrors = {};
        if (!company.trim()) newErrors.company = "Company is required";
        if (!role.trim()) newErrors.role = "Role is required";
        if (!dueDate) newErrors.dueDate = "Due Date is required";
        if(!location) newErrors.location = "Location is required";
        return newErrors;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        onSubmit?.({ company: company.trim(), location: capitaliseWords(location), role: role.trim(), dueDate });
        setCompany("");
        setLocation(""); 
        setRole("");
        setDueDate("");
        
        setErrors({});
    }

    

    return (
        <dialog
        ref={dialogRef}
        aria-labelledby="modal-title"
        className="h-full max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-white/55"
        >
        <div className="flex min-h-full w-full items-center justify-center px-3 py-8 sm:p-6">
            <button
            type="button"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
            className="absolute inset-0 cursor-default bg-transparent"
        />

        <div className="relative w-full max-w-[480px]">
          <div className="relative z-20 flex items-center justify-center">
            <h2
              id="modal-title"
              className="text-center text-3xl font-bold tracking-tight text-[#353434] sm:text-5xl"
            >
              ADD APPLICATION
            </h2>
          </div>

            <div className="relative z-10 -mt-1 rounded-[24px] bg-[#353434] px-5 pb-6 pt-12 font-sans shadow-2xl sm:-mt-2 sm:rounded-[28px] sm:p-8 sm:pb-9 sm:pt-16">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
                <label className="flex flex-col gap-2">
                <span className="font-medium text-brand-bg">Company *</span>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="min-w-0 rounded-full bg-input-bg px-5 py-3 text-brand-black outline-none placeholder:text-input-placeholder focus-visible:ring-2 focus-visible:ring-brand-yellow sm:py-3.5"
                />
                {errors.company && (
                  <span className="px-2 text-sm text-red-300">{errors.company}</span>
                )}
                </label>

                <label className="flex flex-col gap-2">
                <span className="font-medium text-brand-bg">Location *</span>
                <input
                  type="text"
                  placeholder="City, Country Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="min-w-0 rounded-full bg-input-bg px-5 py-3 text-brand-black outline-none placeholder:text-input-placeholder focus-visible:ring-2 focus-visible:ring-brand-yellow sm:py-3.5"
                />
                {errors.location && (
                  <span className="px-2 text-sm text-red-300">{errors.location}</span>
                )}
                </label>

                <label className="flex flex-col gap-2">
                <span className="font-medium text-brand-bg">Role *</span>
                <input
                  type="text"
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="min-w-0 rounded-full bg-input-bg px-5 py-3 text-brand-black outline-none placeholder:text-input-placeholder focus-visible:ring-2 focus-visible:ring-brand-yellow sm:py-3.5"
                />
                {errors.role && (
                  <span className="px-2 text-sm text-red-300">{errors.role}</span>
                )}
                </label>

                <label className="flex flex-col gap-2">
                <span className="font-medium text-brand-bg">Due Date *</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="min-w-0 rounded-full bg-input-bg px-5 py-3 text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow sm:py-3.5"
                />
                {errors.dueDate && (
                  <span className="px-2 text-sm text-red-300">{errors.dueDate}</span>
                )}
                </label>

                <button
                type="submit"
                className="mt-2 w-full self-center rounded-full bg-brand-yellow px-6 py-3.5 text-lg font-bold text-brand-black transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow active:scale-[0.98] sm:w-auto sm:min-w-[60%]"
                >
                Submit
                </button>
                </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
