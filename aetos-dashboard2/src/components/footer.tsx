import React from 'react';

const teamMembers = [
  { name: "Kushagra Shukla", href: "https://www.linkedin.com/in/kushu30/" },
  { name: "Abhay Singh", href: "https://www.linkedin.com/in/abhaydesu/" },
  { name: "Angelica Singh", href: "https://www.linkedin.com/in/angelica-singh-960079291/" },
  { name: "Prajakta Naik", href: "https://www.linkedin.com/in/prajakta-naik-94784827b/" },
  { name: "Aditya Pujer", href: "https://www.linkedin.com/in/aditya-pujer/" },
  { name: "Abhimanyu Dutta", href: "https://github.com/Caravaleer/" },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12 border-t border-neutral-800"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Logo and Copyright */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <a href="/" aria-label="Home">
            <img src="/logo.png" alt="AETOS Logo" className="h-7 mb-4" />
          </a>
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} AETOS Intelligence.
            <br />
            Built for Smart India Hackathon.
          </p>
        </div>

        {/* Right Side: Team Links */}
        <div className="flex flex-col items-center text-center md:items-end md:text-right">
          <h3 className="font-semibold text-neutral-300 mb-3">Developed by</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-neutral-500">
            {teamMembers.map((member) => (
              <a
                key={member.name}
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                {member.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;