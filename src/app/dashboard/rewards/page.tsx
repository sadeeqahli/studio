
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
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { 
  getUserById, 
  getRewardTransactions, 
  getReferrals, 
  generateReferralCode 
} from "@/app/actions";
import type { User, RewardTransaction, Referral } from "@/lib/types";
import { RewardsClient } from "./rewards-client";
import { notFound } from "next/navigation";

export default async function RewardsPage() {
  const userId = getCookie('loggedInUserId', { cookies });
  
  if (!userId) {
    notFound();
  }

  try {
    const [userData, rewardData, referralData] = await Promise.all([
      getUserById(userId.toString()),
      getRewardTransactions(userId.toString()),
      getReferrals(userId.toString())
    ]);
    
    if (!userData) {
      notFound();
    }

    // Generate referral code if not exists
    let referralCode = userData.referralCode;
    if (!referralCode) {
      referralCode = await generateReferralCode(userData.id);
    }

    return (
      <RewardsClient 
        user={userData}
        rewardTransactions={rewardData}
        referrals={referralData}
        referralCode={referralCode}
      />
    );
  } catch (error) {
    console.error('Error loading data:', error);
    notFound();
  }
}
