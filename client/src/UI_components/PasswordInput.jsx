import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // ✅ install lucide-react for icons

export default function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        required
        value={value}
        onChange={onChange}
        minLength="6"
        className="border-2  rounded p-1 px-1 my-1 text-black"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-2 flex items-center text-black"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
