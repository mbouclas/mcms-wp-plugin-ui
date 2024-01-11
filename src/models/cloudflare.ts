export enum CloudflareBuildStageKeys {
    QUEUED = 'queued',
    INITIALIZE = 'initialize',
    CLONE_REPO = 'clone_repo',
    BUILD = 'build',
    DEPLOY = 'deploy',
}

export enum CloudflareBuildStatus {
    SUCCESS = 'success',
    IDLE = 'idle',
    ACTIVE = 'active',
    FAILURE = 'failure',
    CANCELED = 'canceled',

}

export const CloudflareBuildStages = [
  {
    id: CloudflareBuildStageKeys.QUEUED,
    label: 'Queued'
  },
  {
    id: CloudflareBuildStageKeys.INITIALIZE,
    label: 'Initialize'
  },
  {
    id: CloudflareBuildStageKeys.CLONE_REPO,
    label: 'Cloning Repo'
  },
  {
    id: CloudflareBuildStageKeys.BUILD,
    label: 'Building Application'
  },
  {
    id: CloudflareBuildStageKeys.DEPLOY,
    label: 'Deploying Application to CDN'
  },
]

export interface ICloudflareResultInfo {
  count: number;
    total_count: number;
    per_page: number;
    page: number;
    total_pages: number;
}

export interface ICloudflareBuildQueryQueryResult {
  result: ICloudflareHistoryResult;
}

export interface ICloudflareHistoryQueryResult {
  result: ICloudflareHistoryResult[];
  result_info: ICloudflareResultInfo;
}
export interface ICloudflareHistoryResult {
  id: string;
  short_id: string;
  project_id: string;
  project_name: string;
  environment: string;
  url: string;
  created_on: string;
  modified_on: string;
  latest_stage: ICloudflareBuildLatestStage;
  deployment_trigger: DeploymentTrigger;
  stages?: (ICloudflareBuildStage)[] | null;
  build_config: BuildConfig;
  source: Source;
  env_vars: EnvVars;
  compatibility_date: string;
  compatibility_flags?: any[] | null;
  build_image_major_version: number;
  usage_model: string;
  aliases?: null;
  is_skipped: boolean;
  production_branch: string;
}
export interface ICloudflareBuildLatestStage {
  name: CloudflareBuildStageKeys;
  started_on: string;
  ended_on: string;
  status: CloudflareBuildStatus;
}
export interface DeploymentTrigger {
  type: string;
  metadata: Metadata;
}
export interface Metadata {
  branch: string;
  commit_hash: string;
  commit_message: string;
  commit_dirty: boolean;
}
export interface ICloudflareBuildStage {
  name: CloudflareBuildStageKeys;
  started_on: string;
  ended_on: string;
  status: string;
}
export interface BuildConfig {
  build_command: string;
  destination_dir: string;
  build_caching?: null;
  root_dir: string;
  web_analytics_tag?: null;
  web_analytics_token?: null;
}
export interface Source {
  type: string;
  config: Config;
}
export interface Config {
  owner: string;
  repo_name: string;
  production_branch: string;
  pr_comments_enabled: boolean;
}
export interface ADMINURL {
  type: string;
  value: string;
}
export interface EnvVars {
  ADMIN_URL: ADMINURL;
  API_BASE_URL: APIBASEURL;
  ASTRO_KEY: ASTROKEY;
  BASE_URL: BASEURL;
  MCMS_ENDPOINT: MCMSENDPOINT;
  SITE_BASE_URL: SITEBASEURL;
  WP_ENDPOINT: WPENDPOINT;
}
export interface APIBASEURL {
  type: string;
  value: string;
}
export interface ASTROKEY {
  type: string;
  value: string;
}
export interface BASEURL {
  type: string;
  value: string;
}
export interface MCMSENDPOINT {
  type: string;
  value: string;
}
export interface SITEBASEURL {
  type: string;
  value: string;
}
export interface WPENDPOINT {
  type: string;
  value: string;
}
