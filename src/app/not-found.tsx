import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="font-display text-8xl md:text-9xl font-bold text-primary">404</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
          Page Not Found
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
          Try going back to the homepage or use our free tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/#tools"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-border rounded-lg font-display font-bold text-foreground hover:bg-muted/50 transition"
          >
            Try Free Tools
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground">
          <p className="mb-2">Or contact us directly:</p>
          <a
            href="https://wa.me/+254711669113"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            WhatsApp: +254 711 669 113
          </a>
        </div>
      </div>
    </div>
  );
}
