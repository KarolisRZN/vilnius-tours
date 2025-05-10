import React from "react";

export default function AboutUs() {
  return (
    <section className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img
          src="https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Logo_vivid3-1.png?quality=100.3021072110190"
          alt="Vivid Vilnius Logo"
          className="h-24 mb-6"
        />
        <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
          About Vivid Vilnius
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          <span className="font-semibold text-green-700">Vivid Vilnius</span> –
          is the best choice for your fascinating stay in Vilnius! We offer a
          broad spectrum of sightseeing tours in Vilnius and around, on foot and
          with bicycles. We can suggest special tours and active entertainment
          that best suits your needs.
        </p>
        <p className="text-lg text-gray-700 text-center mb-6">
          Guided tours are led by <span className="font-semibold">Laura</span>{" "}
          and <span className="font-semibold">Remis</span>, while your pleasant
          stay can be captured by photographer{" "}
          <span className="font-semibold">Remis</span>.
        </p>
      </div>
    </section>
  );
}
