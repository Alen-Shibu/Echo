import { useEffect } from 'react'
import './privacy.css'

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="privacy-wrapper">
      <div className="privacy-right">
        <div className="privacy-card">
          <h2 className="privacy-title">Privacy Policy</h2>
          <p className="privacy-updated">Last Updated: March 30, 2026</p>

          <section className="privacy-section">
            <h3>1. Introduction</h3>
            <p>
              Welcome to Echo. We are committed to protecting your privacy and ensuring 
              you have a positive experience on our platform. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          <section className="privacy-section">
            <h3>2. Information We Collect</h3>
            <p>We may collect information about you in a variety of ways, including:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, password, and profile information</li>
              <li><strong>Communication Data:</strong> Messages, chat content, and user interactions</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns</li>
              <li><strong>Cookies:</strong> Information stored on your device to enhance user experience</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>3. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Authenticate your account and ensure security</li>
              <li>Deliver personalized content and communication features</li>
              <li>Improve and optimize our platform performance</li>
              <li>Monitor and analyze usage trends</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>4. Information Sharing</h3>
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              However, we may share information with:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform</li>
              <li>Legal authorities when required by law</li>
              <li>Other users when you choose to share messages or content</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>5. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect 
              your personal information against unauthorized access, alteration, disclosure, 
              or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="privacy-section">
            <h3>6. Your Rights</h3>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct or update your information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>7. Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. 
              You can control cookie settings in your browser preferences.
            </p>
          </section>

          <section className="privacy-section">
            <h3>8. Third-Party Links</h3>
            <p>
              Our platform may contain links to third-party websites. We are not responsible 
              for their privacy practices. Please review their privacy policies before 
              providing any personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h3>9. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, 
              please contact us at: <strong>privacy@echo.com</strong>
            </p>
          </section>

          <section className="privacy-section">
            <h3>10. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any significant changes by updating the "Last Updated" date above.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
