function Terms() {
  return (
    <div className="bg-[#FDF9F0] text-[#253430] font-sans py-12 md:py-20">
      {/* Inline Scroller Styles */}
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
          Terms Of Service
        </h2>

        <div className="space-y-4 opacity-90 methodology-body-mobile md:methodology-body-desktop">
          <p>
            This website is operated by <strong>Finer Planet</strong>.
            Throughout the site, the terms “we”, “us” and “our” refer to
            Finer Planet. By accessing our site or purchasing products or
            services from us, you agree to be bound by these Terms and
            Conditions.
          </p>

          <p>
            These Terms apply to all users of the site, including browsers,
            customers, vendors, and contributors of content. If you do not agree
            with any part of these Terms, you may not use our website or
            services.
          </p>

          <p>
            We reserve the right to update or change these Terms at any time.
            Continued use of the website after changes are posted constitutes
            acceptance of the updated Terms.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Online Store Terms
          </h3>
          <p>
            By using this site, you confirm that you are at least the age of
            majority in your place of residence. You may not use our products
            for any illegal or unauthorized purpose, nor violate any laws in
            your jurisdiction.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            General Conditions
          </h3>
          <p>
            We reserve the right to refuse service to anyone at any time. You
            may not copy, reproduce, sell, or exploit any portion of the Service
            without our written permission.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Product Information & Pricing
          </h3>
          <p>
            Prices, descriptions, and availability of products are subject to
            change without notice. We do not guarantee that product images and
            colors displayed on your device will be accurate.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Orders & Billing
          </h3>
          <p>
            We reserve the right to refuse or cancel any order. You agree to
            provide accurate and complete billing and account information for
            all purchases made at our store.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Third-Party Services
          </h3>
          <p>
            Our website may contain links to third-party services. We are not
            responsible for the content, policies, or practices of any third
            party websites.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            User Content
          </h3>
          <p>
            Any comments, ideas, or submissions you provide may be used by us
            without restriction. You confirm that your submissions do not
            violate any third-party rights.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Disclaimer & Liability
          </h3>
          <p>
            The Service is provided “as is” and “as available”. We do not
            guarantee uninterrupted or error-free service. To the fullest extent
            permitted by law, Finer Planet shall not be liable for any
            damages arising from use of the Service.
          </p>

          <h3 className="methodology-header-mobile md:methodology-header-desktop">
            Governing Law
          </h3>
          <p>
            These Terms shall be governed by and interpreted according to the
            laws of the United States.
          </p>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="methodology-header-mobile md:methodology-header-desktop">
              Contact Information
            </h3>
            <div className="pt-4 border-t border-gray-200">
              <p className="opacity-90">
                If you have any questions about this Privacy Policy or how data
                is handled on this platform, you may contact:
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
    </div>
  )
}

export default Terms
