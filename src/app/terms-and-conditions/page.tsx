import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Brace",
};

export default function TermsAndConditionsPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-zinc-500">Last Updated: January 30, 2026</p>
        </header>

        <article className="prose prose-zinc prose-lg max-w-none prose-headings:tracking-tight prose-a:text-zinc-900 prose-a:underline prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500">
          <p>
            Welcome to Brace. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Brace personal CRM platform, browser extension, and related services (collectively, the &ldquo;Service&rdquo;) provided by Brace (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, installing the browser extension, or otherwise using Brace, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p>
          <p>
            We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website or through the Service. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.
          </p>

          <h2>2. Description of Service</h2>
          <p>Brace is a personal CRM that helps you manage your professional network. The Service includes:</p>
          <ul>
            <li>A web application at app.brace.so for managing contacts and relationships</li>
            <li>A browser extension that syncs data from LinkedIn to your Brace CRM</li>
            <li>Features to organize, track, and engage with your professional network</li>
          </ul>

          <h2>3. Eligibility</h2>
          <p>To use Brace, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into a binding agreement</li>
            <li>Not be prohibited from using the Service under applicable laws</li>
            <li>Maintain valid accounts on any third-party platforms you connect to Brace</li>
          </ul>

          <h2>4. Account Registration</h2>

          <h3>4.1 Account Creation</h3>
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security and confidentiality of your login credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access or security breach</li>
          </ul>

          <h3>4.2 Account Restrictions</h3>
          <ul>
            <li>You may only maintain one account per person</li>
            <li>You may not share your account credentials with others</li>
            <li>You may not transfer your account to another person</li>
          </ul>

          <h2>5. Acceptable Use</h2>

          <h3>5.1 Permitted Uses</h3>
          <p>You may use Brace for:</p>
          <ul>
            <li>Managing your personal and professional relationships</li>
            <li>Organizing contact information and communication history</li>
            <li>Legitimate business networking and relationship management</li>
          </ul>

          <h3>5.2 Prohibited Conduct</h3>
          <p>You agree NOT to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any laws</li>
            <li>Violate the terms of service of any third-party platform connected to Brace</li>
            <li>Engage in spam, harassment, or unsolicited messaging at scale</li>
            <li>Scrape, harvest, or collect data for purposes other than personal CRM use</li>
            <li>Sell, resell, or commercially exploit data obtained through Brace</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Use automated systems (bots, scripts) beyond the intended extension functionality</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use the Service to build a competing product</li>
            <li>Circumvent any access restrictions or security measures</li>
          </ul>

          <div className="not-prose my-8 rounded-xl border border-red-200 bg-red-50/50 p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-3">5.3 Third-Party Platform Compliance</h3>
            <p className="text-zinc-700 text-[15px]">
              <strong>IMPORTANT:</strong> You are solely responsible for ensuring your use of Brace complies with the terms of service of any third-party platforms, including but not limited to LinkedIn.
            </p>
            <p className="text-zinc-700 text-[15px] mt-3">LinkedIn and other platforms may have policies regarding automation, data access, and third-party tools. We strongly recommend you:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700 text-[15px] mt-2">
              <li>
                Review{" "}
                <a href="https://www.linkedin.com/legal/user-agreement" className="text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-500" target="_blank" rel="noopener noreferrer">
                  LinkedIn&apos;s User Agreement
                </a>
              </li>
              <li>Use Brace responsibly and within reasonable limits</li>
              <li>Avoid excessive automation that may trigger rate limits</li>
              <li>Not use Brace for mass outreach or spam campaigns</li>
            </ul>
            <p className="text-zinc-700 text-[15px] mt-3"><strong>Brace is not affiliated with LinkedIn and is not liable for any actions taken by LinkedIn against your account.</strong></p>
          </div>

          <h2>6. Intellectual Property</h2>

          <h3>6.1 Our Intellectual Property</h3>
          <p>
            The Service, including its original content, features, functionality, design, and underlying technology, is owned by Brace and protected by intellectual property laws. You may not:
          </p>
          <ul>
            <li>Copy, modify, or distribute our software or content</li>
            <li>Use our trademarks, logos, or branding without permission</li>
            <li>Remove any copyright or proprietary notices</li>
          </ul>

          <h3>6.2 Your Content</h3>
          <p>
            You retain ownership of any content you submit to Brace. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, process, and display your content solely for the purpose of providing and improving the Service.
          </p>

          <h3>6.3 Feedback</h3>
          <p>
            If you provide feedback, suggestions, or ideas about the Service, you grant us the right to use such feedback without obligation to you.
          </p>

          <h2>7. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{" "}
            <a href="/privacy-policy">Privacy Policy</a>
            , which explains how we collect, use, and protect your information. By using the Service, you consent to our privacy practices.
          </p>

          <h2>8. Third-Party Services and Integrations</h2>

          <h3>8.1 Third-Party LLM Providers</h3>
          <p>
            The Service uses third-party large language model (LLM) providers, including but not limited to Google (Gemini), Anthropic (Claude), and OpenAI (GPT) to process and analyze data. By using the Service, you acknowledge that:
          </p>
          <ul>
            <li>Your data may be transmitted to these third parties for processing</li>
            <li>These third parties operate under their own terms of service and privacy policies</li>
            <li>Your use of any outputs generated by these LLMs is subject to the respective provider&apos;s policies</li>
            <li>Brace makes no warranties regarding the accuracy, reliability, or appropriateness of LLM outputs</li>
          </ul>

          <h3>8.2 Google API Services User Data Policy</h3>
          <p>
            Our use of information received from Google APIs adheres to the{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>
            , including its Limited Use requirements.
          </p>

          <h3>8.3 Payment Processing</h3>
          <p>
            Payments are processed by our Merchant of Record, DODO Payments. When making a purchase, you will be subject to DODO Payments&apos; terms of service and privacy policy.
          </p>

          <h2>9. Subscription and Payment</h2>

          <h3>9.1 Subscription Plans</h3>
          <p>
            We offer various subscription plans with different features and pricing. The features and limitations of each plan are described on our website.
          </p>

          <h3>9.2 Payment</h3>
          <p>
            You agree to pay all fees specified for the subscription plan you select. All payments must be made through our authorized payment processors.
          </p>

          <h3>9.3 Billing Cycle</h3>
          <p>
            Subscriptions are billed in advance on a recurring basis (monthly, annually, or as otherwise specified). You will be billed on the same date each billing period.
          </p>

          <h3>9.4 Automatic Renewal</h3>
          <p>
            Your subscription will automatically renew unless you cancel it or we terminate it. You authorize us to charge your payment method for the subscription plan on a recurring basis.
          </p>

          <h3>9.5 Refund Policy</h3>
          <p>
            We offer a limited refund policy based on usage thresholds. You may be eligible for a refund if, within 7 days of purchase:
          </p>
          <ul>
            <li>You have performed fewer than 10 natural searches, AND</li>
            <li>You have run fewer than 2 AutoPilot group runs</li>
          </ul>
          <p>
            To request a refund, please contact our support team. We reserve the right to deny refunds if you have exceeded these usage thresholds.
          </p>

          <h3>9.6 Price Changes</h3>
          <p>
            We may change our subscription fees from time to time. If we change our fees, we will provide notice of the change on the website or by email, at our option, at least 14 days before the change is to take effect. Your continued use of the Service after the fee change becomes effective constitutes your agreement to pay the modified fee amount.
          </p>

          <h2>10. Disclaimers</h2>

          <div className="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-3 uppercase">10.1 &ldquo;As Is&rdquo; Service</h3>
            <p className="text-zinc-700 text-[15px] uppercase">
              THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
          </div>

          <h3>10.2 No Guarantees</h3>
          <p>We do not warrant that:</p>
          <ul>
            <li>The Service will be uninterrupted, error-free, or secure</li>
            <li>Data synced from third-party platforms will be accurate or complete</li>
            <li>The Service will meet your specific requirements</li>
            <li>Any errors or defects will be corrected</li>
            <li>Third-party platforms will continue to allow integration with Brace</li>
          </ul>

          <h3>10.3 Third-Party Services</h3>
          <p>
            We are not responsible for the availability, accuracy, or content of third-party services integrated with Brace. Your use of third-party services is at your own risk and subject to their terms.
          </p>

          <h2>11. Limitation of Liability</h2>

          <div className="not-prose my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <p className="text-zinc-700 text-[15px] uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRACE AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-700 text-[15px] mt-2 uppercase">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Any damages arising from your use of or inability to use the Service</li>
              <li>Any actions taken by third-party platforms (including LinkedIn) against your account</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Any third-party conduct or content</li>
            </ul>
            <p className="text-zinc-700 text-[15px] uppercase mt-4">
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU HAVE PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED US DOLLARS ($100), WHICHEVER IS GREATER.
            </p>
          </div>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Brace and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&apos; fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights or applicable laws</li>
            <li>Your content or data submitted to the Service</li>
            <li>Any actions taken by third-party platforms as a result of your use of Brace</li>
          </ul>

          <h2>13. Termination</h2>

          <h3>13.1 Termination by You</h3>
          <p>
            You may stop using the Service and close your account at any time by contacting us at{" "}
            <a href="mailto:support@brace.so">support@brace.so</a>
            {" "}or through your account settings.
          </p>

          <h3>13.2 Termination by Us</h3>
          <p>We may suspend or terminate your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to:</p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Conduct that we believe is harmful to other users or the Service</li>
            <li>Requests by law enforcement or government agencies</li>
            <li>Discontinuation or modification of the Service</li>
          </ul>

          <h3>13.3 Effect of Termination</h3>
          <p>Upon termination:</p>
          <ul>
            <li>Your right to use the Service will immediately cease</li>
            <li>You must uninstall the browser extension</li>
            <li>We may delete your account and data in accordance with our Privacy Policy</li>
            <li>Provisions that by their nature should survive will remain in effect</li>
          </ul>

          <h2>14. Governing Law and Dispute Resolution</h2>

          <h3>14.1 Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
          </p>

          <h3>14.2 Informal Resolution</h3>
          <p>
            Before filing any claim, you agree to first contact us at{" "}
            <a href="mailto:legal@brace.so">legal@brace.so</a>
            {" "}and attempt to resolve the dispute informally for at least 30 days.
          </p>

          <h3>14.3 Jurisdiction</h3>
          <p>
            Any legal action arising from these Terms shall be brought exclusively in the federal or state courts located in Delaware, and you consent to the personal jurisdiction of such courts.
          </p>

          <h2>15. General Provisions</h2>

          <h3>15.1 Entire Agreement</h3>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Brace regarding the Service.
          </p>

          <h3>15.2 Severability</h3>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>

          <h3>15.3 Waiver</h3>
          <p>
            Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
          </p>

          <h3>15.4 Assignment</h3>
          <p>
            You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.
          </p>

          <h3>15.5 Force Majeure</h3>
          <p>
            We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, government actions, or internet service failures.
          </p>

          <h3>15.6 No Agency</h3>
          <p>
            Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and Brace.
          </p>

          <h2>16. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@brace.so">legal@brace.so</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@brace.so">support@brace.so</a></li>
            <li><strong>Website:</strong> <a href="https://brace.so">brace.so</a></li>
          </ul>

          <p className="mt-12 text-sm text-zinc-400">&copy; 2026 Brace. All rights reserved.</p>
        </article>
      </div>
    </div>
  );
}
