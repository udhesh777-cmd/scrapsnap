"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, CheckCircle, Phone } from 'lucide-react';

export default function Footer() {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim().length < 10) {
            toast({
                variant: 'destructive',
                title: 'Feedback Too Short',
                description: 'Please provide at least 10 characters of feedback.',
            });
            return;
        }
        
        console.log('Feedback submitted:', feedback);
        setSubmitted(true);
        setFeedback('');
        toast({
            title: 'Feedback Received!',
            description: "Thank you for helping us improve ScrapSnap.",
        });
    };

    return (
        <footer className="bg-card border-t mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-xl mx-auto">
                    {submitted ? (
                        <div className="text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-headline font-bold">Thank You!</h3>
                            <p className="text-muted-foreground">We've received your feedback.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                                <MessageSquarePlus />
                                Got Feedback?
                            </h3>
                            <Textarea
                                placeholder="Tell us what you think or how we can improve..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                            />
                            <Button type="submit" className="w-full sm:w-auto">Send Feedback</Button>
                        </form>
                    )}
                </div>
                 <div className="text-center text-xs text-muted-foreground mt-8 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>Customer Care: 6382483903</span>
                    </div>
                    <p>&copy; {new Date().getFullYear()} ScrapSnap. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
