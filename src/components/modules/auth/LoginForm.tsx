"use client";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react"; // Updated icon import
import { loginUser } from "@/services/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");

  console.log(redirect);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data);

      if (res.success) {
        toast.success(res.message || "Login successful");
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/admin/home");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="relative w-full max-w-[750px] h-auto md:h-[450px] md:border-2 border-cyan-400 overflow-hidden bg-transparent mx-auto my-10">
      {/* Background shape */}
      <span className="hidden md:block absolute top-0 right-0 w-[850px] h-[600px] bg-gradient-to-br from-[#081b29] to-cyan-400 border-b-4 border-cyan-400 rotate-[10deg] skew-y-[40deg] origin-bottom-right"></span>

      {/* Login Box */}
      <div className="relative md:absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-6 md:px-10 z-10 bg-[#081b29]/80 md:bg-transparent">
        <h2 className="text-white text-3xl md:text-3xl text-center font-medium mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
              required
              className="w-full h-12 bg-transparent border-b-2 border-white text-white pr-8 placeholder-white focus:outline-none peer"
            />

            <Mail
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white peer-focus:text-cyan-400"
              size={18}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              {...register("password", { required: true })}
              required
              className="w-full h-12 bg-transparent border-b-2 border-white text-white pr-8 placeholder-white focus:outline-none peer"
              placeholder="Password"
            />
            <Lock
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white peer-focus:text-cyan-400"
              size={18}
            />
          </div>

          <button
            type="submit"
            className="relative cursor-pointer w-full h-12 border-2 border-cyan-400 text-white font-semibold rounded-full overflow-hidden z-10"
          >
            <span className="absolute top-[-100%] left-0 w-full h-[300%] bg-gradient-to-b from-[#081b29] via-cyan-400 to-[#081b29] transition-all duration-500 hover:top-0 -z-10"></span>
            Login
          </button>
        </form>
      </div>

      {/* Info Text */}
      <div className="hidden md:flex absolute top-0 right-0 w-1/2 h-full flex-col justify-center text-right pr-10 pl-20 z-10">
        <h2 className="text-white text-3xl lg:text-4xl uppercase leading-tight">
          Welcome Back!
        </h2>
        <p className="text-white text-base mt-4">
          Please log in to access your personalized dashboard and manage your
          account.
        </p>
      </div>
    </div>
  );
}
