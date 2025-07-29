import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
}

const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{lawyer.name}</h3>
            
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < lawyer.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <span className="font-medium">Expertise:</span> {lawyer.expertise.join(" - ")}
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
            <Button className="bg-black text-white hover:bg-gray-800">
              Book Now
            </Button>
          ) : (
            <Button variant="outline" className="bg-gray-100 text-gray-600" disabled>
              Completely Booked
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerCard;
