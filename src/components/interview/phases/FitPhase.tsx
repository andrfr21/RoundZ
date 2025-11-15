const FitPhase = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        {/* Animated ripple rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-primary/30 animate-ripple" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animation-delay-500">
          <div className="w-48 h-48 rounded-full border-2 border-primary/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Central logo */}
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/50 animate-pulse-glow">
          <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
            <span className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              RZ
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-phase-fit">Cultural Fit Assessment</h2>
        <p className="text-muted-foreground max-w-md">
          Let's get to know each other. Share your background, values, and what drives you professionally.
        </p>
      </div>
    </div>
  );
};

export default FitPhase;
