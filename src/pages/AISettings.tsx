import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  FileText,
  Tag,
  Folders,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { AIProvider } from '@/types';
import { cn } from '@/lib/utils';

interface ProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  keyPlaceholder: string;
  keyPrefix: string;
  docsUrl: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Fast and capable, great for transcription',
    keyPlaceholder: 'AIza...',
    keyPrefix: 'AIza',
    docsUrl: 'https://ai.google.dev/',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 for analysis, best overall quality',
    keyPlaceholder: 'sk-...',
    keyPrefix: 'sk-',
    docsUrl: 'https://platform.openai.com/',
  },
  {
    id: 'whisper-openai',
    name: 'OpenAI Whisper',
    description: 'Best-in-class transcription accuracy',
    keyPlaceholder: 'sk-...',
    keyPrefix: 'sk-',
    docsUrl: 'https://platform.openai.com/',
  },
  {
    id: 'grok',
    name: 'xAI Grok',
    description: 'Conversational summaries with personality',
    keyPlaceholder: 'xai-...',
    keyPrefix: 'xai-',
    docsUrl: 'https://x.ai/',
  },
];

const AISettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, setSettings } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const selectedProvider = PROVIDERS.find((p) => p.id === settings.aiSettings.provider);

  const handleProviderChange = (provider: AIProvider) => {
    setSettings({
      ...settings,
      aiSettings: { ...settings.aiSettings, provider },
    });
    setApiKey('');
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast({
        title: 'API key required',
        description: 'Please enter your API key first.',
        variant: 'destructive',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // In production: make actual API call to test the key
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success (in production, actually test the key)
      if (apiKey.startsWith(selectedProvider?.keyPrefix || '')) {
        setTestResult('success');
        toast({
          title: 'Connection successful!',
          description: `Your ${selectedProvider?.name} API key is valid.`,
        });
      } else {
        throw new Error('Invalid key format');
      }
    } catch (error) {
      setTestResult('error');
      toast({
        title: 'Connection failed',
        description: 'Please check your API key and try again.',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveKey = () => {
    if (testResult !== 'success') {
      toast({
        title: 'Test required',
        description: 'Please test your API key before saving.',
        variant: 'destructive',
      });
      return;
    }

    // In production: securely store the API key
    setSettings({
      ...settings,
      aiSettings: { ...settings.aiSettings, apiKey },
    });

    toast({
      title: 'API key saved',
      description: 'Your AI features are now enabled.',
    });
  };

  const toggleFeature = (feature: 'autoTranscribe' | 'autoTitle' | 'autoTags' | 'autoBucketDetection') => {
    setSettings({
      ...settings,
      aiSettings: {
        ...settings.aiSettings,
        [feature]: !settings.aiSettings[feature],
      },
    });
  };

  return (
    <AppLayout title="AI Settings" showBack>
      <div className="space-y-6">
        {/* Info banner */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            nona uses your own API keys (BYOK). Your data is sent directly to your chosen provider.
            We never see your keys or data.
          </AlertDescription>
        </Alert>

        {/* Provider Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Provider</CardTitle>
            <CardDescription>
              Choose which AI service to use for transcription and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={settings.aiSettings.provider}
              onValueChange={(v) => handleProviderChange(v as AIProvider)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div>
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {provider.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProvider && (
              <a
                href={selectedProvider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Get a {selectedProvider.name} API key →
              </a>
            )}
          </CardContent>
        </Card>

        {/* API Key */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder={selectedProvider?.keyPlaceholder}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  testResult === 'success' ? 'text-success' : 'text-destructive'
                )}
              >
                {testResult === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Connection verified
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Connection failed
                  </>
                )}
              </motion.div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={!apiKey || testing}
                className="flex-1"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleSaveKey}
                disabled={testResult !== 'success'}
                className="flex-1"
              >
                Save Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Features</CardTitle>
            <CardDescription>
              Choose which AI features to enable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Auto-transcribe</Label>
                  <p className="text-xs text-muted-foreground">
                    Convert voice to text automatically
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.aiSettings.autoTranscribe}
                onCheckedChange={() => toggleFeature('autoTranscribe')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Auto-title</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate titles from transcripts
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.aiSettings.autoTitle}
                onCheckedChange={() => toggleFeature('autoTitle')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Auto-tags</Label>
                  <p className="text-xs text-muted-foreground">
                    Extract tags from content
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.aiSettings.autoTags}
                onCheckedChange={() => toggleFeature('autoTags')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folders className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Auto-categorize</Label>
                  <p className="text-xs text-muted-foreground">
                    Suggest bucket based on content
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.aiSettings.autoBucketDetection}
                onCheckedChange={() => toggleFeature('autoBucketDetection')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data transparency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                Audio is sent only for transcription, then deleted
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                Transcripts are sent for analysis features you enable
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                All AI content is labeled and can be deleted
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                Your API keys are stored locally, never on our servers
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AISettings;
