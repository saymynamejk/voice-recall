import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFirebase } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const FirebaseSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setConfig, isConfigured } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [config, setConfigState] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const handleInputChange = (field: keyof FirebaseConfig, value: string) => {
    setConfigState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields are filled
      const emptyFields = Object.entries(config).filter(([, value]) => !value.trim());
      if (emptyFields.length > 0) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all Firebase configuration fields.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setConfig(config);
      toast({
        title: 'Firebase connected!',
        description: 'Your Firebase project has been configured successfully.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Configuration failed',
        description: 'Please check your Firebase configuration and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isConfigured) {
    return (
      <AppLayout title="Firebase Setup" showBack>
        <div className="max-w-md mx-auto space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Firebase Connected</h2>
            <p className="text-muted-foreground">
              Your Firebase project is configured and ready to use.
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                localStorage.removeItem('nona_firebase_config');
                window.location.reload();
              }}
            >
              Disconnect Firebase
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Firebase Setup" showBack showSettings={false}>
      <div className="max-w-lg mx-auto space-y-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connect Your Firebase</h2>
          <p className="text-sm text-muted-foreground">
            nona uses your Firebase project to store your voice notes securely.
          </p>
        </motion.div>

        {/* Help link */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">Need help setting up Firebase?</span>
            <a
              href="https://firebase.google.com/docs/web/setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Guide <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>

        {/* Configuration form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Firebase Configuration</CardTitle>
            <CardDescription>
              Enter your Firebase project credentials from the Firebase Console.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIza..."
                  value={config.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authDomain">Auth Domain</Label>
                <Input
                  id="authDomain"
                  placeholder="your-app.firebaseapp.com"
                  value={config.authDomain}
                  onChange={(e) => handleInputChange('authDomain', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  placeholder="your-project-id"
                  value={config.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageBucket">Storage Bucket</Label>
                <Input
                  id="storageBucket"
                  placeholder="your-app.appspot.com"
                  value={config.storageBucket}
                  onChange={(e) => handleInputChange('storageBucket', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                <Input
                  id="messagingSenderId"
                  placeholder="123456789012"
                  value={config.messagingSenderId}
                  onChange={(e) => handleInputChange('messagingSenderId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appId">App ID</Label>
                <Input
                  id="appId"
                  placeholder="1:123456789012:web:abc123"
                  value={config.appId}
                  onChange={(e) => handleInputChange('appId', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Firebase'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security note */}
        <p className="text-xs text-center text-muted-foreground px-4">
          Your Firebase credentials are stored locally in your browser and never sent to our servers.
        </p>
      </div>
    </AppLayout>
  );
};

export default FirebaseSetup;
