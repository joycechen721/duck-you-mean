export default function Home() {
  const backgroundImage = '/background.png';  // Correct path to the public folder

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {/* Add your heading or content here */}
          Welcome to Duck You Mean!
        </h1>
        <div className="flex justify-center mt-8">
          <a
            href="/learn"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Learn
          </a>
        </div>
      </div>
    </main>
  );
}
