"use client";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar isHome={false} />
      <div className="min-h-screen bg-black text-gray-100 flex flex-col md:mt-16 mt-8">
        <main className="flex-1 max-w-2xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
          <div className="space-y-4 text-gray-200 text-base">
            <p>At Zica Bella, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our online store.</p>
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
            <ul className="list-disc ml-6 mb-4">
              <li><b>Personal Information:</b> Name, email address, shipping address, billing address, phone number, and payment details.</li>
              <li><b>Order Information:</b> Details of products purchased, order history, and transaction information.</li>
              <li><b>Usage Data:</b> IP address, browser type, device information, and browsing activity on our site.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>To process and fulfill your orders.</li>
              <li>To communicate with you about your orders, account, or customer service inquiries.</li>
              <li>To send you promotional emails, newsletters, and marketing communications (you may opt out at any time).</li>
              <li>To improve our website, products, and services.</li>
              <li>To detect and prevent fraud or other unauthorized activities.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We do not sell, trade, or rent your personal information to third parties.</li>
              <li>We may share your information with trusted service providers who assist us in operating our website, processing payments, delivering orders, or providing customer support.</li>
              <li>We may disclose your information if required by law or to protect our rights, property, or safety.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies and Tracking Technologies</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.</li>
              <li>You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our site.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.</li>
              <li>However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights and Choices</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>You may review, update, or delete your personal information by contacting us at <a href="mailto:support@zicabella.com" className="underline text-blue-400">support@zicabella.com</a>.</li>
              <li>You may opt out of marketing communications at any time by following the unsubscribe instructions in our emails.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Privacy Policy</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:support@zicabella.com" className="underline text-blue-400">support@zicabella.com</a>.</li>
            </ul>
            <p className="mt-6">By using our website, you consent to the terms of this Privacy Policy.</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 