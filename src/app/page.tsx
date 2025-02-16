export default function Home() {
  const backgroundImage = '/background.png';  
  const logoImage = '/logo.png';  
  const startImage = '/start.png';
  const duckImage = '/duck.png';

  return (
    <main
      className="flex flex-col items-center justify-between"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="z-10 max-w-5xl w-full flex flex-col items-center font-mono text-sm">
        <h1 className="text-6xl font-bold" style={{marginTop: '50px'}}>the duck you mean?</h1>
        <p style={{marginTop: '50px', fontSize: '15px', fontStyle: 'italic'}}>- if you can explain it to a duck, you can explain it to anyone.</p> 
        <p style={{marginTop: '10px', fontSize: '15px', fontStyle: 'italic'}}>- the ai student that quacks back.</p>
        {/* <img src={logoImage} alt="Logo" className="mb-8 w-96 h-auto" /> */}

        <a href="/learn" className="h-10">
          <img src={startImage} alt="Start" style={{width: '500px'}} />
        </a>
      </div>
      <div className="flex w-full justify-end mt-8">
        <img 
          src={duckImage} 
          alt="Duck" 
          className="w-1/2 h-auto object-contain" 
        />
      </div>
    </main>
  );
}
