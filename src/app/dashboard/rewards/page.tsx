
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Gift, 
  Coins, 
  Users, 
  Copy, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Wallet,
  Star,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCookie } from "cookies-next";
import { 
  getUserById, 
  getRewardTransactions, 
  getReferrals, 
  generateReferralCode 
} from "@/app/actions";
import type { User, RewardTransaction, Referral } from "@/lib/types";

export default function RewardsPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [rewardTransactions, setRewardTransactions] = React.useState<RewardTransaction[]>([]);
  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [referralCode, setReferralCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      const userId = getCookie('loggedInUserId');
      if (userId) {
        try {
          const [userData, rewardData, referralData] = await Promise.all([
            getUserById(userId.toString()),
            getRewardTransactions(userId.toString()),
            getReferrals(userId.toString())
          ]);
          
          if (userData) {
            setUser(userData);
            setRewardTransactions(rewardData);
            setReferrals(referralData);
            
            // Generate referral code if not exists
            if (!userData.referralCode) {
              const code = await generateReferralCode(userData.id);
              setReferralCode(code);
            } else {
              setReferralCode(userData.referralCode);
            }
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
      setLoading(false);
    }
    
    loadData();
  }, []);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral code copied!",
      description: "Share this code with your friends to earn rewards.",
    });
  };

  const completedReferrals = referrals.filter(r => r.status === 'Completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'Pending').length;
  const totalEarnings = rewardTransactions
    .filter(t => t.status === 'Active' && t.type !== 'Used')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your rewards...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reward Wallet</h1>
          <p className="text-muted-foreground">Earn cashback and referral bonuses</p>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">₦{(user.rewardBalance || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(user.rewardBalance || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready to use as discount</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All-time rewards earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReferrals}</div>
            <p className="text-xs text-muted-foreground">{10 - (completedReferrals % 10)} more for ₦5,000 bonus</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  How Cashback Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Earn 2% Cashback</p>
                    <p className="text-sm text-muted-foreground">Get 2% back on every successful booking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Use as Discount</p>
                    <p className="text-sm text-muted-foreground">Apply rewards when making new bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">₦5,000 Bonus</p>
                    <p className="text-sm text-muted-foreground">When 10 referrals make their first booking</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral-code">Your Referral Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="referral-code"
                      value={referralCode}
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={copyReferralCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                Progress: {completedReferrals} completed referrals ({10 - (completedReferrals % 10)} more for next bonus)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No referrals yet. Start sharing your code!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{referral.refereeName}</p>
                        <p className="text-sm text-muted-foreground">{referral.refereeEmail}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={referral.status === 'Completed' ? 'default' : 'secondary'}
                          className="mb-1"
                        >
                          {referral.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {referral.status === 'Completed' ? 
                            `Completed ${referral.dateCompleted}` : 
                            `Joined ${referral.dateReferred}`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {rewardTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rewardTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${
                          transaction.type === 'Cashback' ? 'bg-green-100 text-green-600' :
                          transaction.type === 'Referral Bonus' ? 'bg-blue-100 text-blue-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'Cashback' ? <Coins className="h-4 w-4" /> :
                           transaction.type === 'Referral Bonus' ? <Users className="h-4 w-4" /> :
                           <Wallet className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'Used' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'Used' ? '-' : '+'}₦{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Coming Soon:</strong> You'll be able to use your reward balance as discount on new bookings. 
          Keep earning through cashback and referrals!
        </AlertDescription>
      </Alert>
    </div>
  );
}
