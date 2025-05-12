import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-6 z-50 bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition"
      aria-label="Back to top"
    >
      ↑
    </button>
  ) : null;
}
