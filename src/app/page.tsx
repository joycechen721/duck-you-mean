export default function Home() {
  const backgroundImage = '/background.png';  
  const logoImage = '/logo.png';  
  const startImage = '/start.png';  

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="z-10 max-w-5xl w-full flex flex-col items-center font-mono text-sm">
        {/* Logo Image */}
        <img src={logoImage} alt="Logo" className="mb-8 w-96 h-auto" />

        {/* Start Button with Image */}
        <a href="/learn" className="mt-8 h-20">
          <img src={startImage} alt="Start" className="w-40 h-auto" />
        </a>
      </div>
    </main>
  );
}
