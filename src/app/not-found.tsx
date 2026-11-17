import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-paper px-5 pt-24 text-center">
      <div>
        <p className="label">Error 404</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.4rem)]">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-2">The link may be old or mistyped. Everything else is one click away.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" arrow>
            Go to homepage
          </Button>
          <Button href="/assessment" variant="outline">
            Free growth score
          </Button>
        </div>
      </div>
    </section>
  );
}
