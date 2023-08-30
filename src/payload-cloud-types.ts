/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    'atlas-orgs': AtlasOrg;
    'atlas-projects': AtlasProject;
    deployments: Deployment;
    jobs: Job;
    media: Media;
    plans: Plan;
    projects: Project;
    teams: Team;
    'teardown-errors': TeardownError;
    templates: Template;
    users: User;
  };
  globals: {};
}
export interface AtlasOrg {
  id: string;
  atlasOrgID?: string;
  atlasProjects?: string[] | AtlasProject[];
  projectCount?: number;
  updatedAt: string;
  createdAt: string;
}
export interface AtlasProject {
  id: string;
  atlasProjectID?: string;
  projects?: string[] | Project[];
  projectCount?: number;
  updatedAt: string;
  createdAt: string;
}
export interface Project {
  id: string;
  slug: string;
  status?: 'draft' | 'published' | 'deleted';
  deletedOn?: string;
  skipSync?: boolean;
  troubleshoot?: boolean;
  name: string;
  plan?: string | Plan;
  team: string | Team;
  region?: 'us-east' | 'us-west' | 'eu-west';
  template?: string | Template;
  makePrivate?: boolean;
  repositoryName?: string;
  digitalOceanAppID?: string;
  source?: 'github';
  repositoryFullName?: string;
  repositoryID?: string;
  installID?: string;
  deploymentBranch?: string;
  outputDirectory?: string;
  buildScript?: string;
  installScript?: string;
  runScript?: string;
  rootDirectory?: string;
  cloudflareCacheKey?: string;
  cloudflareDNSRecordID?: string;
  defaultDomain?: string;
  domains?: {
    domain: string;
    cloudflareID?: string;
    recordType?: 'A' | 'CNAME';
    recordName?: string;
    recordContent?: string;
    id?: string;
  }[];
  atlasProjectID?: string;
  atlasConnectionString?: string;
  atlasDatabaseName?: string;
  atlasDatabaseType?: 'cluster' | 'serverless';
  atlasDatabaseUser?: string;
  atlasDatabasePassword?: string;
  cognitoIdentityID?: string;
  cognitoIdentityPoolID?: string;
  cognitoUserPoolID?: string;
  cognitoUserPoolClientID?: string;
  s3Bucket?: string;
  s3BucketRegion?: string;
  cognitoPassword?: string;
  PAYLOAD_SECRET?: string;
  environmentVariables?: {
    key?: string;
    value?: string;
    id?: string;
  }[];
  stripeSubscriptionID?: string;
  stripeSubscriptionStatus?:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid'
    | 'paused';
  resendAPIKey?: string;
  resendAPIKeyID?: string;
  resendDomainID?: string;
  defaultDomainResendDNSRecords?: {
    cloudflareID: string;
    type: 'MX' | 'TXT' | 'CNAME';
    name: string;
    value: string;
    id?: string;
  }[];
  customEmailDomains?: {
    domain: string;
    resendDomainID?: string;
    resendAPIKeyID?: string;
    resendAPIKey?: string;
    customDomainResendDNSRecords?: {
      type: 'MX' | 'TXT' | 'CNAME';
      name: string;
      value: string;
      priority?: number;
      id?: string;
    }[];
    id?: string;
  }[];
  infraStatus?:
    | 'notStarted'
    | 'infraCreationError'
    | 'awaitingDatabase'
    | 'appCreationError'
    | 'deploying'
    | 'deployError'
    | 'done'
    | 'error';
  updatedAt: string;
  createdAt: string;
}
export interface Plan {
  id: string;
  name: string;
  slug: string;
  stripeProductID?: string;
  priceJSON?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  order?: number;
  description?: string;
  highlight?: boolean;
  features?: {
    icon?: 'check' | 'x';
    feature?: string;
    id?: string;
  }[];
  updatedAt: string;
  createdAt: string;
}
export interface Team {
  id: string;
  name: string;
  slug: string;
  members?: {
    user?: string | User;
    roles?: ('owner' | 'admin' | 'user')[];
    joinedOn?: string;
    id?: string;
  }[];
  invitations?: {
    user?: string | User;
    email?: string;
    roles?: ('owner' | 'admin' | 'user')[];
    invitedOn?: string;
    id?: string;
  }[];
  sendEmailInvitationsTo?: {
    user?: string | User;
    email?: string;
    roles?: ('owner' | 'admin' | 'user')[];
    id?: string;
  }[];
  billingEmail: string;
  stripeCustomerID?: string;
  skipSync?: boolean;
  createdBy?: string | User;
  updatedAt: string;
  createdAt: string;
}
export interface User {
  id: string;
  name?: string;
  githubID?: string;
  teams?: {
    team?: string | Team;
    roles?: ('owner' | 'admin' | 'user')[];
    invitedOn?: string;
    joinedOn?: string;
    id?: string;
  }[];
  roles?: ('admin' | 'user')[];
  githubAccessToken?: string;
  githubAccessTokenExpiration?: number;
  githubRefreshToken?: string;
  githubRefreshTokenExpiration?: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  _verified?: boolean;
  _verificationToken?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Template {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  templateOwner: string;
  templateRepo: string;
  templateBranch?: string;
  templatePath?: string;
  order?: number;
  image?: string | Media;
  files?: {
    path: string;
    content?: string;
    encoding?: string;
    id?: string;
  }[];
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}
export interface Deployment {
  id: string;
  project: string | Project;
  cause: 'manual' | 'push' | 'initial' | 'configChange' | 'webhook';
  deploymentID: string;
  commitSha?: string;
  commitMessage?: string;
  lastSync?: string;
  deploymentStatus?:
    | 'UNKNOWN'
    | 'PENDING_BUILD'
    | 'BUILDING'
    | 'PENDING_DEPLOY'
    | 'DEPLOYING'
    | 'ACTIVE'
    | 'SUPERSEDED'
    | 'ERROR'
    | 'CANCELED';
  deployStepStatus?: 'UNKNOWN' | 'PENDING' | 'RUNNING' | 'ERROR' | 'SUCCESS';
  buildStepStatus?: 'UNKNOWN' | 'PENDING' | 'RUNNING' | 'ERROR' | 'SUCCESS';
  updatedAt: string;
  createdAt: string;
}
export interface Job {
  id: string;
  type: 'deployApp' | 'provisionDNS';
  processing?: boolean;
  seenByWorker?: boolean;
  deployApp?: {
    project: string | Project;
  };
  provisionDNS?: {
    project: string | Project;
  };
  hasError?: boolean;
  error?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface TeardownError {
  id: string;
  project: {
    projectID?: string;
    name: string;
    teamName?: string;
    teamID: string;
  };
  serviceErrors?: {
    service?: string;
    error?: string;
    id?: string;
  }[];
  updatedAt: string;
  createdAt: string;
}
