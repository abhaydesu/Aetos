const Navbar = () => {
  return (
    <header className="sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <nav className="flex justify-between items-center backdrop-blur-xl rounded-full mt-5 py-6 px-6 sm:px-10 border border-neutral-800">
          <div>
            <a href="/">
              <img src="/logo.png" alt="" className="h-6" />
            </a>
          </div>
          <div className="flex gap-8">
            <a
              href="/"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/pricing"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Plans
            </a>
            <a
              href="/dashboard"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/contact"
              className="hidden sm:inline-block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Contact Us
            </a>
            

          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
