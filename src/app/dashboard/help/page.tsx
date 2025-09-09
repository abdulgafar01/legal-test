import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/profile" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        </div>

        <Card className="shadow-card mb-4">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Getting started</h2>
            <p className="text-gray-700 mb-4">If you are a legal practitioner, complete your profile and add your specializations so clients can find you. Ensure your qualifications and licenses are up to date.</p>

            <h2 className="text-lg font-semibold mb-2">Booking & Consultations</h2>
            <p className="text-gray-700 mb-4">Clients can book consultations through your profile. Ensure your availability is accurate. Payments are processed securely; consult our support for disputes.</p>

            <h2 className="text-lg font-semibold mb-2">Legal guidance</h2>
            <p className="text-gray-700 mb-4">We provide a platform to connect clients with licensed practitioners. Our content is for informational purposes and not a substitute for professional legal advice. Always confirm advice with a qualified attorney in your jurisdiction.</p>

            <h2 className="text-lg font-semibold mb-2">Contact support</h2>
            <p className="text-gray-700">For further help, email <a className="text-blue-600 underline" href="mailto:support@example.com">support@example.com</a> or use the in-app chat.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">How do I update my specializations?</h3>
                <p className="text-gray-700">Go to Settings → Specializations. If you need additional specializations added, contact support with your credentials.</p>
              </div>

              <div>
                <h3 className="font-medium">How are practitioners verified?</h3>
                <p className="text-gray-700">Practitioner documents are verified by our moderation team. Verification may take several business days.</p>
              </div>

              <div>
                <h3 className="font-medium">Can I cancel a booking?</h3>
                <p className="text-gray-700">Cancellations depend on the practitioner's policy. Check the consultation terms when booking and contact support for disputes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
