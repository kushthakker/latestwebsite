import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Brace",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <header className="mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-8"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Brace
          </a>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-zinc-500">Last Updated: January 30, 2026</p>
        </header>

        <article className="prose prose-zinc prose-lg max-w-none prose-headings:tracking-tight prose-a:text-zinc-900 prose-a:underline prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500">
          <p>
            Brace (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the Brace personal CRM platform and browser extension. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
          </p>
          <p>
            By using Brace, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and profile information when you create a Brace account</li>
            <li><strong>Authentication Data:</strong> Login credentials and authentication tokens for accessing our services</li>
            <li><strong>User Preferences:</strong> Your settings and preferences within the Brace application</li>
            <li><strong>Payment Information:</strong> If you subscribe to our paid services, we collect payment information through our payment processor, DODO Payments.</li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <p>When you use the Brace browser extension with automation enabled, we may collect:</p>
          <ul>
            <li><strong>LinkedIn Profile Data:</strong> Your LinkedIn profile information (name, headline, profile URL)</li>
            <li><strong>Connection Data:</strong> Information about your LinkedIn connections that you choose to sync</li>
            <li><strong>Message Data:</strong> LinkedIn messages and conversation metadata for contacts you manage in Brace</li>
            <li><strong>Activity Data:</strong> Feed posts and engagement data relevant to your network</li>
            <li><strong>Session Information:</strong> Authentication tokens required to perform actions on your behalf</li>
          </ul>

          <h3>1.3 Technical Information</h3>
          <ul>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
            <li><strong>Usage Data:</strong> How you interact with our services, features used, and timestamps</li>
            <li><strong>Log Data:</strong> IP addresses, error logs, and diagnostic information</li>
          </ul>

          <h3>1.4 Analytics and Session Recordings</h3>
          <p>We use third-party analytics tools, including PostHog, to collect information about your use of the Service. This helps us understand user behavior, improve our Service, and optimize user experience.</p>
          <p>We use PostHog to record user sessions, which may include:</p>
          <ul>
            <li>Your clicks, scrolls, and mouse movements</li>
            <li>Pages you visit and features you interact with</li>
            <li>Text you enter (except for sensitive fields like passwords)</li>
          </ul>
          <p>These recordings help us understand how users interact with our Service, identify usability issues, and improve user experience.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li><strong>Provide Services:</strong> Sync your LinkedIn network to your Brace CRM, display contacts and conversations, and execute actions you initiate</li>
            <li><strong>Maintain Functionality:</strong> Authenticate your sessions, process your requests, and ensure service reliability</li>
            <li><strong>Improve Services:</strong> Analyze usage patterns to enhance features and user experience</li>
            <li><strong>Communicate:</strong> Send service-related notifications, updates, and respond to your inquiries</li>
            <li><strong>Security:</strong> Detect, prevent, and address technical issues and security threats</li>
          </ul>

          <div className="not-prose my-8 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
            <p className="font-semibold text-zinc-900 mb-3">We Do NOT:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700 text-[15px]">
              <li>Sell your personal data to third parties</li>
              <li>Use your data for advertising purposes</li>
              <li>Share your data with third parties for their marketing purposes</li>
              <li>Use your data for creditworthiness determination or lending purposes</li>
              <li>Train AI models on your personal content without explicit consent</li>
            </ul>
          </div>

          <div className="not-prose my-8 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
            <p className="font-semibold text-zinc-900 mb-2">Google API Services Limited Use Disclosure:</p>
            <p className="text-zinc-700 text-[15px]">
              The use of information received from Google APIs will adhere to the{" "}
              <a href="https://developer.chrome.com/docs/webstore/program-policies/limited-use" className="text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-500" target="_blank" rel="noopener noreferrer">
                Chrome Web Store User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </div>

          <h2>3. Data Storage and Security</h2>

          <h3>3.1 Where We Store Data</h3>
          <ul>
            <li><strong>Local Browser Storage:</strong> Session data, preferences, and authentication tokens are stored locally in your browser</li>
            <li><strong>Brace Servers:</strong> CRM data is stored on our secure servers (backend.brace.so) for synchronization across devices</li>
          </ul>

          <h3>3.2 Security Measures</h3>
          <p>We implement appropriate technical and organizational measures to protect your data:</p>
          <ul>
            <li>All data transfers use HTTPS encryption (TLS 1.2+)</li>
            <li>Authentication tokens are securely stored and transmitted</li>
            <li>Access to production systems is restricted and logged</li>
            <li>Regular security assessments and monitoring</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>We may share your information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our services (hosting, analytics, authentication), bound by confidentiality obligations</li>
            <li><strong>Payment Processors:</strong> Payment information is processed by our Merchant of Record, DODO Payments</li>
            <li><strong>Analytics Providers:</strong> We use PostHog for analytics and session recording to improve our Service</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
            <li><strong>Safety and Rights:</strong> To protect the safety, rights, or property of Brace, our users, or others</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice provided to you</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
          </ul>

          <h3>4.1 Large Language Model (LLM) Providers</h3>
          <p>We use third-party LLM providers to process data and generate insights. These providers include:</p>
          <ul>
            <li>Google (Gemini)</li>
            <li>Anthropic (Claude)</li>
            <li>OpenAI (GPT)</li>
          </ul>
          <p>When you use our Service, your data may be processed by these LLM providers according to their respective terms of service and privacy policies. Please note:</p>
          <ul>
            <li>We only share data necessary for the performance of our Service</li>
            <li>The data shared with LLM providers is subject to their respective privacy policies</li>
            <li>Our agreements with these providers include appropriate data protection provisions</li>
          </ul>

          <h4>Google (Gemini)</h4>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google Terms of Service</a></li>
          </ul>

          <h4>Anthropic (Claude)</h4>
          <ul>
            <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropic Privacy Policy</a></li>
            <li><a href="https://www.anthropic.com/terms" target="_blank" rel="noopener noreferrer">Anthropic Terms of Service</a></li>
          </ul>

          <h4>OpenAI (GPT)</h4>
          <ul>
            <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></li>
            <li><a href="https://openai.com/policies/terms-of-use" target="_blank" rel="noopener noreferrer">OpenAI Terms of Use</a></li>
          </ul>

          <h2>5. Browser Extension Permissions</h2>
          <p>The Brace browser extension requests the following permissions:</p>

          <div className="not-prose my-6 overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900">Permission</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr><td className="px-4 py-2.5 text-zinc-700">cookies</td><td className="px-4 py-2.5 text-zinc-600">Detect LinkedIn login status to determine when sync is possible</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">storage</td><td className="px-4 py-2.5 text-zinc-600">Store user preferences, settings, and session data locally</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">tabs</td><td className="px-4 py-2.5 text-zinc-600">Manage LinkedIn tabs for data synchronization operations</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">scripting</td><td className="px-4 py-2.5 text-zinc-600">Execute data sync scripts on LinkedIn pages when automation is enabled</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">webRequest</td><td className="px-4 py-2.5 text-zinc-600">Capture session tokens necessary for API access</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">alarms</td><td className="px-4 py-2.5 text-zinc-600">Schedule periodic data synchronization tasks</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Host Permissions</h3>
          <div className="not-prose my-6 overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900">Domain</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-900">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr><td className="px-4 py-2.5 text-zinc-700">*.linkedin.com</td><td className="px-4 py-2.5 text-zinc-600">Access LinkedIn to sync your network data to Brace CRM</td></tr>
                <tr><td className="px-4 py-2.5 text-zinc-700">*.brace.so</td><td className="px-4 py-2.5 text-zinc-600">Communicate with Brace backend services</td></tr>
              </tbody>
            </table>
          </div>

          <h2>6. Your Rights and Controls</h2>

          <h3>6.1 User Controls</h3>
          <ul>
            <li><strong>Toggle Automation:</strong> Enable or disable automation at any time via the extension popup</li>
            <li><strong>Account Settings:</strong> Update your profile and preferences at app.brace.so</li>
            <li><strong>Uninstall:</strong> Remove the browser extension to delete all locally stored data</li>
          </ul>

          <h3>6.2 Data Rights</h3>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request your data in a portable, machine-readable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your personal information</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:privacy@brace.so">privacy@brace.so</a>.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to:</p>
          <ul>
            <li>Provide our services to you</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce agreements</li>
          </ul>
          <p>When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.</p>

          <h2>8. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.</p>

          <h2>9. GDPR Compliance (European Users)</h2>
          <p>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland:</p>
          <ul>
            <li>We process your data under legal bases including: consent, contract performance, legitimate interests, and legal obligations</li>
            <li>You have the rights described in Section 6.2 above</li>
            <li>You may lodge a complaint with your local data protection authority</li>
            <li>Brace acts as the Data Controller for your personal information</li>
          </ul>

          <h2>10. CCPA Compliance (California Users)</h2>
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li>Know what personal information we collect and how it is used</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of the &ldquo;sale&rdquo; of personal information (note: we do not sell personal information)</li>
            <li>Non-discrimination for exercising your privacy rights</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:privacy@brace.so">privacy@brace.so</a> or use the controls in your account settings.</p>

          <h2>11. Cookies and Tracking</h2>
          <p>Our extension uses essential cookies and local storage to:</p>
          <ul>
            <li>Maintain your authentication session</li>
            <li>Store your preferences and settings</li>
            <li>Enable core functionality</li>
          </ul>
          <p>We do not use third-party advertising or tracking cookies in the browser extension.</p>

          <h2>12. Children&apos;s Privacy</h2>
          <p>Brace is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we discover that we have collected information from a child under 18, we will delete that information promptly.</p>

          <h2>13. Third-Party Services</h2>
          <p>Our services may integrate with third-party platforms (such as LinkedIn). Your use of these platforms is governed by their respective privacy policies. We encourage you to review:</p>
          <ul>
            <li><a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">LinkedIn Privacy Policy</a></li>
          </ul>

          <div className="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <p className="text-zinc-700 text-[15px]">
              <strong>Important:</strong> You are responsible for ensuring your use of Brace complies with LinkedIn&apos;s Terms of Service. Brace provides tools for personal network management, and users should use these tools responsibly.
            </p>
          </div>

          <h2>14. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Updating the &ldquo;Last Updated&rdquo; date</li>
            <li>Sending an email notification for significant changes</li>
          </ul>
          <p>Your continued use of Brace after changes become effective constitutes acceptance of the revised policy.</p>

          <h2>15. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@brace.so">privacy@brace.so</a></li>
            <li><strong>Website:</strong> <a href="https://brace.so">brace.so</a></li>
          </ul>

          <p className="mt-12 text-sm text-zinc-400">&copy; 2026 Brace. All rights reserved.</p>
        </article>
      </div>
    </div>
  );
}
