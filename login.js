const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  try {
    // 读取 accounts.json 文件中的 JSON 字符串
    const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
    const accounts = JSON.parse(accountsJson);

    for (const account of accounts) {
      const { username, password } = account;

      const page = await browser.newPage();

      try {
        await page.goto('https://nic.eu.org/arf/en/');
      
        // 等待页面加载完成
        await page.waitForSelector('#id_handle');
        await page.waitForSelector('#id_password');
        await page.waitForSelector('.action[type="submit"]');
      
        // 清空Handle输入框的原有值-FREE
        await page.evaluate(() => {
          document.querySelector('#id_handle').value = '';
        });

        // 输入用户名和密码
        await page.type('#id_handle', username);
        await page.type('#id_password', password);
      
        // 提交登录表单
        await page.click('.action[type="submit"]');
      
        // 等待登录成功（如果有跳转页面的话）
        await page.waitForNavigation();
        
        console.log(`账号 ${username} 登录成功！`);
      } catch (error) {
        console.error(`账号 ${username} 登录时出现错误: ${error}`);
      } finally {
        // 关闭页面
        await page.close();

        // 用户之间添加随机延时
        const delay = Math.floor(Math.random() * 5000) + 1000; // 随机延时1秒到6秒之间
        await delayTime(delay);
      }
    }

    console.log('所有账号登录成功！');
  } catch (error) {
    console.error(`登录时出现错误: ${error}`);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
})();

// 自定义延时函数
function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
