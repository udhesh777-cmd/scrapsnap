'use server';

import { z } from 'zod';
import type { EstimateScrapValueOutput } from '@/ai/flows/estimate-scrap-value';

const actionSchema = z.object({
    photo: z.instanceof(File, { message: 'A photo is required.' }).refine(file => file.size > 0, 'A photo is required.'),
    description: z.string(),
    address: z.string(),
    scrapType: z.enum(['metal', 'plastic', 'e-waste']),
    weight: z.string().min(1, 'Please enter an estimated weight.'),
});

type ActionResponse = {
    data?: EstimateScrapValueOutput;
    error?: string;
}

const getPricePerKg = (scrapType: 'metal' | 'plastic' | 'e-waste'): number => {
    switch (scrapType) {
        case 'metal':
            return 30;
        case 'plastic':
            return 20;
        case 'e-waste':
            return 300;
        default:
            return 0;
    }
}

export async function estimateAction(formData: FormData): Promise<ActionResponse> {
    const rawFormData = {
        photo: formData.get('photo'),
        description: formData.get('description'),
        address: formData.get('address'),
        scrapType: formData.get('scrapType'),
        weight: formData.get('weight'),
    };

    const parsed = actionSchema.safeParse(rawFormData);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((issue) => issue.message).join(', ');
        return { error: `Invalid form data: ${issues}` };
    }
    
    const { scrapType, weight, description, address, photo } = parsed.data;

    try {
        const weightInKg = parseFloat(weight.replace(/[^0-9.-]+/g,""));
        if (isNaN(weightInKg) || weightInKg <= 0) {
            return { error: 'Invalid weight. Please enter a positive number.' };
        }
        
        const pricePerKg = getPricePerKg(scrapType);
        const estimatedValue = pricePerKg * weightInKg;

        const result: EstimateScrapValueOutput = {
            category: scrapType,
            estimatedValue,
            confidence: 1.0, // Fixed confidence since it's a direct calculation
        };

        // Log details to simulate sending an email
        console.log('--- NEW SCRAP SUBMISSION ---');
        console.log('Send to: udhesh777@gmail.com');
        console.log('Scrap Type:', scrapType);
        console.log('Weight:', weight);
        console.log('Estimated Value:', `₹${estimatedValue.toFixed(2)}`);
        console.log('Description:', description);
        console.log('Address:', address);
        console.log('Photo Name:', photo.name);
        console.log('Photo Size:', photo.size);
        console.log('--------------------------');


        return { data: result };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to calculate estimation. Please try again later.' };
    }
}
