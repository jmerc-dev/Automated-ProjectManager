import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/firebase/auth-context.tsx";
import { useEffect } from "react";

function Landing() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [user]);

  async function signIn() {
    loginWithGoogle();
  }

  return (
    <div>
      <nav className="bg-white  fixed w-full z-20 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            ></img>
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              AutoProject
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={signIn}
              className="text-white w-full  bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign up with Google<div></div>
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-500 bg-blue-700 rounded-sm transition-colors duration-200 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-500 rounded-sm transition-colors duration-200 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-500 rounded-sm transition-colors duration-200 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-500 rounded-sm transition-colors duration-200 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="pt-24 bg-[#f4f8fb] min-h-screen">
        {/* Home Section */}
        <section
          id="home"
          className="flex flex-col md:flex-row items-center justify-center py-16 px-4 text-center gap-10 max-w-5xl mx-auto rounded-2xl"
        >
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1976d2] mb-4">
              Welcome to AutoProject
            </h1>
            <p className="text-lg md:text-xl text-[#4a6fa5] max-w-2xl mb-8">
              A modern, collaborative project management platform designed for
              teams who want to move fast and stay organized.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#about"
                className="bg-[#1976d2] text-white font-semibold rounded-xl px-8 py-3 hover:bg-[#155a8a] transition"
              >
                Learn More
              </a>
              <a
                href="#contact"
                className="bg-white border border-[#1976d2] text-[#1976d2] font-semibold rounded-xl px-8 py-3 hover:bg-[#e6f0fa] transition"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
            <div className="w-60 h-60 rounded-2xl bg-[#e6f0fa] flex items-center justify-center">
              <span className="text-[#1976d2] text-lg font-semibold opacity-60">
                Photo Placeholder
              </span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-16 px-4 bg-white border-t border-[#e6f0fa]"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0f6cbd] mb-4">About</h2>
            <p className="text-lg text-gray-600">
              AutoProject streamlines your workflow with real-time
              collaboration, intuitive task management, and powerful reporting
              tools. Whether you're a small team or a large organization,
              AutoProject adapts to your needs.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="py-16 px-4 bg-[#f7fafd] border-t border-[#e6f0fa]"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1976d2] mb-4">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {/* Service 1 */}
              <div className="bg-white rounded-xl p-8 border border-[#e6f0fa] flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-xl bg-[#e6f0fa] flex items-center justify-center border border-[#1976d2]/10">
                  <span className="text-[#1976d2] text-base font-semibold opacity-70">
                    Photo
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#1976d2] mb-2">
                  Task Management
                </h3>
                <p className="text-gray-600">
                  Organize, assign, and track tasks with ease. Stay on top of
                  deadlines and priorities.
                </p>
              </div>
              {/* Service 2 */}
              <div className="bg-white rounded-xl p-8 border border-[#e6f0fa] flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-xl bg-[#e6f0fa] flex items-center justify-center border border-[#1976d2]/10">
                  <span className="text-[#1976d2] text-base font-semibold opacity-70">
                    Photo
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#1976d2] mb-2">
                  Collaboration
                </h3>
                <p className="text-gray-600">
                  Work together in real time, share updates, and communicate
                  seamlessly with your team.
                </p>
              </div>
              {/* Service 3 */}
              <div className="bg-white rounded-xl p-8 border border-[#e6f0fa] flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-xl bg-[#e6f0fa] flex items-center justify-center border border-[#1976d2]/10">
                  <span className="text-[#1976d2] text-base font-semibold opacity-70">
                    Photo
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#1976d2] mb-2">
                  Reporting
                </h3>
                <p className="text-gray-600">
                  Gain insights with powerful analytics and reporting features
                  to drive your projects forward.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-16 px-4 bg-white border-t border-[#e6f0fa]"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0f6cbd] mb-4">Contact</h2>
            <p className="text-lg text-gray-600 mb-6">
              Have questions or want to get in touch? Fill out the form below
              and our team will respond promptly.
            </p>
            <form className="flex flex-col gap-4 items-center">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full max-w-md px-4 py-3 rounded-xl border border-[#d1e4f7] bg-[#f7fafd] focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 transition"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full max-w-md px-4 py-3 rounded-xl border border-[#d1e4f7] bg-[#f7fafd] focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 transition"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full max-w-md px-4 py-3 rounded-xl border border-[#d1e4f7] bg-[#f7fafd] focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 transition"
              />
              <button
                type="submit"
                className="bg-[#1976d2] text-white font-semibold rounded-xl px-8 py-3 hover:bg-[#155a8a] transition mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
