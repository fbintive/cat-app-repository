import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

test('test click', async () => {
  const electronApp = await electron.launch({ args: ['src/tests/main.js'] });
  const appWindow = await electronApp.firstWindow();
  const name = await appWindow.innerText('.dashboard-header');
  expect(name).toBe('Get you random daily cat fact');
  // await appWindow.click('text=Get you random daily cat fact');
  await electronApp.close();
});

// (async () => {
//   const electronApp = await electron.launch({ args: ['main.js'] });

//   const appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
//   console.log(appPath);

//   const window = await electronApp.firstWindow();
//   console.log(await window.title());
//   await window.screenshot({ path: 'intro.png' });
//   window.on('console', console.log);
//   await electronApp.close();
// })();
