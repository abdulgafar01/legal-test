import InvertedRadiusCard from "./InvertedRadiusCard";


export default function DemoPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10 space-y-10">
     <InvertedRadiusCard src="/placeholderImage.png" />

{/* OR without image */}
<InvertedRadiusCard className="bg-indigo-600 text-white p-6">
  <h2 className="text-xl font-semibold">AI Assistant</h2>
  <p className="text-sm mt-2">Smart legal research at your fingertips</p>
</InvertedRadiusCard>

    </section>
  );
}
