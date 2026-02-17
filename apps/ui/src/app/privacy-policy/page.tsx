import React from "react"

function PrivacyPolicy() {
  return (
    <div className="bg-[#FDF9F0] text-[#253430] font-sans py-12 md:py-20 ">
      {/* Inline Scroller Styles to match Methodology */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-table-scroller::-webkit-scrollbar {
          height: 10px;
        }
        .custom-table-scroller::-webkit-scrollbar-track {
          background: #D4EAE4;
          border-radius: 50px;
        }
        .custom-table-scroller::-webkit-scrollbar-thumb {
          background: #3A6B5E;
          border-radius: 50px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-table-scroller::-webkit-scrollbar-thumb:hover {
          background: #2D5248;
          background-clip: content-box;
        }
      `,
        }}
      />

      <div className="mx-auto px-[16px] md:px-10">
        <h2 className="text-center methodology-header-main-mobile md:methodology-header-main-desktop tracking-[0.7px] md:tracking-[2px] mb-7 md:uppercase">
          Privacy Policy
        </h2>

        <div className="space-y-4 opacity-90 methodology-body-mobile md:methodology-body-desktop">
          <p className="italic">Last updated: 01/2026</p>

          <p>
            This Privacy Policy describes how the Finer Planet
            Platform ("we", "our", or "the Platform") collects, uses, and
            protects information when you access and use this website and its
            research tools (collectively, the "Services").
          </p>

          <p>
            The Platform is designed for academic discovery, research
            evaluation, and institutional analysis. We are committed to
            respecting user privacy and handling information in a responsible
            and transparent manner.
          </p>

          <div className="pt-4">
            <h3 className="mb-2 methodology-header-mobile md:methodology-header-desktop">
              What Information We Collect
            </h3>
            <p>
              The Platform primarily operates on publicly available academic
              data. We collect limited user information necessary to operate and
              improve the Services:
            </p>
            <ul className="list-disc ml-10 mt-2 space-y-1">
              <li>
                <strong>Basic usage data:</strong> Pages viewed, filters
                applied, and interactions with rankings.
              </li>
              <li>
                <strong>Device and browser data:</strong> Browser type,
                operating system, and screen size.
              </li>
              <li>
                <strong>Network information:</strong> IP address and approximate
                location.
              </li>
              <li>
                <strong>Cookies and session data:</strong> Used to maintain
                sessions and improve user experience.
              </li>
              <li>
                <strong>Voluntary contact data:</strong> Email or messages if
                you contact us for support.
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h3 className="mb-2 methodology-header-mobile md:methodology-header-desktop">
              How We Use This Information
            </h3>
            <div className="space-y-3">
              <p>
                <strong>Platform Operation:</strong> To provide search,
                filtering, rankings, and research analytics functionality.
              </p>
              <p>
                <strong>Improvement and Performance:</strong> To analyze usage
                patterns and improve accuracy, speed, and usability of the
                platform.
              </p>
              <p>
                <strong>Security:</strong> To protect against abuse,
                unauthorized access, and technical threats.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="mb-4 methodology-header-mobile md:methodology-header-desktop">
              Data Disclosure Categories
            </h3>
            <div className="overflow-x-auto rounded-t-lg shadow-sm mb-4 custom-table-scroller">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-[#1F3936] text-white table-head-mobile md:font-Forma-DJR-400 md:text-mobile-h4-size">
                  <tr>
                    <th className="p-2 md:p-4">Category</th>
                    <th className="p-2 md:p-4">Categories of Recipients</th>
                  </tr>
                </thead>
                <tbody className="text-[#4A5568] table-body-mobile md:table-body-desktop divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-2 md:p-4 border-r border-gray-100 font-medium">
                      Usage Data
                    </td>
                    <td className="p-2 md:p-4">
                      Hosting Providers, Analytics Services
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-2 md:p-4 border-r border-gray-100 font-medium">
                      Device & Network Info
                    </td>
                    <td className="p-2 md:p-4">
                      Security, Cloud Infrastructure, Performance Monitoring
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-2 md:p-4 border-r border-gray-100 font-medium">
                      Contact Data
                    </td>
                    <td className="p-2 md:p-4">
                      Support and Communication Systems
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="mb-2 methodology-header-mobile md:methodology-header-desktop">
              Your Rights and Choices
            </h3>
            <p>
              Depending on your location, you may have rights regarding how your
              information is used:
            </p>
            <ul className="list-disc ml-10 mt-2 space-y-1">
              <li>Right to request access to stored data.</li>
              <li>Right to request deletion of personal information.</li>
              <li>Right to request correction of inaccurate data.</li>
              <li>Right to limit or object to certain data processing.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="opacity-90">
              If you have any questions about this Privacy Policy or how data is
              handled on this platform, you may contact:
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfVwX7Yff1nSb0dIK75cT1vryZMCx2g-w1bnD1KkQ77sA9wWg/viewform?pli=1"
              className="text-[#2F7664] hover:scale-105 transition-transform duration-300 ease-in-out underline mt-1 inline-block font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
