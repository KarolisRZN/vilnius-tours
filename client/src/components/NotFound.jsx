function NotFound({ message = "Page not found." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700">{message}</p>
    </div>
  );
}

export default NotFound;
