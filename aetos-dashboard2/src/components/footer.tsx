const Footer = () => {
  return (
    <footer
          id="footer"
          className="flex-shrink-0 w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-dashed border-sky-800"
        >
          <div className="text-center text-sm text-neutral-500">
            <p>
              &copy; {new Date().getFullYear()} AETOS Intelligence. Built for
              Smart India Hackathon.
            </p>
          </div>
          <div className="flex gap-5 justify-center mt-5 pb-5 text-neutral-500 ">
            <a target="_blank" className="hover:text-sky-700" href="https://www.linkedin.com/in/kushu30/">
              Kushagra Shukla
            </a>
            <a target="_blank" className="hover:text-sky-700" href="https://www.linkedin.com/in/angelica-singh-960079291/">
              Angelica Singh
            </a>
            <a target="_blank"className="hover:text-sky-700" href="https://www.linkedin.com/in/abhaydesu/">
              Abhay Singh
            </a>
            <a target="_blank" className="hover:text-sky-700" href="https://www.linkedin.com/in/prajakta-naik-94784827b/">
              Prajakta Naik
            </a>
            <a target="_blank" className="hover:text-sky-700" href="https://www.linkedin.com/in/aditya-pujer/">
              Aditya
            </a>
            <a target="_blank" className="hover:text-sky-700" href="https://github.com/Caravaleer/">
              Abhimanyu Dutta
            </a>
          </div>
        </footer>
  )
}

export default Footer;