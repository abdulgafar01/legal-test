import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LawyerCardProps {
  lawyer: {
    id: number;
    name: string;
    image: string;
    rating: number;
    expertise: string[];
    qualification: string;
    price: number;
    location: string;
    status: string;
  };
  // new prop to indicate if current user has an active subscription
  isSubscribed?: boolean;
}

const LawyerCard = ({ lawyer, isSubscribed = false }: LawyerCardProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleViewProfile = () => {
    router.push(`/dashboard/professionals/${lawyer.id}`);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking book button
    // open the booking modal (select date/time)
    setShowModal(true);
  };

  const handleConfirmBooking = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!date || !time) return;
    if (!isSubscribed) {
      // safety: should never be called when not subscribed because button is disabled,
      // but keep fallback to navigate to subscribe
      router.push("/dashboard/subscribe");
      return;
    }

    try {
      setLoading(true);
      // TODO: call booking API here. For now navigate to a booking confirmation page or details
      router.push(
        `/dashboard/professionals/${lawyer.id}/book?date=${encodeURIComponent(
          date
        )}&time=${encodeURIComponent(time)}`
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    // navigate to subscription/pricing flow
    router.push("/dashboard/subscribe");
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleViewProfile}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Image
            src={lawyer.image}
            alt={lawyer.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
              {lawyer.name}
            </h3>

            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < lawyer.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <span className="font-medium">Expertise:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {lawyer.expertise.map((name, idx) => (
                    <Badge
                      key={`${name}-${idx}`}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Qualification:</span> {lawyer.qualification}
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg inline-block">
              <div className="text-2xl font-bold text-gray-900">${lawyer.price}</div>
              <div className="text-sm text-gray-600">Consultation</div>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Location:</span> {lawyer.location}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {lawyer.status === "available" ? (
            <Button
              className="bg-black text-white hover:bg-gray-800 cursor-pointer"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          ) : (
            <Button
              variant="outline"
              className="bg-gray-100 text-gray-600"
              disabled
              onClick={(e) => e.stopPropagation()}
            >
              Completely Booked
            </Button>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold mb-3">Book {lawyer.name}</h4>

            <div className="space-y-3">
              <label className="block text-sm">
                <span className="font-medium">Select date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium">Select time</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full border rounded px-2 py-1"
                />
              </label>

              {!isSubscribed && (
                <div className="p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                  You need an active subscription to confirm a consultation.{" "}
                  <button
                    className="underline font-medium"
                    onClick={handleSubscribe}
                  >
                    Subscribe now
                  </button>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white"
                  onClick={handleConfirmBooking}
                  disabled={!date || !time || !isSubscribed || loading}
                >
                  {loading ? "Booking..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerCard;
