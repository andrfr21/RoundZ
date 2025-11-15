import { Brain, Lightbulb, Puzzle } from "lucide-react";

const BrainteaserPhase = () => {
  const puzzles = [
    {
      icon: Brain,
      title: "Logic Puzzle",
      description: "You have 8 balls, one is heavier. Find it in 2 weighings.",
    },
    {
      icon: Lightbulb,
      title: "Creative Thinking",
      description: "How would you test a salt shaker in an automated factory?",
    },
    {
      icon: Puzzle,
      title: "Problem Solving",
      description: "Estimate the number of windows in New York City.",
    },
  ];

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-semibold text-phase-brain">Brainteaser Round</h2>
        <p className="text-muted-foreground">
          Demonstrate your problem-solving approach and creative thinking.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {puzzles.map((puzzle, index) => {
          const Icon = puzzle.icon;
          return (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{puzzle.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {puzzle.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground text-center mt-6">
        {/* TODO: AI will select one puzzle and discuss the candidate's approach */}
        Choose a puzzle to discuss your approach
      </div>
    </div>
  );
};

export default BrainteaserPhase;
