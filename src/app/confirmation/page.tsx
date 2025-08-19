import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Package, Send } from 'lucide-react';

export default function ConfirmationPage() {
    return (
        <div className="flex justify-center items-center py-12">
            <Card className="w-full max-w-lg text-center shadow-lg animate-in fade-in-50">
                <CardHeader className="items-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">Pickup Scheduled!</CardTitle>
                    <CardDescription className="text-base">
                        Thank you for using ScrapSnap. Your request has been received and is being processed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">You can track the status of your pickup in your dashboard. A confirmation email will be sent to you shortly.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                            <Link href="/dashboard">
                                <Package className="mr-2" />
                                Track Request
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/">
                                <Send className="mr-2" />
                                Submit Another
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
