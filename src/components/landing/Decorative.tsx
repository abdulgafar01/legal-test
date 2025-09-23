export function GridPattern(){
  return (
    <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.04] text-black pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export function GradientBlob({ className=''}:{className?:string}){
  return (
    <div className={`absolute blur-3xl opacity-30 rounded-full mix-blend-multiply ${className}`}></div>
  );
}

export function DividerWave(){
  return (
    <div className="relative w-full h-20 overflow-hidden">
      <svg viewBox="0 0 1440 320" className="absolute inset-0 w-full h-full" preserveAspectRatio="none"><path fill="#FEF7D4" fillOpacity="1" d="M0,96L48,85.3C96,75,192,53,288,69.3C384,85,480,139,576,160C672,181,768,171,864,149.3C960,128,1056,96,1152,112C1248,128,1344,192,1392,224L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"/></svg>
    </div>
  );
}
