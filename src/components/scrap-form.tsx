"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { estimateAction } from '@/app/actions';
import type { EstimateScrapValueOutput } from '@/ai/flows/estimate-scrap-value';
import { Loader2, Upload, Trash2, Calendar, MapPin, DollarSign, Tag, CheckCircle, Hammer, Bot, MonitorSmartphone } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const scrapTypes = [
  { id: 'metal', label: 'Metal', icon: Hammer },
  { id: 'plastic', label: 'Plastic', icon: Bot },
  { id: 'e-waste', label: 'E-Waste', icon: MonitorSmartphone },
];

const formSchema = z.object({
  photo: z.any().refine((files) => files?.length == 1, 'A photo is required.'),
  scrapType: z.string({ required_error: 'Please select a scrap type.'}),
  description: z.string().min(10, 'Please provide a more detailed description.').max(500),
  address: z.string().min(10, 'Please enter a valid pickup address.').max(200),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScrapForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'summary' | 'confirming'>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [estimation, setEstimation] = useState<EstimateScrapValueOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      address: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setStatus('loading');
    const formData = new FormData();
    formData.append('photo', values.photo[0]);
    formData.append('description', `${values.scrapType} - ${values.description}`);
    formData.append('address', values.address);

    try {
      const result = await estimateAction(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      setEstimation(result.data);
      setStatus('summary');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Estimation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setStatus('idle');
    }
  };
  
  const handleConfirmPickup = () => {
    setStatus('confirming');
    toast({
        title: "Scheduling Pickup...",
        description: "Your request is being finalized.",
    });
    setTimeout(() => {
        router.push('/confirmation');
    }, 1000);
  };

  if (status === 'summary' && estimation) {
    return (
      <Card className="w-full max-w-2xl text-left shadow-lg animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><CheckCircle className="text-green-500" /> Estimation Complete!</CardTitle>
          <CardDescription>Here is the estimated value for your scrap. Please review and schedule a pickup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted">
                    {preview && <Image src={preview} alt="Scrap preview" layout="fill" objectFit="cover" data-ai-hint="scrap metal"/>}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Estimated Value</p>
                            <p className="text-2xl font-bold">${estimation.estimatedValue.toFixed(2)}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Tag className="w-6 h-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="text-lg font-semibold capitalize">{estimation.category}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">Confidence: {(estimation.confidence * 100).toFixed(0)}%. This is an estimate and the final value may vary.</p>
                </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold font-headline flex items-center gap-2"><Calendar className="w-5 h-5" /> Select Pickup Time</h3>
                <RadioGroup defaultValue="24h" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="24h" id="r1" />
                        <Label htmlFor="r1">Flexible (within 24 hours)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="48h" id="r2" />
                        <Label htmlFor="r2">Standard (1-2 business days)</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id="r3" disabled/>
                        <Label htmlFor="r3">Schedule a specific time (coming soon)</Label>
                    </div>
                </RadioGroup>
            </div>

        </CardContent>
        <CardFooter>
            <Button onClick={handleConfirmPickup} className="w-full bg-accent hover:bg-accent/90" size="lg" disabled={status === 'confirming'}>
                {status === 'confirming' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</> : 'Confirm Pickup'}
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Submit Your Scrap</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scrap Photo</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="photo-upload"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleFileChange(e);
                            }}
                            disabled={status === 'loading'}
                        />
                        <Label
                            htmlFor="photo-upload"
                            className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors min-h-[150px]"
                        >
                            {preview ? (
                                <div className="relative w-full aspect-video">
                                    <Image src={preview} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" data-ai-hint="scrap pile"/>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Click or drag to upload</span>
                                </>
                            )}
                        </Label>
                        {preview && (
                             <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 rounded-full h-8 w-8 z-10"
                                onClick={() => {
                                    setPreview(null);
                                    form.resetField('photo');
                                    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                                    if(fileInput) fileInput.value = '';
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="scrapType"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Type of Scrap</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                        >
                            {scrapTypes.map((type) => (
                                <FormItem key={type.id}>
                                    <FormControl>
                                        <RadioGroupItem value={type.id} className="sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor={type.id}
                                        className={cn(
                                            "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                            field.value === type.id && "border-primary"
                                        )}
                                    >
                                        <type.icon className="w-8 h-8 mb-2" />
                                        {type.label}
                                    </Label>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A pile of copper wires and some aluminum cans." {...field} disabled={status === 'loading'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} disabled={status === 'loading'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg" disabled={status === 'loading'}>
              {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Estimating...</> : 'Get Estimated Value'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    