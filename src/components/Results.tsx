import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const performanceData = [
  { metric: "Accuracy", value: 94.6 },
  { metric: "Precision", value: 92.8 },
  { metric: "Recall", value: 93.5 },
  { metric: "F1-Score", value: 93.1 }
];

const colors = ["hsl(217, 91%, 40%)", "hsl(188, 95%, 42%)", "hsl(33, 100%, 62%)", "hsl(217, 91%, 50%)"];

export const Results = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Performance{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Metrics
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-PAL delivers exceptional accuracy and reliability in adaptive learning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Model Evaluation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="metric" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Achievements */}
            <div className="space-y-4">
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-primary">✓</div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">High Accuracy</h4>
                      <p className="text-sm text-muted-foreground">
                        Achieved 94.6% accuracy with AUC-ROC of 0.96, ensuring reliable feedback 
                        for diverse student responses.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-secondary">✓</div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Balanced Performance</h4>
                      <p className="text-sm text-muted-foreground">
                        Precision (92.8%) and Recall (93.5%) demonstrate the model's ability to 
                        accurately identify both correct understanding and misconceptions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-accent">✓</div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Real-World Validation</h4>
                      <p className="text-sm text-muted-foreground">
                        Tested with 60 Computer Science students, confirming effectiveness 
                        in actual classroom environments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-1">0.96</div>
                <p className="text-xs text-muted-foreground">AUC-ROC Score</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-secondary mb-1">&lt;100ms</div>
                <p className="text-xs text-muted-foreground">Response Time</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-accent mb-1">100%</div>
                <p className="text-xs text-muted-foreground">Privacy Compliant</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-1">8GB</div>
                <p className="text-xs text-muted-foreground">RAM Footprint</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
