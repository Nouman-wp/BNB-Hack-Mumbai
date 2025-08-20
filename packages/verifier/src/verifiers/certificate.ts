import { Verifier, VerifierContext, VerificationResult } from './types';
import fetch from 'node-fetch';

export class CertificateVerifier implements Verifier {
  type = 'certificate' as const;

  // List of trusted certificate providers
  private trustedDomains = [
    'coursera.org',
    'udemy.com',
    'edx.org',
    'codecademy.com',
    'pluralsight.com',
    'udacity.com',
    // Add more trusted domains as needed
  ];

  async verify(context: VerifierContext): Promise<VerificationResult> {
    const checks: VerificationResult['checks'] = [];
    const evidence: Record<string, any> = {};

    try {
      // Parse and validate URL
      const url = new URL(context.url);
      
      // Check if the domain is trusted
      const isTrustedDomain = this.trustedDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );

      checks.push({
        name: 'trusted_provider',
        success: isTrustedDomain,
        message: isTrustedDomain
          ? 'Certificate provider is trusted'
          : 'Certificate provider is not in trusted list',
      });

      // Fetch the certificate page
      const response = await fetch(context.url);
      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }

      // Check if the page is accessible
      checks.push({
        name: 'certificate_accessible',
        success: true,
        message: 'Certificate page is accessible',
      });

      // Store metadata
      evidence.certificate = {
        provider: url.hostname,
        url: context.url,
        fetchedAt: new Date().toISOString(),
        statusCode: response.status,
        contentType: response.headers.get('content-type'),
      };

      // Note: In a future enhancement, we could:
      // 1. Use OCR to extract text from certificate images
      // 2. Implement provider-specific verification (e.g., Coursera API)
      // 3. Add blockchain verification for on-chain certificates
      // For now, we'll just verify the URL is accessible and from a trusted provider

      const success = checks.every(check => check.success);

      return {
        success,
        checks,
        evidence,
      };
    } catch (error) {
      return {
        success: false,
        checks,
        evidence,
        error: error instanceof Error ? error.message : 'Certificate verification failed',
      };
    }
  }
}
