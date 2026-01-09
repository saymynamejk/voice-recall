import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Type, Layout, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const Appearance = () => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [compactMode, setCompactMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun, preview: 'bg-white' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, preview: 'bg-zinc-900' },
    { value: 'system' as const, label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-zinc-900' },
  ];

  return (
    <AppLayout title="Appearance" showBack showSettings={false}>
      <div className="space-y-6">
        {/* Theme Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Theme</h2>
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <motion.button
                  key={t.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    'relative p-3 rounded-xl border-2 transition-all',
                    theme === t.value
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  )}
                >
                  <div className={cn('h-16 rounded-lg mb-2 border border-border', t.preview)} />
                  <div className="flex items-center justify-center gap-1.5">
                    <t.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </div>
                  {theme === t.value && (
                    <motion.div
                      layoutId="theme-check"
                      className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="text-primary-foreground text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Typography</h2>
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                <Type className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Font Size</p>
                <p className="text-sm text-muted-foreground">{fontSize}px</p>
              </div>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Default</span>
              <span>Large</span>
            </div>
          </Card>
        </section>

        {/* Layout Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Layout</h2>
          <Card className="overflow-hidden divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing between elements
                  </p>
                </div>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          </Card>
        </section>

        {/* Accessibility Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Accessibility</h2>
          <Card className="overflow-hidden divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Reduced Motion</p>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations
                  </p>
                </div>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">High Contrast</p>
                  <p className="text-sm text-muted-foreground">
                    Increase color contrast
                  </p>
                </div>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
          </Card>
        </section>

        {/* Preview */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Preview</h2>
          <Card className="p-4">
            <div className="space-y-3" style={{ fontSize: `${fontSize}px` }}>
              <p className="font-semibold">Sample Heading</p>
              <p className="text-muted-foreground">
                This is how your text will appear with the current settings.
                Adjust the options above to customize your experience.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm">
                  Primary
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Secondary
                </span>
                <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-sm">
                  Accent
                </span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Appearance;
