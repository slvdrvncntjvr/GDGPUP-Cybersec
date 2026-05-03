import MobileNav from "../MobileNav";

export default function MobileNavExample() {
  return (
    <div className="min-h-[200px] bg-background relative">
      <p className="p-4 text-muted-foreground text-center">
        Mobile navigation appears at the bottom on small screens
      </p>
      <MobileNav />
    </div>
  );
}
