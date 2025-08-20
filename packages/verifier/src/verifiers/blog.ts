import { Verifier, VerifierContext, VerificationResult } from './types';
import fetch from 'node-fetch';
import { load } from 'cheerio';

export class BlogVerifier implements Verifier {
  type = 'blog' as const;

  async verify(context: VerifierContext): Promise<VerificationResult> {
    const checks: VerificationResult['checks'] = [];
    const evidence: Record<string, any> = {};

    try {
      // Fetch the blog post
      const response = await fetch(context.url);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }

      const html = await response.text();
      const $ = load(html);

      // Extract metadata
      const metadata = {
        title: $('meta[property="og:title"]').attr('content') || $('title').text(),
        description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
        author: $('meta[property="article:author"]').attr('content') || $('meta[name="author"]').attr('content'),
        published: $('meta[property="article:published_time"]').attr('content'),
        modified: $('meta[property="article:modified_time"]').attr('content'),
      };

      // Check if the page exists
      checks.push({
        name: 'page_exists',
        success: true,
        message: 'Page is accessible',
      });

      // Check for minimum content length (e.g., 500 characters)
      const content = $('article').text() || $('main').text() || $('body').text();
      const hasSubstantialContent = content.length > 500;

      checks.push({
        name: 'content_length',
        success: hasSubstantialContent,
        message: hasSubstantialContent
          ? 'Content length is sufficient'
          : 'Content length is too short',
      });

      // Check for publication date
      const hasPublicationDate = Boolean(metadata.published);
      checks.push({
        name: 'publication_date',
        success: hasPublicationDate,
        message: hasPublicationDate
          ? 'Publication date found'
          : 'No publication date found',
      });

      // Store evidence
      evidence.metadata = metadata;
      evidence.contentPreview = content.substring(0, 500) + '...';
      evidence.url = {
        final: response.url, // In case of redirects
        status: response.status,
      };

      // Add RSS/Feed discovery if available
      const feedUrl = $('link[type="application/rss+xml"]').attr('href') ||
                     $('link[type="application/atom+xml"]').attr('href');
      if (feedUrl) {
        evidence.feed = {
          url: new URL(feedUrl, context.url).toString(),
          type: $('link[type="application/rss+xml"]').length ? 'RSS' : 'Atom',
        };
      }

      // All checks passed if we have substantial content and a publication date
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
        error: error instanceof Error ? error.message : 'Blog verification failed',
      };
    }
  }
}
