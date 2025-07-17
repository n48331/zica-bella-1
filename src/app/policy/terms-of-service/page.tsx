"use client";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar isHome={false} />
      <div className="min-h-screen bg-black text-gray-100 flex flex-col md:mt-16 mt-8">
        <main className="flex-1 max-w-2xl mx-auto py-16 px-4">
          <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
          <div className="space-y-4 text-gray-200 text-base">
            <p>This website is operated by ZICA BELLA. Throughout the site, the terms  we ,  us , and  our  refer to ZICA BELLA. We offer this website including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
            <p>By visiting our website and/or purchasing something from us, you engage in our  Service  and agree to be bound by the following Terms and Conditions ( Terms of Service , Terms), including any additional terms, conditions, and policies referenced herein or available by hyperlink. These Terms apply to all users of the site, including but not limited to browsers, vendors, customers, merchants, and contributors of content.</p>
            <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms.</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 