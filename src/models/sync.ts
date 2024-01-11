export interface ISyncSettings {
    'site-url': string;
    astro_key: string;
    'preview-site-url': string;
    cloudflare_deploy_hook: string;
    'posts-per-page': string;
    'cssUrl': string;
    'adminUrl': string;
}

export interface IBuildResult {
    code: number;
    output: string[];
    success: boolean;
}
