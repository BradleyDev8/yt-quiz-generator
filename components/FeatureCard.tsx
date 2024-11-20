export default function FeatureCard({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  }