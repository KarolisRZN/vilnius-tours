import { useState, useEffect } from "react";

const images = [
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Onos-Bernardinu-baznycia.jpg?quality=100.3021072110190",
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/05/Gedimino-pilis.jpg?quality=100.3021072110190",
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Observatorijos-kiemas.jpg?quality=100.3021072110190",
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Universitetas.jpg?quality=100.3021072110190",
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Katedros-pozemiai.jpg?quality=100.3021072110190",
  "https://www.vividvilnius.lt/en/wp-content/uploads/sites/2/2016/04/Prezidentura.jpg?quality=100.3021072110190"
];

function Home() {
  const [current, setCurrent] = useState(0);

  // Auto-change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden m-0 p-0">
      <div
        className="relative w-full"
        style={{ height: "540px", maxWidth: "100vw" }}
      >
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover shadow transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{ top: 0, left: 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center">
            Welcome to Vilnius Tours!
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-white text-center max-w-2xl drop-shadow">
            Discover the beauty of Vilnius with our exclusive tours. Browse our
            offers and book your next adventure!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
