import { Bell, BellOff, Loader2, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationSettings = () => {
  const { user } = useAuth();

  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    sendNotification,
  } = usePushNotifications();

  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [swStatus, setSwStatus] = useState<string>("Checking...");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    if (showDebug) {
      checkServiceWorkerStatus();
    }
  }, [showDebug]);

  const checkServiceWorkerStatus = async () => {
    addLog("Checking service worker status...");

    if (!("serviceWorker" in navigator)) {
      setSwStatus("❌ Service Worker not supported");
      addLog("Service Worker NOT supported in this browser");
      return;
    }

    try {
      // Verify the SW file is reachable (common HTTPS/prod issue)
      try {
        const resp = await fetch("/sw-push.js", { cache: "no-store" });
        addLog(`sw-push.js fetch: ${resp.status} ${resp.ok ? "(OK)" : "(NOT OK)"}`);
      } catch (e) {
        addLog(`sw-push.js fetch failed: ${String(e)}`);
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      addLog(`Found ${registrations.length} service worker(s)`);

      registrations.forEach((reg, i) => {
        addLog(`SW ${i + 1}: scope=${reg.scope}, active=${!!reg.active}`);
      });

      const pushReg = registrations.find((r) => r.scope.includes("/push/")) || null;
      const rootReg = registrations.find((r) => r.scope === `${location.origin}/`) || null;

      const pushSub = pushReg ? await pushReg.pushManager.getSubscription() : null;
      const rootSub = rootReg ? await rootReg.pushManager.getSubscription() : null;

      if (pushReg) {
        setSwStatus(`✅ Push SW registered (scope: ${pushReg.scope})`);
        addLog("Push service worker found!");
        addLog(`Push subscription: ${pushSub ? "✅ EXISTS" : "⚠️ NONE"}`);
        if (pushSub) addLog(`Push endpoint: ${pushSub.endpoint.substring(0, 60)}...`);
      } else {
        addLog("Push service worker NOT found - needs registration");

        if (rootSub) {
          setSwStatus("⚠️ Legacy push subscription found on root scope");
          addLog(
            "Legacy subscription exists on the main (root) service worker; it may not show notifications. Use Fix Subscription."
          );
          addLog(`Legacy endpoint: ${rootSub.endpoint.substring(0, 60)}...`);
        } else {
          setSwStatus("⚠️ Push SW not registered");
        }
      }

      // Check Notification API
      addLog(`Notification permission: ${Notification.permission}`);
      addLog(`PushManager available: ${"PushManager" in window}`);

      if (!user?.id) {
        addLog("⚠️ You are not logged in. Backend test push cannot target this user.");
      }
    } catch (err) {
      setSwStatus(`❌ Error: ${String(err)}`);
      addLog(`Error checking SW: ${String(err)}`);
    }
  };

  const testLocalNotification = async () => {
    addLog("Testing local notification...");

    if (Notification.permission !== "granted") {
      addLog("Requesting permission...");
      const perm = await Notification.requestPermission();
      addLog(`Permission result: ${perm}`);
      if (perm !== "granted") {
        addLog("❌ Permission denied");
        return;
      }
    }

    try {
      // Try showing notification via service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      const pushReg = registrations.find((r) => r.scope.includes("/push/"));

      if (pushReg && pushReg.active) {
        addLog("Showing notification via Push SW...");
        await pushReg.showNotification("🧪 Test Notification", {
          body: "If you see this, notifications display works!",
          icon: "/favicon.ico",
          tag: "test-" + Date.now(),
          requireInteraction: true,
        });
        addLog("✅ Notification shown via Push SW!");
      } else {
        addLog("Showing notification via Notification API...");
        new Notification("🧪 Test Notification", {
          body: "If you see this, notifications display works!",
          icon: "/favicon.ico",
        });
        addLog("✅ Notification shown via API!");
      }
    } catch (err) {
      addLog(`❌ Error showing notification: ${String(err)}`);
    }
  };

  const testBackendPush = async () => {
    addLog("Sending backend push test...");
    try {
      const res = await sendNotification("🧪 Test Push", "Backend push delivery test", {
        url: window.location.pathname,
        tag: "backend-test-" + Date.now(),
        userIds: user?.id ? [user.id] : undefined,
      });
      addLog("✅ Backend push request succeeded");
      if (res) addLog(`Response: ${JSON.stringify(res)}`);
    } catch (err) {
      addLog(`❌ Backend push request failed: ${String(err)}`);
    }
  };

  const handleFixSubscription = async () => {
    addLog("Fix Subscription: unsubscribing + subscribing fresh...");
    const offOk = await unsubscribe();
    addLog(offOk ? "✅ Unsubscribe OK" : "❌ Unsubscribe failed");

    const onOk = await subscribe();
    addLog(onOk ? "✅ Subscribe OK" : "❌ Subscribe failed");

    await checkServiceWorkerStatus();
  };

  const handleToggle = async () => {
    addLog(`Toggle clicked - currently subscribed: ${isSubscribed}`);

    if (isSubscribed) {
      addLog("Unsubscribing...");
      const ok = await unsubscribe();
      addLog(ok ? "✅ Unsubscribe OK" : "❌ Unsubscribe failed");
    } else {
      addLog("Subscribing...");
      const ok = await subscribe();
      addLog(ok ? "✅ Subscribe OK" : "❌ Subscribe failed");
    }

    await checkServiceWorkerStatus();
  };

  if (!isSupported) {
    return (
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BellOff className="h-4 w-4" />
            Notifications Not Available
          </CardTitle>
          <CardDescription className="text-sm">
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {isSubscribed ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            Push Notifications
          </CardTitle>
          <CardDescription className="text-sm">
            Get notified about new items, approvals, and updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-toggle" className="flex flex-col gap-1">
                  <span>{isSubscribed ? "Notifications Enabled" : "Enable Notifications"}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {permission === "denied"
                      ? "Blocked in browser settings"
                      : isSubscribed
                      ? "You'll receive marketplace updates"
                      : "Turn on to receive updates"}
                  </span>
                </Label>
                <Switch
                  id="push-toggle"
                  checked={isSubscribed}
                  onCheckedChange={handleToggle}
                  disabled={permission === "denied"}
                />
              </div>

              {permission === "denied" && (
                <p className="text-xs text-destructive">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}

              {!isSubscribed && permission !== "denied" && (
                <Button
                  onClick={() => {
                    addLog("Enable button clicked");
                    subscribe();
                  }}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Debug Panel
            </CardTitle>
            <Switch
              checked={showDebug}
              onCheckedChange={(checked) => {
                setShowDebug(checked);
                if (checked) addLog("Debug panel opened");
              }}
            />
          </div>
        </CardHeader>
        {showDebug && (
          <CardContent className="space-y-3">
            <div className="text-xs space-y-1 p-2 bg-muted rounded">
              <p><strong>SW Status:</strong> {swStatus}</p>
              <p><strong>Permission:</strong> {permission}</p>
              <p><strong>Subscribed:</strong> {isSubscribed ? "Yes" : "No"}</p>
              <p><strong>Supported:</strong> {isSupported ? "Yes" : "No"}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={checkServiceWorkerStatus}>
                Refresh Status
              </Button>
              <Button size="sm" variant="outline" onClick={testLocalNotification}>
                Test Notification
              </Button>
              <Button size="sm" variant="outline" onClick={handleFixSubscription}>
                Fix Subscription
              </Button>
              <Button size="sm" variant="outline" onClick={testBackendPush}>
                Backend Test Push
              </Button>
            </div>

            <ScrollArea className="h-40 w-full rounded border bg-muted p-2">
              <div className="font-mono text-[10px] text-foreground space-y-0.5">
                {debugLogs.length === 0 ? (
                  <p className="text-muted-foreground">No logs yet...</p>
                ) : (
                  debugLogs.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default NotificationSettings;
