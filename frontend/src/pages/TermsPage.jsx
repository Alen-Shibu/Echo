import { useEffect } from 'react'
import './terms.css'

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="terms-wrapper">
      <div className="terms-right">
        <div className="terms-card">
          <h2 className="terms-title">Terms of Service</h2>
          <p className="terms-updated">Last Updated: March 30, 2026</p>

          <section className="terms-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using Echo ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the 
              above, please do not use this service.
            </p>
          </section>

          <section className="terms-section">
            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Echo for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>3. User Accounts</h3>
            <p>
              When you create an account on Echo, you must provide accurate, complete, and 
              current information. You are responsible for maintaining the confidentiality of 
              your password and for all activities that occur under your account. You agree to 
              notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="terms-section">
            <h3>4. User Content</h3>
            <p>
              You retain all rights to any content you submit, post or display on Echo. By 
              submitting content, you grant Echo a worldwide, non-exclusive, royalty-free 
              license to use, copy, reproduce, process, adapt, modify, publish, transmit, 
              display and distribute such content.
            </p>
          </section>

          <section className="terms-section">
            <h3>5. Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Harass, threaten, embarrass or cause distress or discomfort to any individual</li>
              <li>Obscene or abusive language or materials of any kind</li>
              <li>Disrupt the normal flow of dialogue in our community</li>
              <li>Attempt to gain unauthorized access to restricted portions of Echo</li>
              <li>Participate in any form of spamming or unsolicited advertising</li>
              <li>Transmit any viruses or malicious code</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>6. Intellectual Property Rights</h3>
            <p>
              The content of Echo, excluding user-submitted content, including but not limited 
              to text, graphics, logos, images, audio clips, digital downloads, and data 
              compilations is the property of Echo and/or its content suppliers and is protected 
              by international copyright laws.
            </p>
          </section>

          <section className="terms-section">
            <h3>7. Disclaimer of Warranties</h3>
            <p>
              The materials on Echo are provided on an 'as is' basis. Echo makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, 
              without limitation, implied warranties or conditions of merchantability, fitness 
              for a particular purpose, or non-infringement of intellectual property or other 
              violation of rights.
            </p>
          </section>

          <section className="terms-section">
            <h3>8. Limitation of Liability</h3>
            <p>
              In no event shall Echo or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business 
              interruption) arising out of the use or inability to use the materials on Echo, 
              even if we or an authorized representative has been notified orally or in writing 
              of the possibility of such damage.
            </p>
          </section>

          <section className="terms-section">
            <h3>9. Accuracy of Materials</h3>
            <p>
              The materials appearing on Echo could include technical, typographical, or 
              photographic errors. Echo does not warrant that any of the materials on the 
              Service are accurate, complete, or current. Echo may make changes to the 
              materials contained on the Service at any time without notice.
            </p>
          </section>

          <section className="terms-section">
            <h3>10. Links</h3>
            <p>
              Echo has not reviewed all of the sites linked to its website and is not responsible 
              for the contents of any such linked site. The inclusion of any link does not imply 
              endorsement by Echo of the site. Use of any such linked website is at the user's 
              own risk.
            </p>
          </section>

          <section className="terms-section">
            <h3>11. Modifications</h3>
            <p>
              Echo may revise these Terms of Service at any time without notice. By using the 
              Service, you are agreeing to be bound by the then current version of these Terms 
              of Service.
            </p>
          </section>

          <section className="terms-section">
            <h3>12. Governing Law</h3>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the 
              laws of the jurisdiction in which Echo operates, and you irrevocably submit to the 
              exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="terms-section">
            <h3>13. Contact Information</h3>
            <p>
              If you have any questions about these Terms of Service, please contact us at: 
              <strong>support@echo.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
