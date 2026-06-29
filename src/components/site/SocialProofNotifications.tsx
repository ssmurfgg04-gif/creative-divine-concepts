"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Calendar, Download, Eye } from "lucide-react";

const NOTIFICATIONS = [
  { icon: ShoppingBag, text: "James from Nairobi ordered 50 custom T-shirts", color: "text-green-500" },
  { icon: Calendar, text: "Amina from UK booked a diaspora strategy call", color: "text-blue-500" },
  { icon: Download, text: "David from Kiambu downloaded the VAT calculator", color: "text-orange-500" },
  { icon: Eye, text: "Someone in Westlands is using the 3D Mannequin tool", color: "text-purple-500" },
  { icon: ShoppingBag, text: "Sarah from Mombasa ordered DTF gang sheet printing", color: "text-green-500" },
  { icon: Calendar, text: "Brian from Nakuru started a branding project", color: "text-blue-500" },
];

export function SocialProofNotifications() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first notification after 10 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Hide after 5 seconds, show next after 20 seconds
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    const nextTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % NOTIFICATIONS.length);
      setVisible(true);
    }, 20000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [visible, current]);

  if (!visible) return null;

  const notif = NOTIFICATIONS[current];
  const Icon = notif.icon;

  return (
    <div className="fixed bottom-24 left-4 sm:left-6 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="nura-card p-3 flex items-center gap-3 shadow-lg">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 ${notif.color} shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs text-foreground leading-tight">{notif.text}</p>
      </div>
    </div>
  );
}
