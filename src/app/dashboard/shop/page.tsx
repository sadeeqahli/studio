
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function ShopPage() {
  return (
    <div>
        <h1 className="text-lg font-semibold md:text-2xl mb-4">Our Shop</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon!</CardTitle>
                <CardDescription>Get ready for awesome football gear.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-12 text-muted-foreground">
                <ShoppingCart className="h-24 w-24 mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">The Naija Pitch Connect Store is on its way!</h2>
                <p>We're working hard to bring you a curated selection of footballs, jerseys, boots, and more.</p>
                <p>Stay tuned for the launch!</p>
            </CardContent>
        </Card>
    </div>
  )
}
