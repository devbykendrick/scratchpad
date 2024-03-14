import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await login(email, password);
  }

  return (
    <div>
      <section className="bg-black">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
          <div className="flex items-center mb-5">
            <div className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="60"
                height="60"
              >
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M25.485 30.865h0v-6.811h0a4.606 4.606 0 0 1 1.108-3 12.252 12.252 0 0 0 2.929-8.607A11.921 11.921 0 0 0 18.768 1.033a11.8 11.8 0 0 0-12.513 11.5h-.013L4.053 17.87a.935.935 0 0 0 .652 1.221l2.377.546.593 6.729a.911.911 0 0 0 .894.831h4.763v3.668"
                ></path>
                <path
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h2"
                ></path>
                <path
                  fill="none"
                  stroke="#FBA3E1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m24.5 7.5-7 9M25.5 8.5l-7 9M20.5 8.5l4 4M19.5 9.5l4 4"
                ></path>
              </svg>
            </div>
            <h1 className="text-4xl font-semibold">Scratch Pad</h1>
          </div>
          <div className="w-full rounded-lg shadow border-2 md:mt-0 sm:max-w-md xl:p-0 bg-black border-gray-400">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="border sm:text-sm rounded-lg block w-full p-2.5 bg-[#0a0a0f] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="••••••••"
                    className="border sm:text-sm rounded-lg block w-full p-2.5 bg-[#0a0a0f] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="cursor-pointer w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                >
                  Sign in
                </button>
                {error && <div>{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
