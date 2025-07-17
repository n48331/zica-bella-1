"use client";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar isHome={false} />
      <div className="min-h-screen bg-black text-gray-100 flex flex-col md:mt-16 mt-8">
        <main className="flex-1 max-w-2xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold mb-6 text-white">Return and Refund Policy</h1>
          <div className="space-y-4 text-gray-200 text-base">
            <h2 className="text-xl font-semibold mt-6 mb-2">1. General Information</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>This Return and Refund Policy applies to all purchases made on the Zica Bella online store.</li>
              <li>By purchasing from our store, you agree to adhere to these terms.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">2. Return Eligibility</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Items must be returned within 7 days of the delivery date.</li>
              <li>Clothing must be unworn, unwashed, and with all original tags attached.</li>
              <li>Sale items or items marked as "Final Sale" cannot be returned or exchanged.</li>
              <li>Customized or personalized items are not eligible for return.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">3. Refunds</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Once your return is received and inspected, we will send you an email notification about the approval or rejection of your refund.</li>
              <li>If approved, your refund will be processed, and a credit will automatically be applied to your original payment method within 7-10 business days.</li>
              <li>Original shipping costs are non-refundable, except in the case of defective items or errors made by our store.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">4. Exchanges</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We do not offer direct exchanges. If you wish to exchange an item, please return the original item for a refund and place a new order for the desired item.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">5. Damaged or Defective Items</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>If you receive a damaged or defective item, please contact our customer service within 48 hours of receiving the item.</li>
              <li>We may ask for photographic evidence to expedite the process.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">6. Refund Limitations</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Refunded amounts will only include the cost of the item and will exclude original shipping charges unless the return is a result of our error.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">7. Policy Changes</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Zica Bella reserves the right to modify this Return and Refund Policy at any time. Changes will be effective immediately upon being posted on our site.</li>
              <li>Customers are encouraged to review the policy periodically for updates.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Information</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>For questions regarding returns or refunds, please contact our customer service team at <a href="mailto:support@zicabella.com" className="underline text-blue-400">support@zicabella.com</a></li>
            </ul>
            <p className="mt-6">By reporting a return, you agree to the terms outlined above. If you have any questions regarding our Return and Refund Policy, please do not hesitate to reach out.</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 