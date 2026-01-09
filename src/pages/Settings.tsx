import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mic,
  Brain,
  Palette,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Database,
  Volume2,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useFirebase, useAuth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  action?: React.ReactNode;
  danger?: boolean;
}

function SettingItem({ icon, label, description, onClick, action, danger }: SettingItemProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 text-left transition-colors',
        onClick && 'hover:bg-muted/50',
        danger && 'text-destructive'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          danger ? 'bg-destructive/10' : 'bg-muted'
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {action || (onClick && <ChevronRight className="w-5 h-5 text-muted-foreground" />)}
    </Wrapper>
  );
}

const Settings = () => {
  const navigate = useNavigate();
  const { settings, setSettings } = useApp();
  const { isConfigured } = useFirebase();
  const { user } = useAuth();

  const handleAudioQualityChange = (quality: 'standard' | 'high' | 'lossless') => {
    setSettings({ ...settings, audioQuality: quality });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings({ ...settings, theme });
  };

  const handleLogout = () => {
    // In production: call Firebase signOut
    console.log('Logout');
  };

  return (
    <AppLayout title="Settings" showBack>
      <div className="space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">Account</h2>
          <Card className="overflow-hidden divide-y divide-border">
            {user ? (
              <SettingItem
                icon={<User className="w-5 h-5" />}
                label={user.displayName || 'User'}
                description={user.email || undefined}
                onClick={() => navigate('/settings/account')}
              />
            ) : (
              <SettingItem
                icon={<User className="w-5 h-5" />}
                label="Sign In"
                description="Sync your data across devices"
                onClick={() => navigate('/auth')}
              />
            )}
            <SettingItem
              icon={<Database className="w-5 h-5" />}
              label="Firebase"
              description={isConfigured ? 'Connected' : 'Not configured'}
              onClick={() => navigate('/setup/firebase')}
            />
          </Card>
        </section>

        {/* Audio Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">Audio</h2>
          <Card className="overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Recording Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Higher quality uses more storage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'high', 'lossless'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => handleAudioQualityChange(quality)}
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      settings.audioQuality === quality
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {settings.audioQuality === 'standard' && '16kHz mono • Smallest file size'}
                {settings.audioQuality === 'high' && '44.1kHz mono • Balanced quality'}
                {settings.audioQuality === 'lossless' && '48kHz stereo • Best quality'}
              </p>
            </div>
          </Card>
        </section>

        {/* AI Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">AI Features</h2>
          <Card className="overflow-hidden divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">AI Features</p>
                  <p className="text-sm text-muted-foreground">
                    Transcription, summaries, and more
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.aiSettings.enabled}
                onCheckedChange={(enabled) =>
                  setSettings({
                    ...settings,
                    aiSettings: { ...settings.aiSettings, enabled },
                  })
                }
              />
            </div>

            {settings.aiSettings.enabled && (
              <SettingItem
                icon={<Brain className="w-5 h-5" />}
                label="AI Configuration"
                description={`Provider: ${settings.aiSettings.provider}`}
                onClick={() => navigate('/settings/ai')}
              />
            )}
          </Card>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">Appearance</h2>
          <Card className="overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Palette className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Theme</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize',
                      settings.theme === theme
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Help & Privacy */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2 px-1">Support</h2>
          <Card className="overflow-hidden divide-y divide-border">
            <SettingItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help & FAQ"
              onClick={() => window.open('https://nona.app/help', '_blank')}
            />
            <SettingItem
              icon={<Shield className="w-5 h-5" />}
              label="Privacy Policy"
              onClick={() => window.open('https://nona.app/privacy', '_blank')}
            />
          </Card>
        </section>

        {/* Sign Out */}
        {user && (
          <Card className="overflow-hidden">
            <SettingItem
              icon={<LogOut className="w-5 h-5" />}
              label="Sign Out"
              onClick={handleLogout}
              danger
            />
          </Card>
        )}

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground py-4">
          nona v1.0.0
        </p>
      </div>
    </AppLayout>
  );
};

export default Settings;
