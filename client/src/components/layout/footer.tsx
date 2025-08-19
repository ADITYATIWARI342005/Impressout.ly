import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Resume Builder", href: "#" },
        { label: "Portfolio Generator", href: "#" },
        { label: "Cover Letter Writer", href: "#" },
        { label: "ATS Checker", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Career Tips", href: "#" },
        { label: "Interview Guide", href: "#" },
        { label: "Industry Insights", href: "#" },
        { label: "Templates", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Impressout.ly</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Make your next impression stand out with professional resumes, 
              portfolios, and cover letters designed for today's job market.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-md font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-400 text-sm">
              © {currentYear} Impressout.ly. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <p 
                className="text-gray-400 text-sm flex items-center"
                data-testid="footer-made-with-love"
              >
                Made with{" "}
                <Heart className="h-4 w-4 text-red-500 mx-1 fill-current" />
                by ARES
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
