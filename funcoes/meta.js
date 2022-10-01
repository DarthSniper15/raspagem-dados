const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const bcb = 'https://www.bcb.gov.br';

exports.handler = async function(event, context){

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true
    });

    const page = await browser.newPage();
    await page.goto(bcb);

    const ipca = await page.evaluate(() => { return  document.querySelector('.col-md-6.mt-md-0 .mr-2').innerHTML;});
    const selic = await page.evaluate(() => { return  document.querySelector('.percentual.light.mr-2').innerHTML; });  
    const copom = await page.evaluate(() => { return  document.querySelector('.col-md-6.mt-md-0 .mb-md-2').textContent; });
    const meta = await page.evaluate(() => { return  document.querySelector('.mb-md-2 tr:nth-child(1) td').textContent; });
    const tole = await page.evaluate(() => { return  document.querySelector('.mb-md-2 tr+ tr td').textContent; });
  
    console.log("Dados Banco Central\n");
    console.log('Meta para inflação: ', meta, '\nTolerância: ', tole);
    console.log('IPCA: ', ipca, '12 meses', '\nTaxa Selic: ', selic);
    console.log(copom);


    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'Ok',
            page:{
                ipca,
                selic,
                copom,
                meta,
                tole
            }
        })
    };
}
