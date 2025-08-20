import { Octokit } from '@octokit/rest';
import { Verifier, VerifierContext, VerificationResult } from './types';

export class GitHubVerifier implements Verifier {
  type = 'github' as const;
  private octokit: Octokit;

  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is required for GitHub verification');
    }
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async verify(context: VerifierContext): Promise<VerificationResult> {
    const checks: VerificationResult['checks'] = [];
    const evidence: Record<string, any> = {};

    try {
      // Parse GitHub URL
      const urlParts = new URL(context.url);
      if (!urlParts.pathname.startsWith('/')) {
        throw new Error('Invalid GitHub URL');
      }

      const pathParts = urlParts.pathname.split('/').filter(Boolean);
      const [owner, repo, type, ...rest] = pathParts;

      // Check if it's a commit or repository
      if (type === 'commit') {
        return await this.verifyCommit(owner, repo, rest[0], context, checks, evidence);
      } else if (!type || type === 'tree') {
        return await this.verifyRepository(owner, repo, context, checks, evidence);
      } else {
        throw new Error('URL must be a GitHub commit or repository');
      }
    } catch (error) {
      return {
        success: false,
        checks: [{
          name: 'url_validation',
          success: false,
          message: error instanceof Error ? error.message : 'Verification failed',
        }],
        evidence: {},
        error: 'Verification failed',
      };
    }
  }

  private async verifyCommit(
    owner: string,
    repo: string,
    commitSha: string,
    context: VerifierContext,
    checks: VerificationResult['checks'],
    evidence: Record<string, any>
  ): Promise<VerificationResult> {
    try {
      // Check repository visibility
      const repository = await this.octokit.repos.get({ owner, repo });
      checks.push({
        name: 'repository_visibility',
        success: !repository.data.private,
        message: repository.data.private 
          ? 'Repository must be public'
          : 'Repository is public',
      });

      // Get commit details
      const commit = await this.octokit.repos.getCommit({
        owner,
        repo,
        ref: commitSha,
      });

      // Verify commit exists
      checks.push({
        name: 'commit_exists',
        success: true,
        message: 'Commit found',
      });

      // Verify commit author
      const authorEmail = commit.data.commit.author?.email;
      const authorLogin = commit.data.author?.login;
      
      evidence.commit = {
        sha: commit.data.sha,
        message: commit.data.commit.message,
        author: {
          name: commit.data.commit.author?.name,
          email: authorEmail,
          login: authorLogin,
        },
        date: commit.data.commit.author?.date,
        stats: commit.data.stats,
      };

      // Check if the committer is associated with the GitHub account
      const userEmails = await this.octokit.users.listEmailsForAuthenticatedUser();
      const isAuthorEmail = userEmails.data.some(email => email.email === authorEmail);

      checks.push({
        name: 'commit_authorship',
        success: isAuthorEmail,
        message: isAuthorEmail 
          ? 'Commit author verified'
          : 'Could not verify commit authorship',
      });

      // All checks passed
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
        error: error instanceof Error ? error.message : 'Commit verification failed',
      };
    }
  }

  private async verifyRepository(
    owner: string,
    repo: string,
    context: VerifierContext,
    checks: VerificationResult['checks'],
    evidence: Record<string, any>
  ): Promise<VerificationResult> {
    try {
      // Check repository visibility
      const repository = await this.octokit.repos.get({ owner, repo });
      checks.push({
        name: 'repository_visibility',
        success: !repository.data.private,
        message: repository.data.private 
          ? 'Repository must be public'
          : 'Repository is public',
      });

      // Check repository ownership/contribution
      const contributors = await this.octokit.repos.listContributors({
        owner,
        repo,
      });

      const userContribution = contributors.data.find(
        c => c.login === context.owner
      );

      checks.push({
        name: 'repository_contribution',
        success: Boolean(userContribution),
        message: userContribution
          ? `Found ${userContribution.contributions} contributions`
          : 'No contributions found',
      });

      // Gather repository evidence
      evidence.repository = {
        name: repository.data.name,
        description: repository.data.description,
        stars: repository.data.stargazers_count,
        forks: repository.data.forks_count,
        created_at: repository.data.created_at,
        updated_at: repository.data.updated_at,
        language: repository.data.language,
        topics: repository.data.topics,
      };

      if (userContribution) {
        evidence.contribution = {
          commits: userContribution.contributions,
        };
      }

      // All checks passed
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
        error: error instanceof Error ? error.message : 'Repository verification failed',
      };
    }
  }
}
