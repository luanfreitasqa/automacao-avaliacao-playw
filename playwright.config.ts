import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './config/env';

const bddTestDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts'],
  outputDir: '.features-gen',
});

export default defineConfig({
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.apiUrl,
      },
    },

    {
      name: 'bdd',
      testDir: bddTestDir,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.baseUrl,
      },
    },
  ],
});