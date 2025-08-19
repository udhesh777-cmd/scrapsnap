import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, History, Wallet, Settings } from 'lucide-react';

const mockSubmissions = [
  {
    id: 'S12345',
    date: '2024-07-28',
    item: 'Copper Wires & Pipes',
    category: 'Metal',
    value: 45.50,
    status: 'Completed',
  },
  {
    id: 'S12344',
    date: '2024-07-25',
    item: 'Cardboard Boxes',
    category: 'Paper',
    value: 12.00,
    status: 'Completed',
  },
  {
    id: 'S12346',
    date: '2024-07-29',
    item: 'Assorted Plastic Bottles',
    category: 'Plastic',
    value: 8.75,
    status: 'Pending Pickup',
  },
    {
    id: 'S12342',
    date: '2024-07-22',
    item: 'Old Laptop and Monitor',
    category: 'E-Waste',
    value: 25.00,
    status: 'Cancelled',
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Completed':
      return <Badge className="bg-green-600 text-white hover:bg-green-700">Completed</Badge>;
    case 'Pending Pickup':
      return <Badge className="bg-yellow-500 text-primary-foreground hover:bg-yellow-600">Pending Pickup</Badge>;
    case 'Cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <User />
          My Dashboard
        </h1>
        <Button variant="outline"><Settings className="mr-2" /> Account Settings</Button>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="history"><History className="mr-2" /> Submission History</TabsTrigger>
          <TabsTrigger value="payment"><Wallet className="mr-2" /> Payment Options</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Submissions</CardTitle>
              <CardDescription>
                A record of all your scrap collection requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Item Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Est. Value</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.id}</TableCell>
                        <TableCell>{submission.date}</TableCell>
                        <TableCell>{submission.item}</TableCell>
                        <TableCell>{submission.category}</TableCell>
                        <TableCell className="text-right">${submission.value.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={submission.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Preferences</CardTitle>
              <CardDescription>
                Choose how you&apos;d like to receive your payment. Changes will apply to future submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Transfer (IBAN)</Label>
                    <Input id="bank-account" placeholder="DE89 3704 0044 0532 0130 00" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="wallet-id">Mobile Wallet ID</Label>
                    <Input id="wallet-id" placeholder="yourname@walletprovider.com" />
                </div>
                <Button className="bg-accent hover:bg-accent/90">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
