'use server';

import { estimateScrapValue, EstimateScrapValueOutput } from '@/ai/flows/estimate-scrap-value';
import { z } from 'zod';

const actionSchema = z.object({
    photo: z.instanceof(File, { message: 'A photo is required.' }).refine(file => file.size > 0, 'A photo is required.'),
    description: z.string(),
    address: z.string(),
});

type ActionResponse = {
    data?: EstimateScrapValueOutput;
    error?: string;
}

export async function estimateAction(formData: FormData): Promise<ActionResponse> {
    const rawFormData = {
        photo: formData.get('photo'),
        description: formData.get('description'),
        address: formData.get('address'),
    };

    const parsed = actionSchema.safeParse(rawFormData);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((issue) => issue.message).join(', ');
        return { error: `Invalid form data: ${issues}` };
    }
    
    const { photo, description } = parsed.data;

    try {
        const buffer = await photo.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const photoDataUri = `data:${photo.type};base64,${base64}`;

        const result = await estimateScrapValue({
            photoDataUri,
            description,
        });

        return { data: result };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get estimation from AI. Please try again later.' };
    }
}
