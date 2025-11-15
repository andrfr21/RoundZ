const TechPhase = () => {
  const codeSnippet = `-- Find top 5 customers by revenue
SELECT 
  c.customer_id,
  c.name,
  SUM(o.total_amount) as revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.name
ORDER BY revenue DESC
LIMIT 5;`;

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-semibold text-phase-tech">Technical Assessment</h2>
        <p className="text-muted-foreground">
          Let's evaluate your technical skills with some coding challenges.
        </p>
      </div>

      <div className="rounded-lg overflow-hidden border border-border bg-card shadow-xl">
        {/* Code editor header */}
        <div className="h-10 bg-secondary border-b border-border flex items-center gap-2 px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-phase-fit" />
          </div>
          <span className="text-xs text-muted-foreground ml-4">query.sql</span>
        </div>

        {/* Code content */}
        <div className="p-6 bg-card">
          <pre className="font-mono text-sm">
            <code className="text-foreground">
              {codeSnippet.split('\n').map((line, i) => (
                <div key={i} className="hover:bg-secondary/30 px-2 py-0.5 -mx-2 transition-colors">
                  <span className="text-muted-foreground/50 inline-block w-8 select-none">
                    {i + 1}
                  </span>
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {/* TODO: This will be interactive with code execution */}
        Explain your approach to optimizing this query
      </div>
    </div>
  );
};

export default TechPhase;
