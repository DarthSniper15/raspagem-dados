const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')


const urlbcb = 'https://www.bcb.gov.br';

exports.handler = async (event, context) => {
  console.log('Iniciando Raspagem de Dados...');
  
  const  browser = await puppeteer.launch({  
      args: chromium.args,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
      headless: true,
    });
  
    const page = await browser.newPage();

    await page.goto(urlbcb);
    
    const ipca = await page.evaluate(() => { return  document.querySelector('.col-md-6.mt-md-0 .mr-2').innerHTML;});
    const selic = await page.evaluate(() => { return  document.querySelector('.percentual.light.mr-2').innerHTML; });  
    const copom = await page.evaluate(() => { return  document.querySelector('.col-md-6.mt-md-0 .mb-md-2').textContent; });
    const meta = await page.evaluate(() => { return  document.querySelector('.mb-md-2 tr:nth-child(1) td').textContent; });
    const tole = await page.evaluate(() => { return  document.querySelector('.mb-md-2 tr+ tr td').textContent; });
            
    console.log("Dados Banco Central\n");
    console.log('Meta para inflação: ', meta, '\nTolerância: ', tole);
    console.log('IPCA: ', ipca, '12 meses', '\nTaxa Selic: ', selic);
    console.log(copom);

    console.log('Raspagem Concluida', urlbcb);
    if (browser !== null) {
      await browser.close()
    }

  return {
    statusCode: 200,
    body: JSON.stringify({
      title: 'Funcionando',
    })
  }
}
