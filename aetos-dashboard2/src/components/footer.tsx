const Footer = () => {
  return (
    <footer id="footer" className="w-full border-t border-dashed border-sky-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-shrink-0">
        <div className="text-center text-sm text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} AETOS Intelligence. Built for
            Smart India Hackathon.
          </p>
        </div>
        <div className="flex gap-5 justify-center mt-5 pb-5 text-neutral-500">
          <a className="hover:text-sky-700" href="">
            Kushagra Shukla
          </a>
          <a className="hover:text-sky-700" href="">
            Angelica Singh
          </a>
          <a className="hover:text-sky-700" href="">
            Abhay Singh
          </a>
          <a className="hover:text-sky-700" href="">
            Prajakta Naik
          </a>
          <a className="hover:text-sky-700" href="">
            Aditya
          </a>
          <a className="hover:text-sky-700" href="">
            Abhimanyu Dutta
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;