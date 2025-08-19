import ScrapForm from '@/components/scrap-form';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
        Turn Your Scrap into Cash
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground mb-8">
        Got scrap? Snap a picture, tell us where you are, and we&apos;ll handle the rest. Get a fair price for your reusable materials, hassle-free.
      </p>
      <ScrapForm />
    </div>
  );
}
