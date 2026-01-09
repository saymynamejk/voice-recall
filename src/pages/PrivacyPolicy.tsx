import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <AppLayout title="Privacy Policy" showBack showSettings={false}>
      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Last updated: January 9, 2026</p>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="text-muted-foreground">
            At nona, we take your privacy seriously. This policy describes what personal data we collect, 
            how we use it, and your rights regarding your data.
          </p>
        </Card>

        <Card className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">Account Information</h4>
                <p>When you create an account, we collect your email address and display name. 
                If you sign in with a third-party provider (Google, Apple), we receive basic profile 
                information from that provider.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Voice Recordings</h4>
                <p>We store the voice notes you record within the app. These recordings are encrypted 
                at rest and in transit. You maintain full ownership and control over your recordings.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Usage Data</h4>
                <p>We collect anonymized usage statistics to improve our service, including app 
                interactions, feature usage, and performance metrics. This data cannot be linked 
                back to individual users.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Device Information</h4>
                <p>We may collect device type, operating system version, and app version for 
                compatibility and troubleshooting purposes.</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain the nona service</li>
              <li>To sync your data across your devices</li>
              <li>To process voice notes with AI features (when enabled)</li>
              <li>To send important service updates and notifications</li>
              <li>To improve and optimize our application</li>
              <li>To respond to support requests</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">3. AI Processing & Transcription</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>When AI features are enabled:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Voice recordings are sent to our secure processing servers</li>
                <li>Audio is processed in real-time and deleted immediately after transcription</li>
                <li>We do <span className="font-medium text-foreground">not</span> use your audio to train AI models</li>
                <li>Transcriptions are stored with your notes and encrypted</li>
                <li>You can disable AI features at any time in Settings</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Data Storage & Security</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>All data is encrypted in transit using TLS 1.3</li>
                <li>Data at rest is encrypted using AES-256</li>
                <li>We use secure, SOC 2 compliant cloud infrastructure</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access to user data is strictly limited and logged</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Data Sharing</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>We do <span className="font-medium text-foreground">not</span> sell your personal data. 
              We may share data only in these circumstances:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>With your explicit consent</li>
                <li>With service providers who assist in operating our service (under strict agreements)</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-foreground">Access</span> - Request a copy of your personal data</li>
                <li><span className="font-medium text-foreground">Export</span> - Download all your data in a portable format</li>
                <li><span className="font-medium text-foreground">Correct</span> - Update or correct your account information</li>
                <li><span className="font-medium text-foreground">Delete</span> - Request deletion of your account and data</li>
                <li><span className="font-medium text-foreground">Restrict</span> - Limit how we process your data</li>
                <li><span className="font-medium text-foreground">Object</span> - Opt out of certain data processing activities</li>
              </ul>
              <p className="mt-3">To exercise these rights, go to Settings {">"} Account or contact us at privacy@nona.app.</p>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">7. Data Retention</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>We retain your data as follows:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-medium text-foreground">Active accounts:</span> Data is retained while your account is active</li>
                <li><span className="font-medium text-foreground">Deleted content:</span> Removed from backups within 30 days</li>
                <li><span className="font-medium text-foreground">Deleted accounts:</span> All data deleted within 30 days</li>
                <li><span className="font-medium text-foreground">Anonymized data:</span> May be retained indefinitely for analytics</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">8. Children's Privacy</h3>
            <p className="text-muted-foreground">
              nona is not intended for users under 13 years of age. We do not knowingly collect 
              personal information from children. If we learn we have collected data from a child 
              under 13, we will delete it promptly.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">9. International Data Transfers</h3>
            <p className="text-muted-foreground">
              Your data may be processed in countries outside your residence. We ensure appropriate 
              safeguards are in place, including Standard Contractual Clauses for transfers to 
              countries without adequacy decisions.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">10. Changes to This Policy</h3>
            <p className="text-muted-foreground">
              We may update this policy from time to time. We will notify you of significant changes 
              via email or in-app notification. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-3">11. Contact Us</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>For privacy-related questions or concerns:</p>
              <p className="font-medium text-foreground">privacy@nona.app</p>
              <p className="mt-4">Data Protection Officer:</p>
              <p className="font-medium text-foreground">dpo@nona.app</p>
            </div>
          </section>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrivacyPolicy;
